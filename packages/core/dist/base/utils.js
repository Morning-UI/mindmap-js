import * as G6 from '@antv/g6';
import { NODE_SHAPE_INDEX, } from '../nodes/mindNode';
import { MIND_NODE_STYLE, MARKS_STYLE, } from '../style';
import { markBuilder, } from '../utils/markBuilder';
import { getModel, } from '../utils/G6Ext';
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
    elements['foldBtnGroup.circle'] = elements.foldBtnGroup.getChildByIndex(0);
    elements['foldBtnGroup.icon'] = elements.foldBtnGroup.getChildByIndex(1);
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
    return appends;
};
export var appendConGroupAdjustPosition = function (shapes, cfg) {
    var style = genNodeStyles(MIND_NODE_STYLE, cfg);
    var appends = getAppends(cfg);
    var textBbox = shapes.text.getBBox();
    var markConGroupBbox = shapes.markConGroup.getBBox();
    if (appends && appends.length > 0) {
        var appendConX = textBbox.width
            + style.paddingX
            + style.appendsMarginLeft;
        if (markConGroupBbox.width > 0) {
            appendConX
                += markConGroupBbox.width
                    + style.markConGroupMarginRight;
        }
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
    var maxWidth = shapes.box.getBBox().width;
    if (tags && tags.length > 0) {
        var tagWidthTotal = 0;
        var row = 0;
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
            if (maxWidth < (tagWidthTotal + tagConBbox.width + style.tagMarginLeft)) {
                row++;
                tagWidthTotal = 0;
            }
            var x = tagWidthTotal;
            var y = conBbox.height + style.tagMarginTop + ((tagConBbox.height + style.tagMarginTop) * row);
            tagCon.attr({
                x: x,
                y: y,
            });
            tagText.attr({
                x: x + style.tagPaddingX,
                y: y + (tagTextBbox.height / 2) + style.tagPaddingY,
            });
            var afterConBbox = tagCon.getBBox();
            var overflowRate = afterConBbox.width / maxWidth;
            // 单行标签溢出
            if (overflowRate > 1) {
                var text = tagText.attr('text');
                var len = text.length;
                len = Math.floor(len / overflowRate) - 2;
                text = text.slice(0, len);
                tagCon.attr({
                    width: maxWidth,
                });
                tagText.attr({
                    text: text + "...",
                    width: maxWidth,
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
export var toggleAllChildrenVisibility = function (node, type, callback) {
    if (type === void 0) { type = 'show'; }
    var outEdges = node.getOutEdges();
    for (var _i = 0, outEdges_1 = outEdges; _i < outEdges_1.length; _i++) {
        var edge = outEdges_1[_i];
        var child = edge.getTarget();
        var model = getModel(child);
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
export var toggleNodeVisibility = function (node, type, callback) {
    if (type === void 0) { type = 'show'; }
    // 隐藏边
    node.getInEdges()[0][type]();
    // 隐藏文本和主容器
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.text)[type]();
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.con)[type]();
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
        .getChildByIndex(NODE_SHAPE_INDEX.appendConGroup)[type]();
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.tagConGroup)[type]();
    node
        .get('group')
        .getChildByIndex(NODE_SHAPE_INDEX.foldBtnGroup)[type]();
    toggleAllChildrenVisibility(node, type, callback);
};
export var genMarkShape = function (options) {
    var shapes = options.shapes, markType = options.markType;
    var markKey = options.markType + ":" + options.markName;
    var markCfg = markBuilder[markType](options, markKey);
    markCfg.con = {
        attrs: {
            x: 0,
            y: 0,
            radius: MIND_NODE_STYLE.markConRadius,
            cursor: 'pointer',
        },
    };
    markCfg.iconCon = {
        attrs: {
            x: 0,
            y: 0,
            fill: '#FFF',
            cursor: 'pointer',
        },
    };
    markCfg.icon = {
        attrs: {
            x: 0,
            y: 0,
            fill: MARKS_STYLE[markKey].bgColor,
            stroke: MARKS_STYLE[markKey].borderColor,
            lineWidth: MARKS_STYLE[markKey].borderWidth,
            width: MARKS_STYLE[markKey].radius * 2,
            height: MARKS_STYLE[markKey].radius * 2,
            radius: MARKS_STYLE[markKey].radius,
            cursor: 'pointer',
        },
    };
    shapes.markConGroup.addShape('rect', markCfg.con);
    shapes.markConGroup.addShape('rect', markCfg.iconCon);
    shapes.markConGroup.addShape('rect', markCfg.icon);
    shapes.markConGroup.addShape('text', markCfg.text);
    // const markBbox = mark.getBBox();
    // TODO
    // markCon.attr({
    //     width : markBbox.width + (MARKS_PADDING.x * 2),
    //     height : markBbox.height + (MARKS_PADDING.y * 2)
    // });
};
