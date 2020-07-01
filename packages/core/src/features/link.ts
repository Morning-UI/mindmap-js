import {
    LinkFeatures,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

export const link: LinkFeatures.Link = (options) => {

    const {
        mindmap,
        nodeIds,
        link : _link,
    } = options;
    const ids = fillNodeIds(nodeIds);

    let oriLink: string;

    for (const id of ids) {

        const node = mindmap.graph.findById(id);
        const model = getModel(node);

        oriLink = model.link;
        model.link = _link || null;
        // TODO: 启用draw后编辑链接后，appends宽度会改变
        node.draw();

    }

    mindmap.graph.layout();

    return {
        note : '设置链接',
        undoCmd : {
            cmd : LinkFeatures.Commands.Link,
            opts : {
                nodeIds,
                link : oriLink,
            },
        } as Command<LinkFeatures.Commands.Link>,
    };

};
