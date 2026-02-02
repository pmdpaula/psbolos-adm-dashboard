import { BrowserContext, expect, Page, test } from "@playwright/test";

import { env } from "@/env";

const BASE_URL = "http://localhost:3000";
const TEST_EMAIL = env.TEST_EMAIL!;
const TEST_PASSWORD = env.TEST_PASSWORD!;

// Helper to login
async function login(page: Page) {
  await page.goto(`${BASE_URL}/auth/sign-in`);

  await page.fill('input[id="email"]', TEST_EMAIL);
  await page.fill('input[id="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for redirect to home
  await page.waitForURL(`${BASE_URL}/`);
}

// Helper to get cookies
async function getCookies(context: BrowserContext) {
  const cookies = await context.cookies();
  return {
    accessToken: cookies.find((c) => c.name === "access_token"),
    refreshToken: cookies.find((c) => c.name === "refresh_token"),
  };
}

test.describe.skip("Refresh Token Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies();
  });

  test("should set access_token and refresh_token cookies after login", async ({
    page,
    context,
  }) => {
    await login(page);

    const { accessToken } = await getCookies(context);

    expect(accessToken).toBeDefined();
    expect(accessToken?.value).toBeTruthy();

    // Note: httpOnly cookies may not be visible to Playwright's cookies() API
    // depending on settings, but we can verify it exists
    console.log("Access Token:", accessToken?.value?.substring(0, 20) + "...");
  });

  test("should redirect to refresh route when access token expires", async ({
    page,
    context,
  }) => {
    await login(page);

    // Wait for access token to expire (assuming 10s expiration for testing)
    console.log("Waiting for access token to expire (11 seconds)...");
    await page.waitForTimeout(11000);

    // Navigate to a protected page that requires authentication
    const response = await page.goto(`${BASE_URL}/`);

    // The page should still load successfully (after refresh redirect)
    expect(response?.status()).toBe(200);

    // User should still be on the home page (not redirected to sign-in)
    expect(page.url()).toBe(`${BASE_URL}/`);

    // Verify cookies are still present (new access token)
    const { accessToken } = await getCookies(context);
    expect(accessToken).toBeDefined();
  });

  test.skip("should maintain session during rapid navigation after token expiry", async ({
    page,
  }) => {
    await login(page);

    // Wait for access token to expire
    console.log("Waiting for access token to expire (11 seconds)...");
    await page.waitForTimeout(11000);

    // Simulate rapid navigation (multiple protected routes)
    await page.goto(`${BASE_URL}/`);
    await expect(page).not.toHaveURL(/sign-in/);

    // Navigate again to ensure token was refreshed properly
    await page.goto(`${BASE_URL}/`);
    await expect(page).not.toHaveURL(/sign-in/);
  });

  test("should redirect to sign-in when refresh token is invalid/missing", async ({
    page,
    context,
  }) => {
    await login(page);

    // Clear all cookies to simulate expired/missing refresh token
    await context.clearCookies();

    // Navigate to protected page
    await page.goto(`${BASE_URL}/`);

    // Should be redirected to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });

  test.skip("should handle refresh properly on API call failure", async ({
    page,
    context,
  }) => {
    await login(page);

    // Wait for access token to expire
    console.log("Waiting for access token to expire (11 seconds)...");
    await page.waitForTimeout(11000);

    // Trigger a page that makes API calls
    await page.goto(`${BASE_URL}/`);

    // Verify we're still logged in
    await expect(page).not.toHaveURL(/sign-in/);

    // Verify we can still access protected content
    const { accessToken } = await getCookies(context);
    expect(accessToken).toBeDefined();
  });
});

test.describe("Multiple Requests Concurrency", () => {
  test("should handle concurrent 401 responses without multiple refreshes", async ({
    page,
  }) => {
    await login(page);

    // Wait for access token to expire
    console.log("Waiting for access token to expire (11 seconds)...");
    await page.waitForTimeout(11000);

    // Track network requests
    const refreshRequests: string[] = [];

    page.on("request", (request) => {
      if (request.url().includes("/users/sessions/refresh")) {
        refreshRequests.push(request.url());
      }
    });

    // Navigate to a page that triggers multiple API calls
    await page.goto(`${BASE_URL}/`);
    await page.waitForTimeout(2000); // Wait for potential API calls

    // With proper concurrency control, there should be only ONE refresh request
    // (or the refresh happens via redirect, so 0 direct refresh calls)
    console.log(`Number of refresh requests: ${refreshRequests.length}`);
    expect(refreshRequests.length).toBeLessThanOrEqual(1);

    // User should still be logged in
    await expect(page).not.toHaveURL(/sign-in/);
  });
});
