import { Page, expect } from '@playwright/test';

/**
 * Common logic to handle the session picker and get to the main app view.
 */
export async function bypassSessionPicker(page: Page) {
    await page.goto('./');

    const startBtn = page.getByRole('button', { name: /Start Session/i });
    const sessionsList = page.locator('div.card-parchment').filter({ hasText: /Sessions/i });

    // Wait for either the landing page content or the app content
    await expect(page.locator('body')).toBeVisible();

    if (await sessionsList.isVisible({ timeout: 10000 })) {
        if (await startBtn.isVisible()) {
            await startBtn.click();
        } else {
            const sessionCard = page.locator('div.cursor-pointer').first();
            if (await sessionCard.isVisible()) {
                await sessionCard.click();
            }
        }
        // Wait for session picker to disappear
        await expect(sessionsList).not.toBeVisible({ timeout: 15000 });
    }

    // Secondary check: verify main navigation is visible
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 15000 });
}
