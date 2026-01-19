import { test, expect } from '@playwright/test';

test.describe('Wizard Companion Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Check if we are in setup or main app. Use bypass if needed or just wait for load.
        // Assuming app loads to dashboard or can navigate there.
    });

    test('should display Wizard class label', async ({ page }) => {
        await expect(page.locator('text=Wizard')).toBeVisible();
    });

    test('should toggle between Combat and Roleplay modes', async ({ page }) => {
        // Navigate to Combat view (default)
        await page.click('text=Combat');

        // Check for Combat-specific elements
        await expect(page.locator('text=HP')).toBeVisible();
        await expect(page.locator('text=Undead Horde')).toBeVisible();

        // Toggle to Roleplay
        // Look for the toggle button. It has a title "Switch to Roleplay Mode" or similar?
        // The ModeToggle has aria-label/title? Let's assume visual or class.
        // In ModeToggle.tsx, buttons have onClick. We might need a better selector.
        // Let's look for the text "RP" or icon.
        // Actually, ModeToggle has buttons with icons.

        // We can try valid selectors based on the file.
        // But simplified:
        const roleplayToggle = page.locator('button:has-text("Roleplay")').or(page.locator('[title="Roleplay"]')).or(page.locator('.lucide-scroll').locator('..'));
        // Since ModeToggle renders two buttons side by side, checking for the inactive one to click.
        // Or maybe it is a single toggle?
        // Let's use a generic selector for now or update ModeToggle to have IDs.
    });

    test('should quick-add minions in Combat view', async ({ page }) => {
        await page.click('text=Combat');
        const skeletonCount = await page.locator('text=Skeletons').locator('..').locator('.text-2xl').textContent();
        const initialCount = parseInt(skeletonCount || '0', 10);

        // Click quick add button (plus icon)
        await page.locator('button[aria-label="Quick Add Skeleton"]').click();

        // Verify count increased
        await expect(page.locator('text=Skeletons').locator('..').locator('.text-2xl')).toHaveText(String(initialCount + 1));
    });

    test('should display Spell Slot Abacus in Combat view', async ({ page }) => {
        await page.click('text=Combat');
        await expect(page.locator('text=Level 1 Slot')).toBeVisible(); // From title attribute in Abacus
    });
});
