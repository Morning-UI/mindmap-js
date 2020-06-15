import difference                               from 'lodash.difference';
import {
    TreeGraph,
}                                               from '@antv/g6';
import {
    Item,
}                                               from '@antv/g6/lib/types';
import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    TagFeatures,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    setItemState,
}                                               from '../utils/setItemState';
import {
    getModel,
}                                               from '../utils/G6Ext';

const cleanTagHoverState = (graph: TreeGraph, node: Item): void => {

    const states = node.getStates();

    for (const state of states) {

        if ((/^tag-hover/u).test(state)) {

            setItemState(graph, node.get('id'), state, false);

        }

    }

};

export const tag: TagFeatures.Tag = (options) => {

    const {
        mindmap,
        nodeIds,
        tags,
    } = options;
    const ids = fillNodeIds(nodeIds);

    let _tags = typeof tags === 'string' ? [tags] : tags;

    _tags = difference(_tags, ['']);

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        model.tag = Object.assign([], model.tag).concat(_tags);
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '添加标签',
        undoCmd : {
            cmd : TagFeatures.Commands.Untag,
            opts : {
                nodeIds,
                tags,
            },
        } as Command<TagFeatures.Commands.Untag>,
    };

};

export const tagAll: TagFeatures.TagAll = (options) => {

    const {
        mindmap,
        nodeIds,
        tags,
    } = options;
    const ids = fillNodeIds(nodeIds);
    const undoCmds: Command<TagFeatures.Commands.TagAll>[] = [];

    let _tags = typeof tags === 'string' ? [tags] : tags;

    _tags = difference(_tags, ['']);

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        undoCmds.push({
            cmd : TagFeatures.Commands.TagAll,
            opts : {
                nodeIds : id,
                tags : Object.assign([], model.tag),
            },
        });

        model.tag = Object.assign([], _tags);
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '替换标签',
        undoCmd : undoCmds,
    };

};

export const untag: TagFeatures.Untag = (options) => {

    const {
        mindmap,
        nodeIds,
        tags,
    } = options;
    const ids = fillNodeIds(nodeIds);
    const undoCmds: Command<TagFeatures.Commands.Tag>[] = [];

    let _untags = typeof tags === 'string' ? [tags] : tags;

    _untags = difference(_untags, ['']);

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        if (tags === undefined) {

            // 若tags没有入参，则清除所有tags
            undoCmds.push({
                cmd : TagFeatures.Commands.Tag,
                opts : {
                    nodeIds : id,
                    tags : model.tag,
                },
            });
            model.tag = null;

        } else {

            undoCmds.push({
                cmd : TagFeatures.Commands.Tag,
                opts : {
                    nodeIds : id,
                    tags : _untags,
                },
            });
            model.tag = difference(model.tag, _untags);

        }

        cleanTagHoverState(mindmap.graph, node);
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '删除标签',
        undoCmd : undoCmds,
    };

};
