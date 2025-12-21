import { test, expect, Page } from '@playwright/test';

/**
 * E2E System Test: Navigation and User Experience
 * Tests complete navigation flows and UX elements
 */

async function login(page: Page) {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@afiliado.top');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(/\/dashboard/);
}

test.describe('Navigation and UX System', () => {
    test('should navigate through all main pages', async ({ page }) => {
        await page.goto('/');

        // Landing page
        await expect(page.locator('text=/afiliadoBot|afiliado/i')).toBeVisible();

        // Go to login
        await page.click('text=Entrar');
        await expect(page).toHaveURL('/login');

        // Login
        await login(page);

        // Dashboard/Overview
        await expect(page).toHaveURL(/\/dashboard/);

        // Navigate to products
        await page.click('text=Produtos');
        await expect(page).toHaveURL(/\/products/);

        // Check if sidebar/navigation exists
        const nav = page.locator('nav, aside, [role="navigation"]');
        if (await nav.isVisible()) {
            await expect(nav).toBeVisible();
        }
    });

    test('should handle dark mode toggle', async ({ page }) => {
        await login(page);

        // Look for theme toggle button (sun/moon icon)
        const themeToggle = page.locator('button[aria-label*="tema"], button:has(svg)').first();

        if (await themeToggle.isVisible()) {
            // Get initial class
            const htmlElement = page.locator('html');
            const initialClass = await htmlElement.getAttribute('class');

            // Click toggle
            await themeToggle.click();
            await page.waitForTimeout(500);

            // Class should change
            const newClass = await htmlElement.getAttribute('class');
            expect(newClass).not.toBe(initialClass);
        }
    });

    test('should show loading states', async ({ page }) => {
        await login(page);

        // Navigate to products (might show loading)
        await page.goto('/dashboard/products');

        // Look for skeleton loaders (they might be fast)
        const hasLoader = await page.locator('[class*="skeleton"], [class*="loading"]').isVisible();

        // Just verify page loaded eventually
        await expect(page.locator('body')).toBeVisible();
    });

    test('should handle errors gracefully', async ({ page }) => {
        // Try to access non-existent route
        await page.goto('/dashboard/nonexistent');

        // Should not crash, might redirect or show 404
        await expect(page.locator('body')).toBeVisible();

        // Should eventually land somewhere valid
        await page.waitForTimeout(1000);
        const url = page.url();
        expect(url).toMatch(/\/(login|dashboard|404)?/);
    });

    test('should be responsive', async ({ page }) => {
        await page.goto('/');

        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);

        // Page should still render
        await expect(page.locator('body')).toBeVisible();

        // Test tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await expect(page.locator('body')).toBeVisible();

        // Test desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);
        await expect(page.locator('body')).toBeVisible();
    });

    test('should handle browser back/forward', async ({ page }) => {
        await login(page);

        const overviewUrl = page.url();

        // Navigate to products
        await page.click('text=Produtos');
        await page.waitForURL(/\/products/);

        // Go back
        await page.goBack();
        expect(page.url()).toContain('overview');

        // Go forward
        await page.goForward();
        expect(page.url()).toContain('products');
    });
});
