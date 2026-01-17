import { test, expect } from '@playwright/test';

test.describe('Combat Flow & Minions', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate and wait for content
        await page.goto('./');

        // Handle SessionPicker with explicit waits
        const startBtn = page.getByRole('button', { name: /Start Session/i });
        const sessionsList = page.locator('div.card-parchment').filter({ hasText: /Sessions/i });

        if (await sessionsList.isVisible()) {
            if (await startBtn.isVisible()) {
                await startBtn.click();
            } else {
                const sessionCard = page.locator('div.cursor-pointer').first();
                if (await sessionCard.isVisible()) {
                    await sessionCard.click();
                }
            }
            await expect(sessionsList).not.toBeVisible({ timeout: 10000 });
        }
    });

    test('should manage minion lifecycle (add, remove, clear)', async ({ page }) => {
        // Navigate to Combat tab
        const combatBtn = page.getByRole('button', { name: 'Combat' });
        await combatBtn.click();

        // 1. Add Minion
        await page.getByLabel('Quick Add Skeleton').click();

        // Verify Initiative Tracker shows the skeleton
        await expect(page.locator('h3').filter({ hasText: /^Initiative$/i })).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/Skeleton 1/i)).toBeVisible();

        // Verify Minion Bubble appears
        const bubble = page.getByLabel('Manage Minions');
        await expect(bubble).toBeVisible();
        await bubble.click();

        // 2. Remove Minion
        await expect(page.getByText(/Necromancy/i)).toBeVisible();
        await page.getByRole('button', { name: /remove minion/i }).first().click();
        await expect(page.getByText(/Skeleton 1/i)).not.toBeVisible();

        // Close drawer explicitly
        await page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first().click();

        // 3. Clear All
        await page.getByLabel('Quick Add Skeleton').click();
        await expect(bubble).toBeVisible();
        await bubble.click();
        await page.getByRole('button', { name: /Dismiss All/i }).click();

        await expect(page.getByText(/No undead raised/i)).toBeVisible();

        // Close drawer explicitly
        await page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first().click();
    });

    test('should verify spell casting flow with concentration', async ({ page }) => {
        // Navigate to Spellbook
        const spellbookBtn = page.getByRole('button', { name: 'Spellbook' });
        await spellbookBtn.click();

        // Find and Cast Web
        await expect(page.getByRole('heading', { name: /^Web$/i })).toBeVisible({ timeout: 10000 });
        const webCard = page.locator('div.group').filter({ has: page.getByRole('heading', { name: /^Web$/i }) }).first();
        await webCard.getByRole('button', { name: /cast spell/i }).click();

        // Handle CastModal
        const castModal = page.locator('div.fixed.z-50').filter({ hasText: /^Cast Web$/i });
        await expect(castModal).toBeVisible();
        await castModal.getByRole('button', { name: /Cast Spell/i }).click();

        // Verify Resolution Panel in Overlay
        const overlay = page.locator('div.fixed.inset-0.z-\\[100\\]');
        await expect(overlay).toBeVisible();
        await expect(overlay.getByRole('heading', { name: /^Web$/i })).toBeVisible();

        // Click "Failed Save"
        await overlay.getByRole('button', { name: /Failed Save/i }).click();

        // Verify CombatHUD shows concentration
        const hud = page.getByTestId('combat-hud');
        await expect(hud).toBeVisible();
        await expect(hud.getByText(/Web/i)).toBeVisible();

        // Break concentration manually via HUD
        await hud.getByRole('button', { name: /Break/i }).click();
        await expect(page.getByTestId('combat-hud')).not.toBeVisible();
    });
});
