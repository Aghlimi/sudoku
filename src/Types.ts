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

interface Key {
    value: string;
    numberof: number;
}


export type { Config, Note, Key };