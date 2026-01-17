import { test, expect } from '@playwright/test';

test.describe('Wand & Artifact Usage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should open wand drawer and cast a spell consuming charges', async ({ page }) => {
        // Wand FAB should be visible on home page because character has a wand
        const wandFab = page.locator('button').filter({ has: page.locator('svg') }).nth(0); // AppShell has Wand2 then Skull
        // To be safer, let's find by the Wand2 icon if possible or just the first of the fixed bottom buttons
        // The AppShell code: first is Wand, second is Skull.
        await wandFab.click();

        // Verify Wand Drawer is open
        await expect(page.getByText(/Direstone Runic Wand/i)).toBeVisible();
        await expect(page.getByText(/7/i).locator('xpath=..').getByText(/\/ 7/i)).toBeVisible();

        // Cast Burning Hands (Kenaz (Burning Hands) cost 1)
        await page.getByRole('button', { name: /Kenaz \(Burning Hands\)/i }).click();

        // Verify charge consumed (should be 6/7)
        await expect(page.getByText(/6/i).locator('xpath=..').getByText(/\/ 7/i)).toBeVisible();

        // Cast a concentration spell: Heat Metal (cost 2)
        await page.getByRole('button', { name: /Kenaz \(Heat Metal\)/i }).click();

        // Verify charges (6 - 2 = 4)
        await expect(page.getByText(/4/i).locator('xpath=..').getByText(/\/ 7/i)).toBeVisible();

        // Close Wand Drawer to see the HUD or just check if HUD is visible (it's fixed)
        await page.getByRole('button').filter({ has: page.locator('svg[class*="lucide-x"]') }).click();

        // Bio and Stats tab show CombatHUD (App.tsx line 316: activeTab !== 'home' && activeTab !== 'settings')
        // Wait, let's navigate to Bio to see HUD
        await page.getByRole('button', { name: /bio/i }).click();

        // Verify CombatHUD shows concentration
        const hud = page.locator('.fixed.top-20');
        await expect(hud.getByText(/Concentrating/i)).toBeVisible();
        await expect(hud.getByText(/Heat Metal \(Wand\)/i)).toBeVisible();
    });
});
