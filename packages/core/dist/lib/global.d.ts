export var __esModule: boolean;
declare namespace _default {
    export const version: string;
    export const rootContainerClassName: string;
    export const nodeContainerClassName: string;
    export const edgeContainerClassName: string;
    export const customGroupContainerClassName: string;
    export const delegateContainerClassName: string;
    export const defaultShapeFillColor: string;
    export const defaultShapeStrokeColor: string;
    export const defaultLoopPosition: string;
    export namespace nodeLabel {
        export namespace style {
            export const fill: string;
            export const textAlign: string;
            export const textBaseline: string;
        }
        export const offset: number;
    }
    export const defaultNode: {
        type: string;
        style: {
            fill: string;
            lineWidth: number;
            stroke: string;
        };
        size: number;
        color: string;
    };
    export namespace edgeLabel {
        export namespace style_1 {
            const fill_1: string;
            export { fill_1 as fill };
            const textAlign_1: string;
            export { textAlign_1 as textAlign };
            const textBaseline_1: string;
            export { textBaseline_1 as textBaseline };
        }
        export { style_1 as style };
    }
    export const defaultEdge: {
        type: string;
        style: {
            stroke: string;
        };
        size: number;
        color: string;
    };
    export const nodeStateStyle: {};
    export namespace delegateStyle {
        const fill_2: string;
        export { fill_2 as fill };
        export const fillOpacity: number;
        export const stroke: string;
        export const strokeOpacity: number;
        export const lineDash: number[];
    }
}
export default _default;
