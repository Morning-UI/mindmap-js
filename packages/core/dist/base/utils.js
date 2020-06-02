import * as G6 from '@antv/g6';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { MIND_NODE_STYLE, } from '../style';
export var genNodeStyles = function (styles, cfg) {
    return G6.Util.deepMix({}, styles, 
    // nodeStyle._shapePresets[model._shapeStyle],
    cfg.style);
};
export var inNodeShape = function (mindmap, evt, element) {
    if (element === undefined) {
        return false;
    }
    var zoom = mindmap.graph.getZoom();
    var itemBbox = evt.item.getBBox();
    var itemCanvasXY = mindmap.graph.getCanvasByPoint(itemBbox.x, itemBbox.y);
    var x = (evt.canvasX - itemCanvasXY.x) / zoom;
    var y = (evt.canvasY - itemCanvasXY.y) / zoom;
    var elementBbox = element.getBBox();
    if (x > elementBbox.minX
        && x < elementBbox.maxX
        && y > elementBbox.minY
        && y < elementBbox.maxY) {
        return true;
    }
    return false;
};
export var getNodeElements = function (item) {
    var box = item.getKeyShape();
    var group = box.getParent();
    var elements = {};
    for (var key in NODE_SHAPE_INDEX) {
        elements[key] = group.getChildByIndex(NODE_SHAPE_INDEX[key]);
    }
    return elements;
};
export var getAppends = function (cfg) {
    var style = genNodeStyles(MIND_NODE_STYLE, cfg);
    var appends = [];
    if (cfg.link) {
        appends.push({
            fontFamily: 'mindmap-icon',
            fontSize: style.fontSize,
            genText: function () { return String.fromCharCode(parseInt('e678;', 16)); },
        });
    }
    if (cfg.note) {
        appends.push({
            fontFamily: 'mindmap-icon',
            fontSize: style.fontSize,
            fill: 'transparent',
            genText: function () { return String.fromCharCode(parseInt('e629;', 16)); },
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
export var appendConGroupAdjustPosition = function (shapes, cfg) {
    var style = genNodeStyles(MIND_NODE_STYLE, cfg);
    // const conPaddingX = style.fontSize * 1.5;
    // const conPaddingY = style.fontSize * 0.75;
    var appends = getAppends(cfg);
    var textBbox = shapes.text.getBBox();
    // const markConGroupBbox = shapes.markConGroup.getBBox();
    if (appends && appends.length > 0) {
        // TODO : markConGroupBbox
        // const appendConX = textBbox.width + markConGroupBbox.width + style.paddingX + style.appendsMarginLeft;
        var appendConX = textBbox.width + style.paddingX + style.appendsMarginLeft;
        var appendWidthTotal = 0;
        for (var index in appends) {
            var _index = Number(index);
            var appendConGroup = shapes.appendConGroup;
            var appendCon = appendConGroup.getChildByIndex(_index * 2);
            var appendText = appendConGroup.getChildByIndex((_index * 2) + 1);
            var appendConBbox = appendCon.getBBox();
            var appendTextBbox = appendText.getBBox();
            var x = appendConX + appendWidthTotal + ((appendConBbox.width - appendTextBbox.width) / 2);
            appendCon.attr({
                x: x,
                y: (-appendTextBbox.height / 2) + style.paddingY + style.appendsPaddingY,
            });
            appendText.attr({
                x: x + (appendTextBbox.width / 2) + style.appendsPaddingX,
                y: (appendTextBbox.height / 2) + style.paddingY,
            });
            appendWidthTotal += appendConBbox.width;
        }
    }
};
export var tagConGroupAdjustPosition = function (shapes, cfg, mindmap) {
    var style = genNodeStyles(MIND_NODE_STYLE, cfg);
    var tags = cfg.tag;
    if (tags && tags.length > 0) {
        var tagWidthTotal = 0;
        for (var index in tags) {
            var _index = Number(index);
            if (_index > mindmap._options.maxShowTagNum) {
                break;
            }
            var tagConGroup = shapes.tagConGroup;
            var tagCon = tagConGroup.getChildByIndex(_index * 2);
            var tagText = tagConGroup.getChildByIndex((_index * 2) + 1);
            var conBbox = shapes.con.getBBox();
            var tagConBbox = tagCon.getBBox();
            var tagTextBbox = tagText.getBBox();
            var x = tagWidthTotal;
            var y = conBbox.height + style.tagMarginTop;
            tagCon.attr({
                x: x,
                y: y,
            });
            tagText.attr({
                x: x + (tagTextBbox.width / 2) + style.tagPaddingX,
                y: y + (tagTextBbox.height / 2) + style.tagPaddingY,
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
export var inAnnex = function (mindmap, evt, groupIndex, shapeIndex) {
    var parent = shapeIndex === null
        ? evt.item.get('group')
            .getChildByIndex(groupIndex)
        : evt.item.get('group')
            .getChildByIndex(groupIndex)
            .getChildByIndex(shapeIndex);
    return inNodeShape(mindmap, evt, parent);
};
export var fillNodeIds = function (nodeIds) {
    if (typeof nodeIds === 'string' || typeof nodeIds === 'number') {
        return [String(nodeIds)];
    }
    for (var index in nodeIds) {
        nodeIds[index] = String(nodeIds[index]);
    }
    return nodeIds;
};
