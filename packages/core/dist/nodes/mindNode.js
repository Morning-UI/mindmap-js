var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { genNodeStyles, getAppends, appendConGroupAdjustPosition, tagConGroupAdjustPosition, genMarkShape, } from '../base/utils';
import { APPENDS_LIST, } from '../base/const';
import { ROOT_MIND_NODE_STYLE, MIND_NODE_STYLE, MARKS_STYLE, } from '../style';
var _NODE_SHAPE_INDEX = {};
var DEBUG_BOX_SIZING = false;
var nodeShapeIndex = 0;
var addShape = function (options) {
    var name = options.name, type = options.type, group = options.group, shapes = options.shapes, attrs = options.attrs;
    if (_NODE_SHAPE_INDEX[name] === undefined) {
        _NODE_SHAPE_INDEX[name] = nodeShapeIndex++;
    }
    shapes[name] = group.addShape(type, {
        attrs: attrs,
        draggable: true,
    });
};
var addGroup = function (options) {
    var group = options.group, shapes = options.shapes, name = options.name, id = options.id;
    if (_NODE_SHAPE_INDEX[name] === undefined) {
        _NODE_SHAPE_INDEX[name] = nodeShapeIndex++;
    }
    shapes[name] = group.addGroup({
        id: id,
        attrs: {
            x: 0,
            y: 0,
        },
    });
};
var initNodeBase = function (options) {
    var shapes = options.shapes, cfg = options.cfg, group = options.group, style = options.style;
    // TODO : if node is root, cursor is default.
    var cursor = 'move';
    // const data = mindmap.graph.findDataById(cfg.id);
    // NODE INCLUDE :
    // box(最外层容器，不可见)
    //      hover(hover时的外框)
    //      con(主容器，可见)
    //      text(文本)
    //      appendConGroup(尾缀容器)
    //      tagConGroup(标签容器)
    addShape({
        name: 'box',
        type: 'rect',
        group: group,
        shapes: shapes,
        attrs: {
            x: 0,
            y: 0,
            fill: 'transparent',
            cursor: cursor,
        },
    });
    addShape({
        name: 'outline',
        type: 'rect',
        group: group,
        shapes: shapes,
        attrs: {
            fill: DEBUG_BOX_SIZING ? '#e3e3e3' : 'transparent',
            radius: style.outlineRadius,
            cursor: cursor,
            stroke: 'transparent',
            lineWidth: 3,
        },
    });
    addShape({
        name: 'con',
        type: 'rect',
        group: group,
        shapes: shapes,
        attrs: {
            fill: DEBUG_BOX_SIZING ? '#ccc' : style.bgColor,
            radius: style.radius,
            cursor: cursor,
            lineWidth: style.borderWidth,
            stroke: DEBUG_BOX_SIZING ? '#a0a0a0' : style.borderColor,
        },
    });
    addShape({
        name: 'text',
        type: 'text',
        group: group,
        shapes: shapes,
        attrs: {
            x: 0,
            y: 0,
            text: cfg.text,
            textAlign: 'left',
            textBaseline: 'top',
            fill: DEBUG_BOX_SIZING ? '#f00' : style.fontColor,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            cursor: cursor,
        },
    });
    addGroup({
        group: group,
        shapes: shapes,
        name: 'markConGroup',
        id: "node-" + cfg.id + "-mark-box",
    });
    addGroup({
        group: group,
        shapes: shapes,
        name: 'appendConGroup',
        id: "node-" + cfg.id + "-append-box",
    });
    addGroup({
        group: group,
        shapes: shapes,
        name: 'tagConGroup',
        id: "node-" + cfg.id + "-tag-box",
    });
    addGroup({
        group: group,
        shapes: shapes,
        name: 'foldBtnGroup',
        id: "node-" + cfg.id + "-fold-btn",
    });
};
var initFoldBtn = function (options) {
    var shapes = options.shapes, style = options.style, cfg = options.cfg;
    shapes['foldBtnGroup.circle'] = shapes.foldBtnGroup.addShape('circle', {
        attrs: {
            r: style.FOLD_BTN_STYLE.width,
            fill: style.FOLD_BTN_STYLE.bgColor,
            stroke: style.FOLD_BTN_STYLE.borderColor,
        },
    });
    shapes['foldBtnGroup.icon'] = shapes.foldBtnGroup.addShape('text', {
        attrs: {
            x: 0,
            y: 0,
            fill: style.FOLD_BTN_STYLE.fontColor,
            fontFamily: 'mindmap-icon',
            fontSize: style.FOLD_BTN_STYLE.fontSize,
            textAlign: 'center',
            textBaseline: 'middle',
            text: String.fromCharCode(parseInt("e673;", 16)),
        },
    });
    // 如果没有子节点不显示按钮
    var children = cfg._isFolded ? cfg._foldedChildren : cfg.children;
    if (!children || children.length === 0) {
        shapes['foldBtnGroup.circle'].attr({
            fillOpacity: 0,
            strokeOpacity: 0,
        });
        shapes['foldBtnGroup.icon'].attr({
            fillOpacity: 0,
        });
    }
};
var initNodeAppends = function (options) {
    var shapes = options.shapes, appends = options.appends, style = options.style;
    if (appends && appends.length > 0) {
        for (var index in appends) {
            var append = appends[index];
            var appendsConGroup = shapes.appendConGroup;
            var appendCon = appendsConGroup.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    fill: DEBUG_BOX_SIZING ? '#d8c566' : append.fill,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity: 0.7,
                    stroke: DEBUG_BOX_SIZING ? '#b39e37' : 'transparent',
                    radius: 3,
                },
                // eslint-disable-next-line no-magic-numbers
                zIndex: 99,
            });
            var appendText = appendsConGroup.addShape('text', {
                attrs: {
                    x: 0,
                    y: 0,
                    fill: append.textFill || style.fontColor,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity: 0.6,
                    fontFamily: append.fontFamily,
                    fontSize: append.fontSize,
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
            });
            appendText.attr({
                text: append.genText(),
            });
            var appendTextBbox = appendText.getBBox();
            appendCon.attr({
                width: appendTextBbox.width + (style.appendsPaddingX * 2),
                height: appendTextBbox.height + (style.appendsPaddingY * 2),
            });
        }
    }
};
var initNodeTags = function (options) {
    var shapes = options.shapes, mindmap = options.mindmap, cfg = options.cfg, style = options.style;
    var tags = cfg.tag;
    var tagNum = 0;
    if (tags && tags.length > 0) {
        for (var index in tags) {
            var tag = tags[index];
            var tagConGroup = shapes.tagConGroup;
            var tagCon = tagConGroup.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    fill: DEBUG_BOX_SIZING ? '#d8c566' : style.tagBgColor,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity: 0.7,
                    stroke: DEBUG_BOX_SIZING ? '#b39e37' : style.tagBorderColor,
                    radius: style.tagBorderRadius,
                    lineWidth: style.tagBorderWidth,
                },
                // eslint-disable-next-line no-magic-numbers
                zIndex: 99,
            });
            var tagText = tagConGroup.addShape('text', {
                attrs: {
                    x: 0,
                    y: 0,
                    fill: style.tagFontColor,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity: 0.6,
                    fontSize: style.tagFontSize,
                    textAlign: 'left',
                    textBaseline: 'middle',
                    text: tag,
                },
            });
            tagNum++;
            if (tagNum > mindmap._options.maxShowTagNum) {
                tagText.attr({
                    text: "+" + (tags.length - tagNum + 1),
                });
            }
            var tagTextBbox = tagText.getBBox();
            tagCon.attr({
                width: tagTextBbox.width + (style.tagPaddingX * 2),
                height: tagTextBbox.height + (style.tagPaddingY * 2),
            });
            if (tagNum > mindmap._options.maxShowTagNum) {
                break;
            }
        }
    }
};
var initNodeMarks = function (options) {
    var cfg = options.cfg;
    var marks = cfg.mark;
    if (!marks || Object.keys(marks).length === 0) {
        return;
    }
    for (var index in marks) {
        var markName = marks[index];
        genMarkShape(__assign({ markName: markName, markType: index }, options));
    }
};
var foldBtnGroupStateUpdate = function (shapes, state) {
    shapes.foldBtnGroup.getChildByIndex(1).attr({
        text: String.fromCharCode(parseInt(state ? "e685;" : "e673;", 16)),
    });
};
var outlineStateChange = function (options) {
    var elements = options.elements, group = options.group, states = options.states, style = options.style, mindmap = options.mindmap;
    if (mindmap.dragging === false
        && (states.indexOf('selected') !== -1
            || states.indexOf('editing') !== -1)) {
        elements.outline.attr({
            stroke: style.outlineColorActive,
        });
        group.set('zIndex', 9);
    }
    else if (mindmap.dragging === false
        && states.indexOf('hover') !== -1) {
        elements.outline.attr({
            stroke: style.outlineColor,
        });
        group.set('zIndex', 3);
    }
    else {
        elements.outline.attr({
            stroke: 'transparent',
        });
        group.set('zIndex', 1);
    }
};
var linkStateChange = function (options) {
    var appendElements = options.elements, cfg = options.cfg, states = options.states, style = options.style;
    console.log('linkStateChange');
    if (cfg.link) {
        if (states.indexOf('link-hover') !== -1) {
            appendElements.linkCon.attr({
                fill: style.outlineColor,
                stroke: style.outlineColorActive,
                cursor: 'pointer',
            });
            appendElements.link.attr({
                fillOpacity: 1,
                cursor: 'pointer',
            });
        }
        else {
            appendElements.linkCon.attr({
                fill: 'transparent',
                stroke: 'transparent',
                cursor: 'default',
            });
            appendElements.link.attr({
                // eslint-disable-next-line no-magic-numbers
                fillOpacity: 0.6,
                cursor: 'default',
            });
        }
    }
};
var noteStateChange = function (options) {
    var appendElements = options.elements, cfg = options.cfg, states = options.states, style = options.style;
    if (cfg.note) {
        if (states.indexOf('note-hover') !== -1) {
            appendElements.noteCon.attr({
                fill: style.outlineColor,
                stroke: style.outlineColorActive,
                cursor: 'pointer',
            });
            appendElements.note.attr({
                fillOpacity: 1,
                cursor: 'pointer',
            });
        }
        else {
            appendElements.noteCon.attr({
                fill: 'transparent',
                stroke: 'transparent',
                cursor: 'default',
            });
            appendElements.note.attr({
                // eslint-disable-next-line no-magic-numbers
                fillOpacity: 0.6,
                cursor: 'default',
            });
        }
    }
};
var tagStateChange = function (options) {
    var elements = options.elements, cfg = options.cfg, states = options.states, style = options.style;
    if (cfg.tag !== null) {
        var index = 0;
        var hoverState = void 0;
        var tagConGroup = elements.tagConGroup;
        var tagConGroupChilren = tagConGroup.getChildren();
        for (var childIndex in tagConGroupChilren) {
            if (Number(childIndex) % 2 === 0) {
                tagConGroupChilren[childIndex].attr({
                    stroke: style.tagBorderColor,
                });
            }
        }
        while (index < states.length) {
            if ((/^tag-hover/u).test(states[index])) {
                hoverState = states[index];
                break;
            }
            index++;
        }
        if (hoverState) {
            var tagIndex = Number(hoverState.split(':')[1]);
            var tagCon = tagConGroup.getChildByIndex(tagIndex * 2);
            if (tagCon) {
                tagCon.attr({
                    stroke: style.tagBorderColorHover,
                });
            }
        }
    }
};
var foldStateChange = function (options) {
    var elements = options.elements, cfg = options.cfg, states = options.states, style = options.style;
    if (states.indexOf('fold-btn-hover') !== -1) {
        elements.foldBtnGroup.getChildByIndex(0).attr({
            fill: style.FOLD_BTN_STYLE.bgColorHover,
            cursor: 'pointer',
        });
        elements.foldBtnGroup.getChildByIndex(1).attr({
            cursor: 'pointer',
        });
    }
    else {
        elements.foldBtnGroup.getChildByIndex(0).attr({
            fill: style.FOLD_BTN_STYLE.bgColor,
            cursor: 'default',
        });
        elements.foldBtnGroup.getChildByIndex(1).attr({
            cursor: 'default',
        });
    }
    if (states.indexOf('children-folded') !== -1
        || cfg._isFolded) {
        foldBtnGroupStateUpdate(elements, true);
    }
    else {
        foldBtnGroupStateUpdate(elements, false);
    }
};
var markStateChange = function (options) {
    var elements = options.elements, cfg = options.cfg, states = options.states, style = options.style;
    var markTypes = Object.keys(cfg.mark || {});
    if (markTypes.length > 0) {
        var index = 0;
        var hoverState = void 0;
        var markConGroup = elements.markConGroup;
        var markConGroupChilren = markConGroup.getChildren();
        for (var childIndex in markConGroupChilren) {
            if (Number(childIndex) % 4 === 0) {
                markConGroupChilren[childIndex].attr({
                    fill: style.markConBgColor,
                    stroke: style.markConBorderColor,
                });
            }
        }
        while (index < states.length) {
            if ((/^mark-hover/u).test(states[index])) {
                hoverState = states[index];
                break;
            }
            index++;
        }
        if (hoverState) {
            var markIndex = Number(hoverState.split(':')[1]);
            var markCon = markConGroup.getChildByIndex(markIndex * 4);
            if (markCon) {
                markCon.attr({
                    fill: style.markConBgColorHover,
                    stroke: style.markConBorderColorHover,
                });
            }
        }
    }
};
export var mindNodeAdjustPosition = function (elements, cfg, mindmap) {
    var style = cfg._isRoot ? genNodeStyles(ROOT_MIND_NODE_STYLE, cfg) : genNodeStyles(MIND_NODE_STYLE, cfg);
    var appends = getAppends(cfg);
    var tags = cfg.tag;
    // const conPaddingX = style.fontSize * 1.5;
    // const conPaddingY = style.fontSize * 0.75;
    var textBBox = elements.text.getBBox();
    var conHeight = textBBox.height + (style.paddingY * 2);
    var markTypes = Object.keys(cfg.mark || {});
    var textOffsetX = 0;
    var appendConGroupBbox = elements.appendConGroup.getBBox();
    var markConGroupBBox = elements.markConGroup.getBBox();
    var conWidth = textBBox.width + (style.paddingX * 2);
    if (markTypes && markTypes.length > 0) {
        for (var index in markTypes) {
            var markType = markTypes[index];
            var markKey = markType + ":" + cfg.mark[markType];
            var _index = Number(index) * 4;
            var markCon = elements.markConGroup.getChildByIndex(_index);
            var markIconCon = elements.markConGroup.getChildByIndex(_index + 1);
            var markIcon = elements.markConGroup.getChildByIndex(_index + 2);
            var markText = elements.markConGroup.getChildByIndex(_index + 3);
            // const markBBox = mark.getBBox();
            var markIconBBox = markIcon.getBBox();
            var markConWidth = markIconBBox.width + (style.markConPadding * 2) + (style.markIconBorder * 2);
            markCon.attr({
                x: ((markConWidth + style.markConMarginRight) * Number(index)) + style.paddingX - style.markConPadding - style.markIconBorder,
                y: (conHeight / 2) - (markIconBBox.height / 2) - style.markConPadding - style.markIconBorder,
                width: markConWidth,
                height: markIconBBox.height + (style.markConPadding * 2) + (style.markIconBorder * 2),
            });
            var markConBBox = markCon.getBBox();
            // markCon.attr({
            //     radius : markConBBox.width / 2,
            // });
            markIconCon.attr({
                x: markConBBox.x + style.markConPadding,
                y: markConBBox.y + style.markConPadding,
                width: markConBBox.width - (style.markConPadding * 2),
                height: markConBBox.height - (style.markConPadding * 2),
                radius: (markConBBox.width / 2) - style.markConPadding,
            });
            var markIconConBBox = markIconCon.getBBox();
            markIcon.attr({
                x: markIconConBBox.x + (MARKS_STYLE[markKey].borderWidth / 2) + style.markIconBorder,
                y: markIconConBBox.y + (MARKS_STYLE[markKey].borderWidth / 2) + style.markIconBorder,
            });
            markIconBBox = markIcon.getBBox();
            var markTextBBox = markIconCon.getBBox();
            var markTextOffsetY = markText.attr('textOffsetY') || 0;
            markText.attr({
                x: markIconBBox.x + (markIconBBox.width / 2),
                y: markIconBBox.y + (markIconBBox.height / 2) + markTextOffsetY,
            });
        }
        markConGroupBBox = elements.markConGroup.getBBox();
        conWidth += markConGroupBBox.width + style.markConGroupMarginRight;
        textOffsetX += markConGroupBBox.width + style.markConGroupMarginRight;
    }
    if (appends && appends.length > 0) {
        appendConGroupAdjustPosition({
            text: elements.text,
            markConGroup: elements.markConGroup,
            appendConGroup: elements.appendConGroup,
        }, cfg);
        appendConGroupBbox = elements.appendConGroup.getBBox();
        conWidth += appendConGroupBbox.width + style.appendsMarginLeft;
    }
    elements.con.attr({
        x: 0,
        y: 0,
        width: conWidth,
        height: conHeight,
    });
    var conBBox = elements.con.getBBox();
    elements.box.attr({
        width: conBBox.width,
        height: conBBox.height,
    });
    // shapes.box.set('conPaddingX', conPaddingX);
    // shapes.box.set('conPaddingY', conPaddingY);
    var boxBBox = elements.con.getBBox();
    elements.outline.attr({
        x: conBBox.minX - style.outlinePadding,
        y: conBBox.minY - style.outlinePadding,
        width: conBBox.width + (style.outlinePadding * 2),
        height: conBBox.height + (style.outlinePadding * 2),
    });
    elements.text.attr({
        x: textOffsetX + style.paddingX,
        y: style.paddingY,
    });
    // shapes.placeholder.attr({
    //     x : textX + conPaddingX,
    //     y : (textBbox.height / 2) + conPaddingY
    // });
    // shapes.bottomline.attr({
    //     x : boxBbox.minX - 1,
    //     y : boxBbox.maxY - 0.5,
    //     height : style.bottomlineHeight,
    //     width : boxBbox.width + 2
    // });
    elements['foldBtnGroup.circle'].attr({
        x: boxBBox.maxX,
        y: (textBBox.height / 2) + style.paddingY,
    });
    var foldBtnBBox = elements['foldBtnGroup.circle'].getBBox();
    elements['foldBtnGroup.icon'].attr({
        x: foldBtnBBox.maxX - (foldBtnBBox.width / 2),
        y: foldBtnBBox.maxY - (foldBtnBBox.height / 2),
    });
    if (tags && tags.length > 0) {
        tagConGroupAdjustPosition({
            box: elements.box,
            con: elements.con,
            tagConGroup: elements.tagConGroup,
        }, cfg, mindmap);
        var tagConGroupBbox = elements.tagConGroup.getBBox();
        boxBBox = elements.box.getBBox();
        // box增加tags的高度和宽度
        elements.box.attr({
            height: boxBBox.height + tagConGroupBbox.height + style.tagMarginTop,
            width: Math.max(boxBBox.width, tagConGroupBbox.width),
        });
        // 调整锚点至居中
        boxBBox = elements.box.getBBox();
        cfg.anchorPoints[0] = [0, (conBBox.height / 2) / boxBBox.height];
        cfg.anchorPoints[1] = [conBBox.width / boxBBox.width, (conBBox.height / 2) / boxBBox.height];
    }
    else {
        /* eslint-disable no-magic-numbers*/
        cfg.anchorPoints[0] = [0, 0.5];
        cfg.anchorPoints[1] = [1, 0.5];
        /* eslint-enable no-magic-numbers*/
    }
};
export var getMindNode = function (mindmap) { return ({
    drawShape: function (cfg, group) {
        var shapes = {};
        var appends = getAppends(cfg);
        var style;
        if (cfg._isRoot) {
            style = genNodeStyles(ROOT_MIND_NODE_STYLE, cfg);
        }
        else {
            style = genNodeStyles(MIND_NODE_STYLE, cfg);
        }
        initNodeBase({
            shapes: shapes,
            mindmap: mindmap,
            cfg: cfg,
            group: group,
            style: style,
        });
        initFoldBtn({
            shapes: shapes,
            cfg: cfg,
            style: style,
        });
        initNodeAppends({
            shapes: shapes,
            appends: appends,
            style: style,
        });
        initNodeTags({
            shapes: shapes,
            mindmap: mindmap,
            cfg: cfg,
            style: style,
        });
        initNodeMarks({
            shapes: shapes,
            mindmap: mindmap,
            cfg: cfg,
            style: style,
        });
        mindNodeAdjustPosition(shapes, cfg, mindmap);
        foldBtnGroupStateUpdate(shapes, cfg._isFolded);
        return shapes.box;
    },
    setState: function (name, value, item) {
        console.log('setState');
        var cfg = item.getModel();
        var states = item.getStates();
        var box = item.get('keyShape');
        var group = box.getParent();
        var elements = {
            outline: group.getChildByIndex(_NODE_SHAPE_INDEX.outline),
            markConGroup: group.getChildByIndex(_NODE_SHAPE_INDEX.markConGroup),
            appendConGroup: group.getChildByIndex(_NODE_SHAPE_INDEX.appendConGroup),
            tagConGroup: group.getChildByIndex(_NODE_SHAPE_INDEX.tagConGroup),
            foldBtnGroup: group.getChildByIndex(_NODE_SHAPE_INDEX.foldBtnGroup),
        };
        var style;
        if (cfg._isRoot) {
            style = genNodeStyles(ROOT_MIND_NODE_STYLE, cfg);
        }
        else {
            style = genNodeStyles(MIND_NODE_STYLE, cfg);
        }
        var linkIndex = APPENDS_LIST.link.index;
        var noteIndex = cfg.link === null
            ? APPENDS_LIST.link.index
            : APPENDS_LIST.note.index;
        var appendConGroup = elements.appendConGroup;
        var appendElements = {
            linkCon: appendConGroup.getChildByIndex(linkIndex),
            link: appendConGroup.getChildByIndex(linkIndex + 1),
            noteCon: appendConGroup.getChildByIndex(noteIndex),
            note: appendConGroup.getChildByIndex(noteIndex + 1),
        };
        outlineStateChange({
            elements: elements,
            group: group,
            states: states,
            style: style,
            mindmap: mindmap,
        });
        linkStateChange({
            elements: appendElements,
            cfg: cfg,
            states: states,
            style: style,
        });
        noteStateChange({
            elements: appendElements,
            cfg: cfg,
            states: states,
            style: style,
        });
        tagStateChange({
            elements: elements,
            cfg: cfg,
            states: states,
            style: style,
        });
        foldStateChange({
            elements: elements,
            cfg: cfg,
            states: states,
            style: style,
        });
        markStateChange({
            elements: elements,
            cfg: cfg,
            states: states,
            style: style,
        });
    },
}); };
export var NODE_SHAPE_INDEX = _NODE_SHAPE_INDEX;
