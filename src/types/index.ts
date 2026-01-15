export interface Session {
    id: string;
    sessionNumber: number;
    date: string;
    label?: string;
    characterData: CharacterData;
    lastModified: string;
    minions: Minion[];
}