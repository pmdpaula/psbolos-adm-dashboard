# Implementação de Autenticação com Refresh Token - Frontend

## Contexto da API

- **Access Token**: Expira em 30s
- **Refresh Token**: Expira em 7 dias
- **Endpoint de login**: `POST /users/sessions` → retorna `access_token`, `refresh_token`, `access_token_expires_in`, `refresh_token_expires_at`
- **Endpoint de Google OAuth**: `GET /auth/google/callback` → retorna os mesmos dados
- **Endpoint de refresh**: `POST /users/sessions/refresh` com `{ "refresh_token": "..." }` → retorna novo `access_token`, `refresh_token`, etc.

---

## ⚠️ O Problema

O frontend está sendo desconectado quando o **access token expira** porque:
1. O access token expira em 30s
2. O frontend continua tentando usar o token expirado
3. A API rejeita o token expirado
4. O frontend não está fazendo refresh automático

---

## ✅ Solução: Implementação com React + Ky

### 1. Serviço de API (Ky)

```typescript
// src/services/api.ts
import ky, { HTTPError } from 'ky';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthResponse extends TokenResponse {
  user?: User;
}

class ApiService {
  private api = ky.create({
    prefixUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  private isRefreshing = false;
  private failedQueue: Array<(token: string) => void> = [];

  constructor() {
    // Criar instância com hooks para interceptar requisições e respostas
    this.api = ky.create({
      prefixUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
      hooks: {
        beforeRequest: [
          (request) => {
            // Adicionar token ao header antes de cada requisição
            const token = this.getAccessToken();
            if (token) {
              request.headers.set('Authorization', `Bearer ${token}`);
            }
          },
        ],
        afterResponse: [
          async (request, options, response) => {
            // Interceptar respostas 401
            if (response.status === 401) {
              // Clonar request para retry
              const clonedRequest = request.clone();

              // Se já está fazendo refresh, aguarda na fila
              if (this.isRefreshing) {
                return new Promise((resolve) => {
                  this.failedQueue.push((token: string) => {
                    const retryRequest = request.clone();
                    retryRequest.headers.set('Authorization', `Bearer ${token}`);
                    resolve(ky(retryRequest));
                  });
                });
              }

              this.isRefreshing = true;

              try {
                const refreshToken = this.getRefreshToken();
                if (!refreshToken) {
                  // Sem refresh token, faz logout
                  this.clearTokens();
                  window.location.href = '/login';
                  return response;
                }

                // Tenta fazer refresh
                const newTokens = await this.refreshAccessToken(refreshToken);
                
                // Salva novos tokens
                this.setTokens(newTokens);

                // Processa fila de requisições pendentes
                this.failedQueue.forEach((callback) =>
                  callback(newTokens.access_token)
                );
                this.failedQueue = [];

                // Retry da requisição original com novo token
                const retryRequest = clonedRequest.clone();
                retryRequest.headers.set(
                  'Authorization',
                  `Bearer ${newTokens.access_token}`
                );

                return ky(retryRequest);
              } catch (refreshError) {
                // Falha ao fazer refresh, faz logout
                this.clearTokens();
                window.location.href = '/login';
                return response;
              } finally {
                this.isRefreshing = false;
              }
            }

            return response;
          },
        ],
      },
    });
  }

  // ===== Métodos de Autenticação =====

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('users/sessions', {
      json: {
        email,
        password,
      },
    }).json<AuthResponse>();

    this.setTokens(response);
    return response;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await this.api.post('users/sessions/refresh', {
      json: {
        refresh_token: refreshToken,
      },
    }).json<TokenResponse>();

    return response;
  }

  async logout(): Promise<void> {
    try {
      // Opcional: notificar backend se houver endpoint de logout
      await this.api.post('users/sessions/sign-out');
    } catch (error) {
      console.error('Erro ao fazer sign-out:', error);
    }
    this.clearTokens();
  }

  // ===== Gerenciamento de Tokens =====

  private setTokens(data: TokenResponse): void {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('access_token_expires_in', String(data.access_token_expires_in));
    localStorage.setItem('refresh_token_expires_at', data.refresh_token_expires_at);
    localStorage.setItem('tokens_updated_at', String(Date.now()));
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token_expires_in');
    localStorage.removeItem('refresh_token_expires_at');
    localStorage.removeItem('tokens_updated_at');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // ===== Requisições Públicas =====

  async get<T = any>(url: string, options?: any) {
    return this.api.get(url, options).json<T>();
  }

  async post<T = any>(url: string, data?: any, options?: any) {
    return this.api.post(url, { json: data, ...options }).json<T>();
  }

  async put<T = any>(url: string, data?: any, options?: any) {
    return this.api.put(url, { json: data, ...options }).json<T>();
  }

  async delete<T = any>(url: string, options?: any) {
    return this.api.delete(url, options).json<T>();
  }
}

export const apiService = new ApiService();
```

