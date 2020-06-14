import * as G6                                  from '@antv/g6';
import {
    IG6GraphEvent,
    Item,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
    IElement,
}                                               from '@antv/g-base/lib/interfaces';
import {
    INode, IEdge,
}                                               from '@antv/g6/lib/interface/item';
import {
    MindmapNodeItem,
    NodeStyle,
    MindNodeShapes,
    MindNodeElements,
    NodeAppendItem,
    NodeIds,
    MindmapCoreType,
    toggleNodeVisibilityCallback,
    MindmapCoreL0Type,
    GenMarkOptions,
    MarkShapeCfg,
}                                               from '../interface';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    MIND_NODE_STYLE,
    MARKS_STYLE,
}                                               from '../style';
import {
    markBuilder,
}                                               from '../utils/markBuilder';
import {
    setItemState,
}                                               from '../utils/setItemState';
import {
    getModel,
}                                               from '../utils/G6Ext';

export const genNodeStyles = (styles: NodeStyle, cfg: MindmapNodeItem): NodeStyle => {

    return G6.Util.deepMix(
        {},
        styles,
        // nodeStyle._shapePresets[model._shapeStyle],
        cfg.style
    );

};

export const inNodeShape = (mindmap: MindmapCoreType, evt: IG6GraphEvent, element: IElement): boolean => {

    if (element === undefined) {

        return false;

    }

    const zoom = mindmap.graph.getZoom();
    const itemBbox = evt.item.getBBox();
    const itemCanvasXY = mindmap.graph.getCanvasByPoint(itemBbox.x, itemBbox.y);
    const x = (evt.canvasX - itemCanvasXY.x) / zoom;
    const y = (evt.canvasY - itemCanvasXY.y) / zoom;
    const elementBbox = element.getBBox();

    if (
        x > elementBbox.minX
        && x < elementBbox.maxX
        && y > elementBbox.minY
        && y < elementBbox.maxY
    ) {

        return true;

    }

    return false;

};

export const getNodeElements = (item: Item): MindNodeElements => {

    const box = item.getKeyShape();
    const group = box.getParent();
    const elements: MindNodeElements = {};

    for (const key in NODE_SHAPE_INDEX) {

        elements[key] = group.getChildByIndex(NODE_SHAPE_INDEX[key]);

    }

    return elements;

};

export const getAppends = (cfg: MindmapNodeItem): NodeAppendItem[] => {

    const style = genNodeStyles(MIND_NODE_STYLE, cfg);
    const appends: NodeAppendItem[] = [];

    if (cfg.link) {

        appends.push({
            fontFamily : 'mindmap-icon',
            fontSize : style.fontSize,
            genText : () => String.fromCharCode(parseInt('e678;', 16)),
        });

    }

    if (cfg.note) {

        appends.push({
            fontFamily : 'mindmap-icon',
            fontSize : style.fontSize,
            fill : 'transparent',
            genText : () => String.fromCharCode(parseInt('e629;', 16)),
        });

    }

    return appends;

};

export const appendConGroupAdjustPosition = (shapes: MindNodeShapes, cfg: MindmapNodeItem): void => {

    const style = genNodeStyles(MIND_NODE_STYLE, cfg);
    const appends = getAppends(cfg);
    const textBbox = shapes.text.getBBox();
    const markConGroupBbox = shapes.markConGroup.getBBox();

    if (appends && appends.length > 0) {

        let appendConX
            = textBbox.width
            + style.paddingX
            + style.appendsMarginLeft;

        if (markConGroupBbox.width > 0) {

            appendConX
            += markConGroupBbox.width
            + style.markConGroupMarginRight;
        }

        let appendWidthTotal = 0;

        for (const index in appends) {

            const _index = Number(index);
            const appendConGroup = shapes.appendConGroup as IGroup;
            const appendCon = appendConGroup.getChildByIndex(_index * 2);
            const appendText = appendConGroup.getChildByIndex((_index * 2) + 1);

            const appendConBbox = appendCon.getBBox();
            const appendTextBbox = appendText.getBBox();
            const x = appendConX + appendWidthTotal + ((appendConBbox.width - appendTextBbox.width) / 2);

            appendCon.attr({
                x,
                y : (-appendTextBbox.height / 2) + style.paddingY + style.appendsPaddingY,
            });
            appendText.attr({
                x : x + (appendTextBbox.width / 2) + style.appendsPaddingX,
                y : (appendTextBbox.height / 2) + style.paddingY,
            });

            appendWidthTotal += appendConBbox.width;

        }

    }

};

