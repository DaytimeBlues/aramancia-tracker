import { describe, it, expect, beforeEach } from 'vitest';
import {
    getSessions,
    createSession,
    setActiveSessionId,
    getActiveSession,
    saveSessions,
} from '../utils/sessionStorage';

const SESSIONS_KEY = 'aramancia-sessions';

describe('sessionStorage utilities', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('creates a new session and marks it as active', () => {
        const session = createSession(1, '2026-01-01', 'Session One');
        const active = getActiveSession();

        expect(active?.id).toBe(session.id);
        expect(active?.sessionNumber).toBe(1);
        expect(active?.label).toBe('Session One');
    });

    it('migrates and validates legacy sessions with missing fields', () => {
        const legacy = [{
            id: 'legacy-1',
            sessionNumber: 1,
            date: '2024-01-01',
            lastModified: '2024-01-01',
            version: '1.0',
            characterData: { hp: { current: 10, max: 10, temp: 0 }, level: 1 },
            minions: [{ id: 'm1', type: 'skeleton', hp: 5, maxHp: 5, ac: 10 }],
        }];

        localStorage.setItem(SESSIONS_KEY, JSON.stringify(legacy));
        const sessions = getSessions();

        expect(sessions).toHaveLength(1);
        expect(sessions[0].minions[0].speed).toBe(30);
        expect(sessions[0].version).toBe('2.0');
    });

    it('returns empty sessions when stored data is invalid', () => {
        localStorage.setItem(SESSIONS_KEY, '{broken json');
        expect(getSessions()).toEqual([]);
    });

    it('persists sessions and allows selecting active session', () => {
        const session = createSession(2, '2026-02-02');
        saveSessions([session]);
        setActiveSessionId(session.id);

        const active = getActiveSession();
        expect(active?.id).toBe(session.id);
    });
});
