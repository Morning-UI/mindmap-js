import {
    MindmapNodeItem,
    MindmapDataItem,
    MindmapCoreL0Type,
    MindmapItemGetter,
    MindmapXmindItem,
    MindMarkTypes,
    XmindMarkerMethods,
}                                               from '../interface';
import {
    XMIND_MARKER_MAP,
}                                               from '../base/const';

export const dataItemGetter: MindmapItemGetter<MindmapDataItem> = {
    text : (model) => model.text,
    link : (model) => model.link,
    mark : (model) => model.mark,
    note : (model) => model.note,
    tag : (model) => model.tag,
    children : (model, callback, getter, mindmap) => {

        if (model.children) {

            return callback(model.children, getter, mindmap);

        }

        return undefined;

    },
    folded : (model) => model.folded,
};

export const nodeItemGetter: MindmapItemGetter<MindmapNodeItem> = {
    ...dataItemGetter,
    id : (model) => model.id,
    type : (model) => model.type,
    anchorPoints : (model) => model.anchorPoints,
    children : (model, callback, getter, mindmap) => {

        if (model.children) {

            return callback(model.children, getter, mindmap);

        }

        return undefined;

    },
    style : (model) => model.style,
};

export const xmindItemGetter: MindmapItemGetter<MindmapXmindItem> = {
    title : (model) => model.text,
    note : (model) => model.note,
    href : (model) => model.link,
    labels : (model) => model.tag,
    branch : (model) => (model.folded ? 'folded' : undefined),
    marker : (model) => {

        const markTypes = Object.keys(model.mark || {}) as MindMarkTypes[];

        if (markTypes.length === 0) {

            return {};

        }

        const marker: {
            [key in XmindMarkerMethods]?: string;
        } = {};

        for (const mark of markTypes) {

            const item = XMIND_MARKER_MAP[mark][model.mark[mark]];

            marker[item.method] = item.name;

        }

        return marker;

    },
    children : (model, callback, getter, mindmap) => {

        const children = model.folded ? model._foldedChildren : model.children;

        if (children) {

            return callback(children, getter, mindmap);

        }

        return undefined;

    },
};

export const pluckDataFromModels = <T>(
    models: MindmapNodeItem[],
    getter: MindmapItemGetter<T>,
    mindmap: MindmapCoreL0Type,
): T[] => {

    const targetData: T[] = [];

    let _models = models;

    if (!Array.isArray(_models)) {

        _models = [_models];

    }

    for (const model of _models) {

        const targetItem: T = {} as T;

        for (const key in getter) {

            const getterFn =  getter[key];
            const val = getterFn(model, pluckDataFromModels, getter, mindmap);

            targetItem[key] = val;

        }

        targetData.push(targetItem);

    }

    return targetData;

};
