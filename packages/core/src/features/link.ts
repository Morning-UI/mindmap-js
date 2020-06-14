import {
    MindmapNodeItem,
    NodeIds,
    MindmapCoreL0Ctor,
    LinkFeatures,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

export const link : LinkFeatures.Link = (options) => {

    const {
        mindmap,
        nodeIds,
        link,
    } = options;
    const ids = fillNodeIds(nodeIds);

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        model.link = link;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '添加链接',
        undoCmd : {
            cmd : LinkFeatures.Commands.Unlink,
            opts : {
                nodeIds,
            }
        } as Command<LinkFeatures.Commands.Unlink>,
    };

};

export const unlink: LinkFeatures.Unlink = (options) => {

    const {
        mindmap,
        nodeIds,
    } = options;
    const ids = fillNodeIds(nodeIds);
    const undoCmds: Command<LinkFeatures.Commands.Link>[] = [];

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        if (model.link !== null) {
            undoCmds.push({
                cmd : LinkFeatures.Commands.Link,
                opts : {
                    nodeIds : id,
                    link : model.link,
                }
            });
        }
        model.link = null;
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '取消链接',
        undoCmd : undoCmds,
    };

};
