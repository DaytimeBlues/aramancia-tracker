import { test, expect } from '@playwright/test';

test.describe('Familiar & Summon System', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Handle Session Modal if present
        const startSession = page.locator('button:has-text("START SESSION")');
        if (await startSession.isVisible()) {
            await startSession.click();
        }
        await expect(page.locator('button:has-text("Stats")')).toBeVisible();
    });

    test('should summon, dismiss, and recall a familiar', async ({ page }) => {
        await page.screenshot({ path: 'test-results/familiar-init.png' });
        // Open Familiar Drawer via the Feather bubble
        const familiarFab = page.locator('button[title="Find Familiar"]');
        await expect(familiarFab).toBeVisible();
        await familiarFab.click();

        await page.screenshot({ path: 'test-results/familiar-drawer.png' });
        // Check if drawer is open
        await expect(page.locator('h2', { hasText: 'Find Familiar' })).toBeVisible();

        // Select Owl
        await page.locator('button', { hasText: 'owl' }).click();

        // Name it
        await page.locator('input[placeholder="Name your familiar..."]').fill('Hedwig');

        // Summon
        await page.locator('button:has-text("Summon Familiar")').click();

        await page.screenshot({ path: 'test-results/familiar-summoned.png' });
        // Check for toast
        await expect(page.locator('text=Summoned owl familiar!')).toBeVisible();

        // Verify bubble shows Hedwig (title change)
        await expect(page.locator('button[title="Hedwig (owl)"]')).toBeVisible();

        // Damage the familiar
        await page.locator('button[title="Hedwig (owl)"]').click();
        await page.locator('button:has-text("Damage")').click();

        // Verify death (Owl has 1 HP)
        await expect(page.locator('text=Hedwig has died!')).toBeVisible();
        await expect(page.locator('svg.lucide-skull')).toBeVisible();

        await page.locator('button:has-text("Heal")').click();
        await expect(page.locator('button:has-text("Dismiss")')).toBeEnabled();

        await page.locator('button:has-text("Dismiss")').click();
        await expect(page.locator('svg.lucide-eye-off')).toBeVisible();

        await page.locator('button[title="Hedwig (owl)"]').click();
        await page.locator('button:has-text("Recall")').click();
    });

    test('should manage multiple summons via SummonManager', async ({ page }) => {
        // Go to Combat tab
        await page.locator('button:has-text("Combat")').last().click();

        // Toggle to Combat mode (Execution) only if not already active
        const combatToggle = page.locator('button[aria-label="Execution Mode"]');
        if (await combatToggle.getAttribute('aria-pressed') === 'false') {
            await combatToggle.click();
        }

        // Wait for FAB to appear (it's conditional on activeTab === 'combat' AND isExecutionMode)
        const summonFab = page.locator('button[title="Summon Creatures"]');
        await expect(summonFab).toBeVisible({ timeout: 10000 });
        await summonFab.click();

        await page.screenshot({ path: 'test-results/summon-manager-final.png' });

        // Select Wolf
        await page.locator('button', { hasText: 'Wolf' }).click();

        // Select Slot L3
        await page.locator('button', { hasText: 'L3' }).click();

        // Increase count
        await page.locator('button >> svg.lucide-plus').click(); // 2 wolves

        await page.locator('button:has-text("Summon 2x Wolf")').click();

        // Verify toast
        await expect(page.locator('text=Summoned 2x Wolf!')).toBeVisible();

        // Verify minions added to initiative/list
        await expect(page.locator('text=Wolf 1')).toBeVisible();
        await expect(page.locator('text=Wolf 2')).toBeVisible();
    });
});
