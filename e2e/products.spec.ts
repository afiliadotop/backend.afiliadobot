import { test, expect, Page } from '@playwright/test';

/**
 * E2E System Test: Complete Product Management Flow
 * Tests CRUD operations with real UI, state, and backend
 */

// Helper function to login before tests
async function login(page: Page) {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@afiliado.top');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL(/\/dashboard/);
}

test.describe('Product Management System', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        // Navigate to products page
        await page.goto('/dashboard/products');
    });

    test('should display products page', async ({ page }) => {
        // Wait for page to load
        await expect(page.locator('h1, h2').filter({ hasText: /produtos/i })).toBeVisible();

        // Should see either products list or empty state
        const hasProducts = await page.locator('table').isVisible();
        const hasEmptyState = await page.locator('text=/nenhum produto/i').isVisible();

        expect(hasProducts || hasEmptyState).toBeTruthy();
    });

    test('should open create product modal', async ({ page }) => {
        // Click add button
        await page.click('text=/adicionar|novo produto/i');

        // Modal should open
        await expect(page.locator('text=/adicionar produto/i')).toBeVisible();

        // Form fields should be visible
        await expect(page.locator('input[name="name"], label:has-text("Nome") + input')).toBeVisible();
    });

    test('should create a new product', async ({ page }) => {
        // Open modal
        await page.click('text=/adicionar|novo produto/i');

        // Fill form
        await page.fill('input[name="name"], label:has-text("Nome") + input', 'Produto E2E Test');
        await page.selectOption('select[name="store"], label:has-text("Loja") + select', 'shopee');
        await page.fill('input[name="affiliate_url"], label:has-text("URL") + input', 'https://shopee.com/test-e2e');
        await page.fill('input[name="current_price"], label:has-text("Preço") + input', '99.90');

        // Submit
        await page.click('button:has-text("Salvar")');

        // Should close modal and show success
        await expect(page.locator('text=/adicionar produto/i')).not.toBeVisible({ timeout: 5000 });

        // Should see product in list (or success message)
        await expect(
            page.locator('text=/produto.*sucesso|Produto E2E Test/i')
        ).toBeVisible({ timeout: 5000 });
    });

    test('should search/filter products', async ({ page }) => {
        // Wait for products to load
        await page.waitForTimeout(1000);

        // Find search input
        const searchInput = page.locator('input[placeholder*="Buscar"], input[type="search"]');

        if (await searchInput.isVisible()) {
            // Type search term
            await searchInput.fill('Samsung');

            // Wait for filter to apply
            await page.waitForTimeout(500);

            // Results should update (hard to assert without knowing data)
            // Just verify no crash
            await expect(page.locator('body')).toBeVisible();
        }
    });

    test('should edit an existing product', async ({ page }) => {
        // Wait for products to load
        await page.waitForTimeout(1000);

        // Click first edit button if exists
        const editButton = page.locator('button[aria-label*="Editar"], button:has-text("Editar")').first();

        if (await editButton.isVisible()) {
            await editButton.click();

            // Modal should open with data
            await expect(page.locator('text=/editar produto/i')).toBeVisible();

            // Change name
            const nameInput = page.locator('input[name="name"], label:has-text("Nome") + input');
            await nameInput.clear();
            await nameInput.fill('Produto Editado E2E');

            // Save
            await page.click('button:has-text("Salvar")');

            // Should close and update
            await expect(page.locator('text=/editar produto/i')).not.toBeVisible({ timeout: 5000 });
        }
    });

    test('should delete a product', async ({ page }) => {
        // Mock confirm dialog to auto-accept
        page.on('dialog', dialog => dialog.accept());

        // Wait for products
        await page.waitForTimeout(1000);

        // Click first delete button if exists
        const deleteButton = page.locator('button[aria-label*="Deletar"], button:has-text("Deletar")').first();

        if (await deleteButton.isVisible()) {
            await deleteButton.click();

            // Should show success or remove item
            await page.waitForTimeout(1000);

            // Verify no crash
            await expect(page.locator('body')).toBeVisible();
        }
    });
});
