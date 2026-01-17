import { test, expect } from '@playwright/test';

test.describe('Spellbook Filtering & Search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /spells/i }).click();
    });

    test('should search for spells by name', async ({ page }) => {
        const searchInput = page.getByPlaceholder(/Search spells.../i);
        await searchInput.fill('Magic Missile');

        await expect(page.getByRole('heading', { name: 'Magic Missile', exact: true })).toBeVisible();
        // Fireball should not be visible when searching for Magic Missile
        await expect(page.getByRole('heading', { name: 'Fireball', exact: true })).not.toBeVisible();
    });

    test('should filter spells by school', async ({ page }) => {
        // School filter is a select
        const schoolSelect = page.locator('select').first(); // The first select is school
        await schoolSelect.selectOption('Necromancy');

        await expect(page.getByRole('heading', { name: 'Animate Dead', exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Fireball', exact: true })).not.toBeVisible();
    });

    test('should filter spells by level', async ({ page }) => {
        // Level tabs are buttons
        await page.getByRole('button', { name: 'Lvl 3', exact: true }).click();

        await expect(page.getByRole('heading', { name: 'Fireball', exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Magic Missile', exact: true })).not.toBeVisible();
    });

    test('should toggle prepared spells only', async ({ page }) => {
        // initial state has many spells, some prepared
        // click "Prepared Only"
        await page.getByRole('button', { name: /Prepared Only/i }).click();

        // Fireball is prepared in initialState.ts
        await expect(page.getByRole('heading', { name: 'Fireball', exact: true })).toBeVisible();

        // Find a spell that is NOT prepared (e.g. "Acid Splash" Cantrip?)
        // Let's check a known non-prepared spell. 
        // In initialState.ts, Cantrips aren't listed in preparedSpells, but SpellCard logic says Cantrips are always castable.
        // Wait, SpellList.tsx: if (showPreparedOnly) spells = spells.filter(s => preparedSpells.includes(s.id));
        // So even cantrips must be in preparedSpells if they want to show up in "Prepared Only".

        // Acid Splash should not be visible if not prepared
        await expect(page.getByRole('heading', { name: 'Acid Splash', exact: true })).not.toBeVisible();
    });
});