export const tagConGroupAdjustPosition = (shapes: MindNodeShapes, cfg: MindmapNodeItem, mindmap: MindmapCoreL0Type): void => {

    const style = genNodeStyles(MIND_NODE_STYLE, cfg);
    const tags = cfg.tag;
    const maxWidth: number = shapes.box.getBBox().width;

    if (tags && tags.length > 0) {

        let tagWidthTotal = 0;
        let row = 0;

        for (const index in tags) {

            const _index = Number(index);

            if (_index > mindmap._options.maxShowTagNum) {

                break;

            }

            const tagConGroup = shapes.tagConGroup as IGroup;
            const tagCon = tagConGroup.getChildByIndex(_index * 2);
            const tagText = tagConGroup.getChildByIndex((_index * 2) + 1);
            const conBbox = shapes.con.getBBox();
            const tagConBbox = tagCon.getBBox();
            const tagTextBbox = tagText.getBBox();

            if (maxWidth < (tagWidthTotal + tagConBbox.width + style.tagMarginLeft)) {

                row++;
                tagWidthTotal = 0;

            }

            const x = tagWidthTotal;
            const y = conBbox.height + style.tagMarginTop + ((tagConBbox.height + style.tagMarginTop) * row);

            tagCon.attr({
                x,
                y,
            });
            tagText.attr({
                x : x + style.tagPaddingX,
                y : y + (tagTextBbox.height / 2) + style.tagPaddingY,
            });

            const afterConBbox = tagCon.getBBox();
            const overflowRate = afterConBbox.width / maxWidth;

            // 单行标签溢出
            if (overflowRate > 1) {

                let text: string = tagText.attr('text');
                let len = text.length;

                len = Math.floor(len / overflowRate) - 2;
                text = text.slice(0, len);

                tagCon.attr({
                    width : maxWidth,
                });
                tagText.attr({
                    text : `${text}...`,
                    width : maxWidth,
                });

            }

            tagWidthTotal += tagConBbox.width + style.tagMarginLeft;

        }

    }

    // const appendConX = textBbox.width + style.paddingX + style.appendsMarginLeft;

    // let appendWidthTotal = 0;

    // for (const index in appends) {

    //     appendWidthTotal += appendConBbox.width;

    // }

};

export const inAnnex = (mindmap: MindmapCoreType, evt: IG6GraphEvent, groupIndex: number, shapeIndex: number): boolean => {

    const parent = shapeIndex === null
        ? evt.item.get('group')
            .getChildByIndex(groupIndex)
        : evt.item.get('group')
            .getChildByIndex(groupIndex)
            .getChildByIndex(shapeIndex);

    return inNodeShape(
        mindmap,
        evt,
        parent,
    );

};

export const fillNodeIds = (nodeIds: NodeIds): string[] => {

    if (typeof nodeIds === 'string' || typeof nodeIds === 'number') {

        return [String(nodeIds)];

    }

    for (const index in nodeIds) {

        nodeIds[index] = String(nodeIds[index]);

    }

    return nodeIds as string[];

};

export const toggleAllChildrenVisibility = (
    node: INode,
    type: 'show'|'hide' = 'show',
    callback: toggleNodeVisibilityCallback,
): void => {

    const outEdges = node.getOutEdges();

    for (const edge of outEdges) {

        const child = edge.getTarget();
        const model = getModel(child);

        edge[type]();
        child[type]();

        if (typeof callback === 'function') {

            // eslint-disable-next-line callback-return
            callback(type, model);

        }

        if (child.getOutEdges().length > 0) {

            toggleAllChildrenVisibility(child, type, callback);

        }

    }

};

export const toggleNodeVisibility = (
    node: INode,
    type: 'show'|'hide' = 'show',
    callback: toggleNodeVisibilityCallback,
): void => {

    // 隐藏边
    node.getInEdges()[0][type]();

    // 隐藏文本和主容器
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.text)[
            type
        ]();
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.con)[
            type
        ]();
    // node
    //     .get('group')
    //     .getChildByIndex(NODE_SHAPE_INDEX.bottomline)[
    //         type
    //     ]();
    // node
    //     .get('group')
    //     .getChildByIndex(NODE_SHAPE_INDEX.markConGroup)[
    //         type
    //     ]();
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.appendConGroup)[
            type
        ]();
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.tagConGroup)[
            type
        ]();
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup)[
            type
        ]();

    toggleAllChildrenVisibility(node, type, callback);

};

export const clearSelectedNode = (mindmap: MindmapCoreType, selectedState: 'selected'): void => {

    const graph = mindmap.graph;
    const autoPaint = graph.get('autoPaint');
    const nodes = graph.findAllByState<INode>('node', selectedState);
    const edges = graph.findAllByState<IEdge>('edge', selectedState);

    graph.setAutoPaint(false);
    nodes.forEach((_node) => setItemState(graph, _node.get('id'), selectedState, false));
    edges.forEach((edge) => setItemState(graph, edge.get('id'), selectedState, false));
    graph.paint();
    graph.setAutoPaint(autoPaint);

};

export const genMarkShape = (options: GenMarkOptions): void => {

    const {
        shapes,
        markType,
    } = options;

    const markKey = `${options.markType}:${options.markName}`;
    const markCfg: MarkShapeCfg = markBuilder[markType](options, markKey);

    markCfg.con = {
        attrs : {
            x : 0,
            y : 0,
            radius : MIND_NODE_STYLE.markConRadius,
            cursor : 'pointer',
        },
    };
    markCfg.iconCon = {
        attrs : {
            x : 0,
            y : 0,
            fill : '#FFF',
            cursor : 'pointer',
        },
    };
    markCfg.icon = {
        attrs : {
            x : 0,
            y : 0,
            fill : MARKS_STYLE[markKey].bgColor,
            stroke : MARKS_STYLE[markKey].borderColor,
            lineWidth : MARKS_STYLE[markKey].borderWidth,
            width : MARKS_STYLE[markKey].radius * 2,
            height : MARKS_STYLE[markKey].radius * 2,
            radius : MARKS_STYLE[markKey].radius,
            cursor : 'pointer',
        },
    };

    (shapes.markConGroup as IGroup).addShape('rect', markCfg.con);
    (shapes.markConGroup as IGroup).addShape('rect', markCfg.iconCon);
    (shapes.markConGroup as IGroup).addShape('rect', markCfg.icon);
    (shapes.markConGroup as IGroup).addShape('text', markCfg.text);

    // const markBbox = mark.getBBox();

    // TODO
    // markCon.attr({
    //     width : markBbox.width + (MARKS_PADDING.x * 2),
    //     height : markBbox.height + (MARKS_PADDING.y * 2)
    // });
};