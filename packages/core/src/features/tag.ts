import difference                               from 'lodash.difference';
import {
    TagFeatures,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

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
        note : '设置标签',
        undoCmd : undoCmds,
    };

};
