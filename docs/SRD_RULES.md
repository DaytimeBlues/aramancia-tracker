# SRD 5.1 Rules Reference

## Armor Class (AC)
**Mutually Exclusive Formulas**:
- **Unarmored**: 10 + DEX mod
- **Light Armor**: Armor AC + DEX mod
- **Medium Armor**: Armor AC + DEX mod (max 2)
- **Heavy Armor**: Armor AC (no DEX)
- **Mage Armor (Spell)**: 13 + DEX mod (no armor worn)
- **Shield (Spell)**: +5 AC until start of next turn

> ⚠️ AC calculations are MUTUALLY EXCLUSIVE base formulas + additive bonuses. You cannot stack Mage Armor with worn armor.

## Hit Points
- **Temporary HP (THP)**: Never stacks. If you have 5 THP and gain 8 THP, you choose 8 (replacement, not addition).
- **Damage absorption**: THP is absorbed BEFORE regular HP.
- **Massive Damage**: If damage reduces you to 0 HP and excess damage >= Max HP, instant death.

## Concentration
- Only ONE concentration spell at a time.
- Casting a new concentration spell ends the previous one.
- Taking damage requires a CON save: DC = max(10, damage/2).
- Incapacitated or killed = concentration ends.

## Spell Slots (Multiclass)
- Full casters (Wizard, Cleric, Druid, Sorcerer, Bard): 1x level
- Half casters (Paladin, Ranger): 0.5x level (round down)
- Third casters (Eldritch Knight, Arcane Trickster): 0.33x level (round down)
- **Calculation**: Sum the effective levels, then look up total caster level on Multiclass Spellcaster table.

## Attunement
- Max 3 attuned items (Artificer 10+ can have more, but default is 3).
- Attunement ends on death, 100ft away for 24h, or voluntary.
