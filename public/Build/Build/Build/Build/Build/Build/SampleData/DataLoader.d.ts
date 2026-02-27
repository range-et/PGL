import { default as Graph } from '../Core/Graph';
/**
 *
 * @returns the raw ZKC dataset
 */
declare function LoadZKC(): Promise<Graph>;
/**
 *
 * @returns the ZKC dataset with the positons simulated before hand
 */
declare function LoadZKCSimulated(): Promise<Graph>;
declare const _default: {
    LoadZKC: typeof LoadZKC;
    LoadZKCSimulated: typeof LoadZKCSimulated;
};
export default _default;
