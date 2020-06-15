import {
    Workbook,
    Topic,
    Marker,
}                                               from 'xmind/dist/index';
import {
    Dumper,
}                                               from 'xmind/dist/utils/dumper';

declare global {
    interface Window {
        Workbook: new() => Workbook;
        Topic: new(...args: any) => Topic;
        Marker: new(...args: any) => Marker;
        // Zipper: new(...args: any) => Zipper;
        Dumper: new(...args: any) => Dumper;
        __MINDMAP_CLIPBOARD: string;
    }
}

declare module 'clipboard-copy'
