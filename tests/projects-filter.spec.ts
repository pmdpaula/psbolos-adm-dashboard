import { expect, test } from "@playwright/test";

// Funções de filtro (copiadas do componente)
const getNextSunday = (dateString: string) => {
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  date.setDate(date.getDate() + daysUntilSunday);
  return date;
};

const getDateOnly = (dateString: string) => {
  // Extrai apenas a data (YYYY-MM-DD) sem interpretar como UTC
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Mock de ProjectDto
interface MockProjectDto {
  id: string;
  name: string;
  eventDate: string;
  statusCode: string;
}

// Setup: usar uma data fixa para os testes: 3 de fevereiro de 2026 (segunda-feira)
const now = new Date(2026, 1, 3); // Mês é 0-indexed
now.setHours(0, 0, 0, 0);
const todayDateString = "2026-02-03";

test("deve retornar domingo da semana como fim desta semana", () => {
  const thisWeekEnd = getNextSunday(todayDateString);
  expect(thisWeekEnd.getDay()).toBe(0); // Domingo
  expect(thisWeekEnd.getDate()).toBe(8); // 8 de fevereiro
});

test("deve incluir projetos de hoje em esta semana", () => {
  const project: MockProjectDto = {
    id: "1",
    name: "Projeto hoje",
    eventDate: "2026-02-03T00:00:00",
    statusCode: "PLANNING",
  };

  const eventDate = getDateOnly(project.eventDate);
  const thisWeekEnd = getNextSunday(todayDateString);

  expect(eventDate >= now).toBeTruthy();
  expect(eventDate <= thisWeekEnd).toBeTruthy();
});

test("deve incluir projetos de domingo em esta semana", () => {
  const project: MockProjectDto = {
    id: "2",
    name: "Projeto domingo",
    eventDate: "2026-02-08T00:00:00", // Próximo domingo
    statusCode: "PLANNING",
  };

  const eventDate = getDateOnly(project.eventDate);
  const thisWeekEnd = getNextSunday(todayDateString);

  expect(eventDate >= now).toBeTruthy();
  expect(eventDate <= thisWeekEnd).toBeTruthy();
});

test("deve excluir projetos da próxima semana", () => {
  const project: MockProjectDto = {
    id: "3",
    name: "Projeto próxima semana",
    eventDate: "2026-02-10T00:00:00", // Terça-feira da próxima semana
    statusCode: "PLANNING",
  };

  const eventDate = getDateOnly(project.eventDate);
  const thisWeekEnd = getNextSunday(todayDateString);

  expect(eventDate > thisWeekEnd).toBeTruthy();
});

test("deve retornar segundo domingo como fim da próxima semana", () => {
  const thisWeekEnd = getNextSunday(todayDateString);
  const nextWeekEnd = new Date(thisWeekEnd);
  nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

  expect(nextWeekEnd.getDate()).toBe(15); // 15 de fevereiro
});

test("deve incluir projetos de segunda até domingo da próxima semana", () => {
  const projects: MockProjectDto[] = [
    {
      id: "4",
      name: "Segunda próxima",
      eventDate: "2026-02-09T00:00:00",
      statusCode: "PLANNING",
    },
    {
      id: "5",
      name: "Quarta próxima",
      eventDate: "2026-02-11T00:00:00",
      statusCode: "PLANNING",
    },
    {
      id: "6",
      name: "Domingo próximo",
      eventDate: "2026-02-15T00:00:00",
      statusCode: "PLANNING",
    },
  ];

  const thisWeekEnd = getNextSunday(todayDateString);
  const nextWeekEnd = new Date(thisWeekEnd);
  nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

  projects.forEach((project) => {
    const eventDate = getDateOnly(project.eventDate);
    const isInNextWeek = eventDate > thisWeekEnd && eventDate <= nextWeekEnd;
    expect(isInNextWeek).toBeTruthy();
  });
});

test("deve ignorar projetos concluídos", () => {
  const completedProject: MockProjectDto = {
    id: "7",
    name: "Projeto concluído",
    eventDate: "2026-02-05T00:00:00",
    statusCode: "COMPLETED",
  };

  const shouldInclude =
    completedProject.statusCode !== "COMPLETED" &&
    completedProject.statusCode !== "CANCELLED";

  expect(shouldInclude).toBeFalsy();
});

test("deve ignorar projetos cancelados", () => {
  const cancelledProject: MockProjectDto = {
    id: "8",
    name: "Projeto cancelado",
    eventDate: "2026-02-05T00:00:00",
    statusCode: "CANCELLED",
  };

  const shouldInclude =
    cancelledProject.statusCode !== "COMPLETED" &&
    cancelledProject.statusCode !== "CANCELLED";

  expect(shouldInclude).toBeFalsy();
});

test("deve incluir projetos em produção", () => {
  const producingProject: MockProjectDto = {
    id: "9",
    name: "Projeto em produção",
    eventDate: "2026-02-05T00:00:00",
    statusCode: "PRODUCING",
  };

  const shouldInclude =
    producingProject.statusCode !== "COMPLETED" &&
    producingProject.statusCode !== "CANCELLED";

  expect(shouldInclude).toBeTruthy();
});

test("deve ignorar horários - apenas considerar a data", () => {
  const projectWithTime: MockProjectDto = {
    id: "10",
    name: "Projeto com hora",
    eventDate: "2026-02-05T14:30:45", // Com hora, minutos e segundos
    statusCode: "PLANNING",
  };

  const eventDate = getDateOnly(projectWithTime.eventDate);
  // Deve ter apenas data, hora zerada
  expect(eventDate.getHours()).toBe(0);
  expect(eventDate.getMinutes()).toBe(0);
  expect(eventDate.getSeconds()).toBe(0);
  expect(eventDate.getDate()).toBe(5);
});

test("não deve sofrer com diferença de fuso horário", () => {
  // Data armazenada como UTC
  const utcDateString = "2026-02-05T03:00:00Z"; // 05/02 03:00 UTC
  const dateOnly = getDateOnly(utcDateString);

  // Deve extrair apenas a data (05/02), ignorando o tempo
  expect(dateOnly.getDate()).toBe(5);
  expect(dateOnly.getMonth()).toBe(1); // Fevereiro (0-indexed)
});

test("fluxo completo: filtrar projetos de uma semana específica", () => {
  const projects: MockProjectDto[] = [
    {
      id: "1",
      name: "Hoje",
      eventDate: "2026-02-03T00:00:00",
      statusCode: "PLANNING",
    },
    {
      id: "2",
      name: "Amanhã",
      eventDate: "2026-02-04T00:00:00",
      statusCode: "PLANNING",
    },
    {
      id: "3",
      name: "Domingo",
      eventDate: "2026-02-08T00:00:00",
      statusCode: "PLANNING",
    },
    {
      id: "4",
      name: "Concluído",
      eventDate: "2026-02-05T00:00:00",
      statusCode: "COMPLETED",
    },
    {
      id: "5",
      name: "Segunda próxima",
      eventDate: "2026-02-09T00:00:00",
      statusCode: "PLANNING",
    },
    {
      id: "6",
      name: "Cancelado",
      eventDate: "2026-02-10T00:00:00",
      statusCode: "CANCELLED",
    },
  ];

  const thisWeekEnd = getNextSunday(todayDateString);
  const nextWeekEnd = new Date(thisWeekEnd);
  nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);

  // Filtrar projetos desta semana
  const thisWeekProjects = projects.filter((project) => {
    const eventDate = getDateOnly(project.eventDate);
    const isWithinWeek = eventDate >= now && eventDate <= thisWeekEnd;
    const isNotCompleted = project.statusCode !== "COMPLETED";
    const isNotCancelled = project.statusCode !== "CANCELLED";

    return isWithinWeek && isNotCompleted && isNotCancelled;
  });

  // Deve incluir: Hoje, Amanhã, Domingo
  // Deve excluir: Concluído (status)
  expect(thisWeekProjects).toHaveLength(3);
  expect(thisWeekProjects.map((p) => p.id)).toEqual(["1", "2", "3"]);
});
