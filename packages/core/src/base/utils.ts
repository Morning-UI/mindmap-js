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
    MindmapNodeItem,
    NodeStyle,
    MindNodeShapes,
    MindNodeElements,
    NodeAppendItem,
    NodeIds,
}                                               from '../interface';
import MindmapClass, {
    MindmapCore,
}                                               from '../index';
import {
    NODE_SHAPE_INDEX,
}                                               from '../nodes/mindNode';
import {
    MIND_NODE_STYLE,
}                                               from '../style';

export const genNodeStyles = (styles: NodeStyle, cfg: MindmapNodeItem): NodeStyle => {

    return G6.Util.deepMix(
        {},
        styles,
        // nodeStyle._shapePresets[model._shapeStyle],
        cfg.style
    );

};

export const inNodeShape = (mindmap: MindmapCore, evt: IG6GraphEvent, element: IElement): boolean => {

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
