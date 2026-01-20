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

        // Wait for combat view to load
        await expect(page.getByRole('heading', { name: 'Undead Horde' })).toBeVisible({ timeout: 10000 });

        // 1. Add Minion via Quick Add
        await page.getByLabel('Quick Add Skeleton').click();

        // Verify skeleton count increased
        await expect(page.getByRole('button', { name: /1 Skeletons/i })).toBeVisible();

        // Open Minion Drawer
        const manageButton = page.getByRole('button', { name: 'Manage Minions' }).first();
        await manageButton.click();

        // 2. Verify drawer opened and minion is visible
        await expect(page.getByRole('heading', { name: 'Active Servants' })).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('Skeleton 1')).toBeVisible();

        // 3. Remove Minion
        await page.getByRole('button', { name: /Remove Minion/i }).first().click();

        // Verify minion removed
        await expect(page.getByText('Skeleton 1')).not.toBeVisible();

        // 4. Add again and test Dismiss All
        await page.getByRole('button', { name: /Raise Skeleton/i }).click();
        await expect(page.getByText('Skeleton 1')).toBeVisible();

        await page.getByRole('button', { name: /Dismiss All/i }).click();
        await expect(page.getByText(/No undead raised/i)).toBeVisible();

        // Close drawer
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('should verify spell casting flow with concentration', async ({ page }) => {
        // Navigate to Spellbook
        const spellbookBtn = page.getByRole('button', { name: 'Spellbook' });
        await spellbookBtn.click();

        // Wait for spellbook to load
        await expect(page.getByRole('heading', { name: 'Spellbook' })).toBeVisible({ timeout: 10000 });

        // Filter to Level 2 spells to find Web more easily
        await page.getByRole('button', { name: 'Lvl 2' }).click();

        // Find and Cast Web (scroll if needed)
        const webHeading = page.getByRole('heading', { name: /^Web$/i });
        await webHeading.scrollIntoViewIfNeeded();
        await expect(webHeading).toBeVisible({ timeout: 10000 });

        // Find the Web card and click Cast
        const webCard = page.locator('div').filter({ has: webHeading }).first();
        await webCard.getByRole('button', { name: /cast/i }).click();

        // Handle CastModal
        const castModal = page.getByRole('dialog');
        await expect(castModal).toBeVisible();
        await expect(castModal.getByRole('heading', { name: /Cast Web/i })).toBeVisible();
        await castModal.getByRole('button', { name: /Cast Spell/i }).click();

        // Verify Resolution Panel appears
        await expect(page.getByRole('heading', { name: /Saving Throw/i })).toBeVisible({ timeout: 10000 });

        // Click "Failed Save" to complete the spell
        await page.getByRole('button', { name: /Failed Save/i }).click();

        // Verify concentration is now active (via HUD or indicator)
        await expect(page.getByText(/Web/i)).toBeVisible();

        // Navigate back to Stats to find concentration indicator
        await page.getByRole('button', { name: 'Stats' }).click();

        // Verify concentration indicator shows Web
        await expect(page.locator('[data-testid="concentration-indicator"]').or(page.getByText(/Concentrating/i).or(page.getByText(/Web/i)))).toBeVisible();
    });
});
