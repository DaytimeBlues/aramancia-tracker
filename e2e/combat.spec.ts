import { test, expect } from '@playwright/test';

test.describe('Combat Flow & Minions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should manage minion lifecycle (add, remove, clear)', async ({ page }) => {
        // Navigate to Combat tab
        await page.getByRole('button', { name: /combat/i }).click();

        // Verify initial empty state in CombatView
        await expect(page.getByText(/Undead Horde/i)).toBeVisible();
        // Using a more specific selector to avoid ambiguity
        // 1. Add Minion
        // Find skeleton card and click Quick Add
        await page.getByLabel('Quick Add Skeleton').click();

        // Check Initiative Tracker (New Phase 3 check)
        await expect(page.getByText(/Initiative/i)).toBeVisible();
        await expect(page.getByText(/Skeleton/i)).toBeVisible();
        await expect(page.getByText(/Roll: 10/i)).toBeVisible(); // Default minion poll

        // Open Minion Drawer via FAB (Fitts' Law optimization check)
        await page.locator('button').filter({ hasText: /^1$/ }).click(); // FAB with badge '1'

        await expect(page.getByText(/Current Minions/i)).toBeVisible();
        await expect(page.getByText(/Skeleton 1/i)).toBeVisible();

        // 2. Remove Minion
        await page.getByRole('button', { name: /remove minion/i }).click();
        await expect(page.getByText(/Skeleton 1/i)).not.toBeVisible();

        // 3. Clear All
        await page.getByLabel('Quick Add Skeleton').click();
        await page.getByRole('button', { name: /Manage Minions/i }).click();
        await page.getByRole('button', { name: /Dismiss All/i }).click();

        await expect(page.getByText(/No active minions/i)).toBeVisible();
    });

    test('should verify spell casting flow with concentration', async ({ page }) => {
        await page.goto('/');

        // Navigate to Spells
        await page.getByRole('button', { name: /spells/i }).click();

        // Find and Cast Web
        const webCard = page.locator('div').filter({ hasText: /^Web$/ }).first();
        await expect(webCard).toBeVisible();

        // Cast Web (it is prepared by default)
        await webCard.getByRole('button', { name: /cast spell/i }).click();

        // Handle CastModal
        await expect(page.getByText(/Cast Web/i).first()).toBeVisible();
        // Click final Cast Spell button in the footer
        await page.locator('button').filter({ hasText: /^Cast Spell$/ }).click();

        // Verify Resolution Panel (New Component Name)
        await expect(page.getByText(/Saving Throw/i)).toBeVisible();

        // Click "Failed Save"
        await page.getByRole('button', { name: /Failed Save/i }).click();

        // Verify CombatHUD shows concentration (Fitts' Law HUD)
        // Adjusting selector for the new glassmorphism HUD
        const hud = page.getByTestId('combat-hud');
        await expect(hud).toBeVisible({ timeout: 10000 });
        await expect(hud.getByText(/Web/i)).toBeVisible();

        // Break concentration manually via HUD
        await page.getByRole('button', { name: /Break/i }).click();
        await expect(hud).not.toBeVisible();
    });
});
