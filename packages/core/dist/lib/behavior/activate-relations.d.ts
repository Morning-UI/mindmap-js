export var __esModule: boolean;
declare namespace _default {
    export function getDefaultCfg(): {
        trigger: string;
        activeState: string;
        inactiveState: string;
        resetSelected: boolean;
        shouldUpdate: () => boolean;
    };
    export function getEvents(): {
        'node:mouseenter': string;
        'node:mouseleave': string;
        'node:click'?: undefined;
        'canvas:click'?: undefined;
    } | {
        'node:click': string;
        'canvas:click': string;
        'node:mouseenter'?: undefined;
        'node:mouseleave'?: undefined;
    };
    export function setAllItemStates(e: any): void;
    export function clearActiveState(e: any): void;
    export function clearAllItemStates(e: any): void;
}
export default _default;
