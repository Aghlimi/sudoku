interface Config {
    boxSize: number;
    n: number;
    level: string;
    symbols: string[];
}

interface Note {
    contain: boolean;
    note: string[][];
}

export type { Config, Note };