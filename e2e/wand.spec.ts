import { test, expect } from '@playwright/test';
import { bypassSessionPicker } from './utils/session';

test.describe('Wand & Artifact Usage', () => {
    test.beforeEach(async ({ page }) => {
        await bypassSessionPicker(page);
    });

    test('should open wand drawer and cast a spell consuming charges', async ({ page }) => {
        // Wand FAB should be visible on home page because character has a wand
        const wandFab = page.getByLabel(/Open Wand Drawer|Wand/i).first();
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

        // Close Wand Drawer
        await page.locator('div.z-50').filter({ hasText: /Runes/i }).getByLabel('Close').click();

        // Bio and Stats tab show CombatHUD or ConcentrationToggle
        await page.getByRole('button', { name: /bio|stats/i }).first().click();

        // Verify ConcentrationToggle shows concentration
        // It's in the FAB stack on the right
        await expect(page.getByText(/Heat Metal \(Wand\)/i)).toBeVisible();
    });
});
