import type { Session, CharacterData, Minion } from '../types';
import { initialCharacterData } from '../data/initialState';
import {
    getProfBonus,
    getAbilityMod,
    getSpellSlotsWithUsed,
    calculateMaxHP,
    calculateSpellSaveDC,
} from './srdRules';

const SESSIONS_KEY = 'aramancia-sessions';
const ACTIVE_SESSION_KEY = 'aramancia-active-session';

/**
 * Schema version for CharacterData migrations
 * Increment this when making breaking changes to CharacterData structure
 */
export const SCHEMA_VERSION = '1.1';
const SCHEMA_VERSION_KEY = 'aramancia-schema-version';

export function generateSessionId(): string {
    return crypto.randomUUID();
}

/**
 * Get the stored schema version
 */
export function getStoredSchemaVersion(): string {
    return localStorage.getItem(SCHEMA_VERSION_KEY) || '1.0';
}

/**
 * Save the current schema version
 */
export function setStoredSchemaVersion(version: string): void {
    localStorage.setItem(SCHEMA_VERSION_KEY, version);
}

/**
 * Migrate a CharacterData object from an older schema version
 * Recalculates derived stats to ensure consistency
 */
export function migrateCharacterData(data: CharacterData, fromVersion: string): CharacterData {
    // Clone to avoid mutation
    let migrated = { ...data };

    // Migration from 1.0 -> 1.1: Recalculate all derived stats
    if (fromVersion === '1.0') {
        const level = migrated.level || 1;
        const conMod = migrated.abilities?.con?.mod ?? getAbilityMod(migrated.abilities?.con?.score ?? 10);
        const intMod = migrated.abilities?.int?.mod ?? getAbilityMod(migrated.abilities?.int?.score ?? 10);
        const hitDieSize = migrated.hitDice?.size ?? 6;

        // Ensure all ability mods are calculated
        if (migrated.abilities) {
            const abilities = migrated.abilities;
            migrated.abilities = {
                str: { score: abilities.str.score, mod: getAbilityMod(abilities.str.score) },
                dex: { score: abilities.dex.score, mod: getAbilityMod(abilities.dex.score) },
                con: { score: abilities.con.score, mod: getAbilityMod(abilities.con.score) },
                int: { score: abilities.int.score, mod: getAbilityMod(abilities.int.score) },
                wis: { score: abilities.wis.score, mod: getAbilityMod(abilities.wis.score) },
                cha: { score: abilities.cha.score, mod: getAbilityMod(abilities.cha.score) },
            };
        }

        // Recalculate derived stats
        const newProfBonus = getProfBonus(level);
        const newMaxHP = calculateMaxHP(level, hitDieSize, conMod);
        const newSpellDC = calculateSpellSaveDC(newProfBonus, intMod);
        const newSlots = getSpellSlotsWithUsed(level, migrated.slots);

        migrated = {
            ...migrated,
            profBonus: newProfBonus,
            hp: {
                ...migrated.hp,
                max: newMaxHP,
                current: Math.min(migrated.hp.current, newMaxHP),
            },
            dc: newSpellDC,
            slots: newSlots,
            hitDice: {
                ...migrated.hitDice,
                max: level,
                current: Math.min(migrated.hitDice.current, level),
            },
        };
    }

    return migrated;
}

/**
 * Migrate a session's character data if needed
 */
export function migrateSession(session: Session, fromVersion: string): Session {
    return {
        ...session,
        characterData: migrateCharacterData(session.characterData, fromVersion),
        lastModified: new Date().toISOString(),
    };
}

/**
 * Check and run migrations on all sessions if schema version changed
 */
export function checkAndRunMigrations(): void {
    const storedVersion = getStoredSchemaVersion();
    
    if (storedVersion !== SCHEMA_VERSION) {
        const sessions = getRawSessions();
        
        if (sessions.length > 0) {
            const migratedSessions = sessions.map(session => 
                migrateSession(session, storedVersion)
            );
            saveSessionsRaw(migratedSessions);
        }
        
        setStoredSchemaVersion(SCHEMA_VERSION);
    }
}

/**
 * Get raw sessions without migration (internal use)
 */
function getRawSessions(): Session[] {
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
}

/**
 * Save sessions without version check (internal use)
 */
function saveSessionsRaw(sessions: Session[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getSessions(): Session[] {
    checkAndRunMigrations();
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function saveSessions(sessions: Session[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getActiveSessionId(): string | null {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
}

export function setActiveSessionId(id: string | null): void {
    if (id) {
        localStorage.setItem(ACTIVE_SESSION_KEY, id);
    } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
}

export function getActiveSession(): Session | null {
    const id = getActiveSessionId();
    if (!id) return null;
    const sessions = getSessions();
    return sessions.find(s => s.id === id) || null;
}

export function createSession(sessionNumber: number, date: string, label?: string): Session {
    const session: Session = {
        id: generateSessionId(),
        sessionNumber,
        date,
        label,
        characterData: { ...initialCharacterData },
        minions: [],
        lastModified: new Date().toISOString()
    };

    const sessions = getSessions();
    sessions.push(session);
    saveSessions(sessions);
    setActiveSessionId(session.id);

    return session;
}

export function updateActiveSession(characterData: CharacterData, minions: Minion[]): void {
    const id = getActiveSessionId();
    if (!id) return;

    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return;

    sessions[index].characterData = characterData;
    sessions[index].minions = minions;
    sessions[index].lastModified = new Date().toISOString();

    saveSessions(sessions);
}

export function deleteSession(id: string): void {
    const sessions = getSessions().filter(s => s.id !== id);
    saveSessions(sessions);

    if (getActiveSessionId() === id) {
        setActiveSessionId(null);
    }
}

export function continueSession(id: string): Session | null {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === id);
    if (session) {
        setActiveSessionId(id);
        return session;
    }
    return null;
}
