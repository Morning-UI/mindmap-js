import { MindMarkTypes, MindMark, XmindMarkerMethods } from '../interface';
export declare const APPENDS_LIST: {
    link: {
        index: number;
        state: string;
    };
    note: {
        index: number;
        state: string;
    };
};
export declare const TAG: {
    state: string;
};
export declare const XMIND_MARKER_MAP: {
    [type in MindMarkTypes]?: {
        [value in MindMark]?: {
            method: XmindMarkerMethods;
            name: string;
        };
    };
};
