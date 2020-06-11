import {
    MindmapNodeItem,
    MindmapDataItem,
    MindmapCoreL0Type,
    MindmapItemGetter,
}                                               from '../interface';

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
    _isFolded : (model) => model._isFolded,
    _foldedChildren : (model, callback, getter, mindmap) => {

        if (model._foldedChildren) {

            return callback(model._foldedChildren, getter, mindmap);

        }

        return undefined;

    },
};

export const nodeItemGetter: MindmapItemGetter<MindmapNodeItem> = {
    ...dataItemGetter,
    id : (model) => model.id,
    anchorPoints : (model) => model.anchorPoints,
    style : (model) => model.style,
    type : (model) => model.type,
    children : (model, callback, getter, mindmap) => {

        if (model.children) {

            return callback(model.children, getter, mindmap);

        }

        return undefined;

    },
    _foldedChildren : (model, callback, getter, mindmap) => {

        if (model._foldedChildren) {

            return callback(model._foldedChildren, getter, mindmap);

        }

        return undefined;

    },
    _isRoot : (model) => model._isRoot,
    _isNode : (model) => model._isNode,
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