---

### 2. Hook de Autenticação (React)

```typescript
// src/hooks/useAuth.ts
import { useContext, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      setUser(response.user || null);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return {
    user,
    isAuthenticated: apiService.isAuthenticated(),
    isLoading,
    login,
    logout,
  };
}
```

---

### 3. Contexto de Autenticação (Opcional, para usar em toda app)

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se já tem token salvo ao carregar a app
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Aqui você poderia fazer uma requisição GET /me para validar o token
      // e obter dados do usuário
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      setUser(response.user || null);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      // Redireciona para o callback do Google na API
      // A API retorna os tokens que você salva
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/callback`;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!localStorage.getItem('access_token'),
        isLoading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
```

---

### 4. Componente de Login

```typescript
// src/pages/Login.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      // Redirecionado automaticamente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Google OAuth */}
      <a href={`${process.env.REACT_APP_API_URL}/auth/google/login`}>
        Entrar com Google
      </a>
    </div>
  );
}
```

---

## 🔄 Fluxo Completo

```
1. Usuário faz login
   ↓
2. Frontend salva access_token + refresh_token (localStorage)
   ↓
3. Frontend faz requisição com Access Token no header
   ↓
4. Access Token expira em 30s
   ↓
5. API retorna 401
   ↓
6. Interceptor detecta 401 e chama POST /users/sessions/refresh
   ↓
7. Backend valida refresh_token e retorna novo access_token
   ↓
8. Interceptor salva novo token e retry da requisição original
   ↓
9. Usuário continua logado por até 7 dias ✅
```

---

## ⚙️ Configuração Necessária

Crie um arquivo `.env` no frontend:

```bash
REACT_APP_API_URL=http://localhost:3000
```

---

## 🎯 Pontos Importantes

✅ **Token refresh automático**: Acontece antes de falhar a requisição  
✅ **Sem interrupção UX**: Usuário não vê desconexão  
✅ **Fila de requisições**: Requisições pendentes aguardam novo token  
✅ **Segurança**: Tokens em localStorage (considere usar httpOnly cookies em produção)  
✅ **Logout automático**: Se refresh token expirar, faz logout  

---

## � Como usar o serviço no componente

Com KY, as chamadas ficam mais simples:

```typescript
// Fazer login
const response = await apiService.login('user@example.com', 'password');

// Fazer requisição GET
const data = await apiService.get('/customers');

// Fazer requisição POST
const result = await apiService.post('/customers', { name: 'João' });

// Fazer requisição PUT
const updated = await apiService.put('/customers/123', { name: 'Maria' });

// Fazer requisição DELETE
await apiService.delete('/customers/123');
```

## 🚀 Alternativa: Com TanStack Query (React Query) + Ky

Se usar React Query, o setup é similar mas com cache invalidation automática. O Ky é particularmente bom com React Query porque ambos são bibliotecas minimalistas.

---

## 📝 Resumo da Correção na API

A API já está correta! ✅

- ✅ Endpoint de login retorna todos os tokens
- ✅ Endpoint de Google callback retorna todos os tokens
- ✅ Endpoint de refresh funciona corretamente

**O problema é 100% no frontend** - precisa implementar o refresh automático como mostrado acima.
