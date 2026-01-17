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
        await expect(page.locator('.card-parchment').filter({ hasText: /Undead Horde/i }).getByText(/0 Active/i)).toBeVisible();

        // Open Horde Management Drawer
        await page.getByRole('button', { name: /Manage Horde/i }).click();

        // Verify Drawer is open
        await expect(page.getByText(/Necromancy/i)).first().toBeVisible();

        // Add a Skeleton
        await page.getByRole('button', { name: /Raise Skeleton/i }).click();

        // Verify minion added (checking the counter in the drawer header)
        await expect(page.locator('span').filter({ hasText: '1 Active' })).toBeVisible();

        // Add a Zombie
        await page.getByRole('button', { name: /Raise Zombie/i }).click();

        // Verify both exist
        await expect(page.locator('span').filter({ hasText: '2 Active' })).toBeVisible();
        await expect(page.getByText(/Zombie 1/i)).toBeVisible();

        // Clear All (Dismiss All in UI)
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: /Dismiss All/i }).click();

        // Verify back to empty state in drawer
        await expect(page.locator('span').filter({ hasText: '0 Active' })).toBeVisible();
        await expect(page.getByText(/No undead raised/i)).toBeVisible();
    });

    test('should verify spell casting flow with concentration', async ({ page }) => {
        // Navigate to Spells tab
        await page.getByRole('button', { name: /spells/i }).click();

        // Search for "Web" (Concentration, level 2)
        // We target the heading to be sure it's the right card
        const webHeading = page.getByRole('heading', { name: 'Web', exact: true });
        await expect(webHeading).toBeVisible();

        const webCard = page.locator('div').filter({ has: webHeading });

        // Cast Web (it is prepared by default)
        await webCard.getByRole('button', { name: /cast spell/i }).click();

        // Handle CastModal
        await expect(page.getByText(/Cast Web/i)).first().toBeVisible();
        // Click final Cast Spell button in the footer
        await page.locator('button').filter({ hasText: /^Cast Spell$/ }).click();

        // Verify Resolution Overlay (Web is a Save spell)
        await expect(page.getByText(/Saving Throw/i)).toBeVisible();

        // Click "Failed Save"
        await page.getByRole('button', { name: /Failed Save/i }).click();

        // Verify CombatHUD shows concentration
        const hud = page.locator('.fixed.top-20');
        await expect(hud.getByText(/Concentrating/i)).toBeVisible();
        await expect(hud.getByText(/Web/i)).toBeVisible();
    });
});
