import { test, expect } from '@playwright/test';
import { bypassSessionPicker } from './utils/session';

test.describe('Combat Flow & Minions', () => {
    test.beforeEach(async ({ page }) => {
        await bypassSessionPicker(page);
    });

    test('should manage minion lifecycle (add, remove, clear)', async ({ page }) => {
        // Navigate to Combat tab
        const combatBtn = page.getByRole('button', { name: 'Combat' });
        await combatBtn.click();

        // 1. Add Minion
        await page.getByLabel('Quick Add Skeleton').click();

        // [TODO: Re-enable once InitiativeTracker is implemented]
        // Verify Initiative Tracker shows the skeleton
        // await expect(page.locator('h3').filter({ hasText: /^Initiative$/i })).toBeVisible({ timeout: 10000 });
        // await expect(page.getByText(/Skeleton 1/i)).toBeVisible();

        // Verify Minion Bubble appears or update UI
        // In the new UI, the MinionDrawer might be triggered via a bubble or button
        const bubble = page.getByLabel('Manage Minions');
        await expect(bubble).toBeVisible();
        await bubble.click();

        // 2. Remove Minion
        await expect(page.getByRole('heading', { name: 'Necromancy', exact: true })).toBeVisible();
        await page.getByRole('button', { name: /remove minion/i }).first().click();

        // Final expectation: No undead raised or skeleton 1 gone
        // Close drawer if needed to check background, but let's check inside drawer first
        await expect(page.getByText(/Skeleton 1/i)).not.toBeVisible();

        // 3. Clear All
        // Re-open drawer or use current state
        await page.getByLabel('Close').click(); // Close
        await page.getByLabel('Quick Add Skeleton').click(); // Add again
        await bubble.click(); // Open again
        await page.getByRole('button', { name: /Dismiss All/i }).click();

        await expect(page.getByText(/No undead raised/i)).toBeVisible();

        // Close drawer explicitly
        await page.getByLabel('Close').click();
    });

    test('should verify spell casting flow with concentration', async ({ page }) => {
        // Navigate to Spellbook
        const spellbookBtn = page.getByRole('button', { name: 'Spellbook' });
        await spellbookBtn.click();

        // Find and Cast Web
        await expect(page.getByRole('heading', { name: /^Web$/i })).toBeVisible({ timeout: 10000 });
        const webCard = page.locator('div.glass-card, div.group').filter({ has: page.getByRole('heading', { name: /^Web$/i }) }).first();
        await webCard.getByRole('button', { name: /cast/i }).click();

        // Handle CastModal
        const castModal = page.getByRole('dialog');
        await expect(castModal).toBeVisible();
        await expect(castModal.getByRole('heading', { name: /Cast Web/i })).toBeVisible();
        await castModal.getByRole('button', { name: /Cast Spell/i }).click();

        // Verify Resolution Panel in Overlay
        // The overlay might have a specific class or be a modal
        await expect(page.getByRole('heading', { name: /Saving Throw/i })).toBeVisible();

        // Click "Failed Save"
        await page.getByRole('button', { name: /Failed Save/i }).click();

        // Verify ConcentrationToggle shows concentration
        await expect(page.getByText(/Web/i)).toBeVisible();

        // Break concentration manually via Toggle
        await page.getByText(/Web/i).click();

        // Confirm drop
        await expect(page.getByText(/Drop Concentration/i)).toBeVisible();
        await page.getByRole('button', { name: /Drop/i }).click();

        await expect(page.getByText(/Web/i)).not.toBeVisible();
    });
});
