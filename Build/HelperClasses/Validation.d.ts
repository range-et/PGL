/** Runtime checks at numeric API boundaries. Kept out of hot simulation loops. */
export declare function finiteNumber(value: number, name: string, min?: number, max?: number): void;
export declare function integer(value: number, name: string, min?: number): void;
