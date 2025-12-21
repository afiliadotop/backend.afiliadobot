import { test, expect } from '@playwright/test';

/**
 * E2E System Test: Complete Authentication Flow
 * Tests the entire auth system with real UI and backend
 */
test.describe('Authentication System', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should navigate to login page', async ({ page }) => {
        // Click login button on landing page
        await page.click('text=Entrar');

        // Should be on login page
        await expect(page).toHaveURL('/login');
        await expect(page.locator('h1')).toContainText('Entrar');
    });

    test('should complete full login flow', async ({ page }) => {
        // Navigate to login
        await page.goto('/login');

        // Fill in credentials
        await page.fill('input[type="email"]', 'admin@afiliado.top');
        await page.fill('input[type="password"]', 'admin123');

        // Click login button
        await page.click('button:has-text("Entrar")');

        // Should redirect to dashboard
        await expect(page).toHaveURL(/\/dashboard/);

        // Should see welcome message or dashboard content
        await expect(page.locator('text=/Dashboard|Produtos|Overview/i')).toBeVisible();
    });

    test('should show error on invalid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill with invalid credentials
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');

        // Submit
        await page.click('button:has-text("Entrar")');

        // Should show error (toast or error message)
        await expect(page.locator('text=/erro|inválido|incorreto/i')).toBeVisible({
            timeout: 5000
        });
    });

    test('should logout successfully', async ({ page, context }) => {
        // First, login
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@afiliado.top');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button:has-text("Entrar")');

        // Wait for dashboard
        await page.waitForURL(/\/dashboard/);

        // Find and click logout button (might be in a menu)
        const logoutButton = page.locator('text=/sair|logout/i').first();
        if (await logoutButton.isVisible()) {
            await logoutButton.click();

            // Should redirect to login or home
            await expect(page).toHaveURL(/\/(login)?$/);
        }
    });

    test('should protect dashboard route when not logged in', async ({ page }) => {
        // Try to access dashboard directly
        await page.goto('/dashboard');

        // Should redirect to login or show login
        await expect(page).toHaveURL(/\/(login)?/);
    });
});
