import * as G6                                  from '@antv/g6';
import {
    IG6GraphEvent,
    Item,
}                                               from '@antv/g6/lib/types';
import {
    IGroup,
    IElement,
    IShape,
}                                               from '@antv/g-base/lib/interfaces';
import {
    INode,
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
    MindmapDataItem,
}                                               from '../interface';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    MIND_NODE_STYLE,
}                                               from '../style';
import globalData                               from '../base/globalData';

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

    // if (model.tag) {
        
    //     for (let tag of model.tag) {

    //         appends.push({
    //             fontFamily : undefined,
    //             fontSize : style.fontSize,
    //             fill : tag.background || '#E0E0E0',
    //             textFill : tag.color || '#000000',
    //             genText : () => tag.text || tag
    //         });

    //     }

    // }

    return appends;

};

export const appendConGroupAdjustPosition = (shapes: MindNodeShapes, cfg: MindmapNodeItem): void => {

    const style = genNodeStyles(MIND_NODE_STYLE, cfg);
    // const conPaddingX = style.fontSize * 1.5;
    // const conPaddingY = style.fontSize * 0.75;
    const appends = getAppends(cfg);
    const textBbox = shapes.text.getBBox();
    // const markConGroupBbox = shapes.markConGroup.getBBox();

    if (appends && appends.length > 0) {
        // TODO : markConGroupBbox
        // const appendConX = textBbox.width + markConGroupBbox.width + style.paddingX + style.appendsMarginLeft;
        const appendConX = textBbox.width + style.paddingX + style.appendsMarginLeft;

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

export const tagConGroupAdjustPosition = (shapes: MindNodeShapes, cfg: MindmapNodeItem, mindmap: MindmapCore): void => {

    const style = genNodeStyles(MIND_NODE_STYLE, cfg);
    const tags = cfg.tag;

    if (tags && tags.length > 0) {

        let tagWidthTotal = 0;

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
            const x = tagWidthTotal;
            const y = conBbox.height + style.tagMarginTop;

            tagCon.attr({
                x,
                y,
            });
            tagText.attr({
                x : x + (tagTextBbox.width / 2) + style.tagPaddingX,
                y : y + (tagTextBbox.height / 2) + style.tagPaddingY,
            });

            tagWidthTotal += tagConBbox.width + style.tagMarginLeft;

        }

    }

    // const appendConX = textBbox.width + style.paddingX + style.appendsMarginLeft;

    // let appendWidthTotal = 0;

    // for (const index in appends) {

    //     appendWidthTotal += appendConBbox.width;

    // }

};

export const inAnnex = (mindmap: MindmapCore, evt: IG6GraphEvent, groupIndex: number, shapeIndex: number): boolean => {

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
        const model = child.getModel() as MindmapNodeItem;

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
    // node
    //     .get('group')
    //     .getChildByIndex(NODE_SHAPE_INDEX.collapseBtnGroup)[
    //         type
    //     ]();

    toggleAllChildrenVisibility(node, type, callback);

};

// ITEM INCLUEDS:
// --------------
// INPUT DATA:
//      text : 文案
//      children : 子节点
//      link : 链接
//      note : 备注
//      tag : 标签
// --------------
// G6 DATA:
//      id : node id
//      anchorPoints : 锚点
//      style : 额外的样式
//      type : 采用的图形
// --------------
// INSIDE PROP:
//      _isRoot : 是否是根节点
//      _isNode : 是节点
//      _isDragging : 正在拖拽
//      _isHolder : 占位节点
// --------------
export const traverseOneItem = (item: MindmapDataItem): MindmapNodeItem => {

    const globalId = globalData.id;
    const nodeItem: MindmapNodeItem = {
        id : globalData.id++,
        // eslint-disable-next-line no-magic-numbers
        anchorPoints : [[0, 0.5], [1, 0.5]],
        style : {},
        // TODO : type diff when node is root
        type : 'mind-node',
        link : null,
        note : null,
        tag : null,
        ...item,
        _isRoot : globalId === 1,
        _isNode : true,
        _isDragging : false,
        _isHolder : false,
    };

    return nodeItem;

};

export const traverseData = (data: MindmapDataItem): MindmapNodeItem => {

    const nodeData: MindmapNodeItem = traverseOneItem(data);

    if (nodeData.children) {

        for (const index in nodeData.children) {

            nodeData.children[index] = traverseData(nodeData.children[index]);

        }

    }

    return nodeData;

};
