import {
    IShapeBase,
}                                               from '@antv/g6/lib/types';
import {
    IShape,
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    genNodeStyles,
    getAppends,
    appendConGroupAdjustPosition,
    tagConGroupAdjustPosition,
    genMarkShape,
}                                               from '../base/utils';
import {
    APPENDS_LIST,
}                                               from '../base/const';
import {
    ROOT_MIND_NODE_STYLE,
    MIND_NODE_STYLE,
    MARKS_STYLE,
}                                               from '../style';
import {
    MindShapeOptions,
    MindNodeShapes,
    MindNodeElements,
    InitNodeOptions,
    AddShapeOptions,
    AddGroupOptions,
    MindmapNodeItem,
    NodeStyle,
    InitNodeAppendsOptions,
    InitNodeTagsOptions,
    StateChangeOptions,
    MindmapCoreL0Type,
    InitNodeMarksOptions,
    MindMarkTypes,
    InitFoldBtnOptions,
    MarkSet,
}                                               from '../interface';
import {
    getBBox, getModel,
}                                               from '../utils/G6Ext';

const _NODE_SHAPE_INDEX: {
    [name: string]: number;
} = {};
const DEBUG_BOX_SIZING = false;

let nodeShapeIndex = 0;

const addShape = (options: AddShapeOptions): void => {

    const {
        name,
        type,
        group,
        shapes,
        attrs,
    } = options;

    if (_NODE_SHAPE_INDEX[name] === undefined) {

        _NODE_SHAPE_INDEX[name] = nodeShapeIndex++;

    }

    shapes[name] = group.addShape(type, {
        attrs,
        draggable : true,
    });

};

const addGroup = (options: AddGroupOptions): void => {

    const {
        group,
        shapes,
        name,
        id,
    } = options;

    if (_NODE_SHAPE_INDEX[name] === undefined) {

        _NODE_SHAPE_INDEX[name] = nodeShapeIndex++;

    }

    shapes[name] = group.addGroup({
        id,
        attrs : {
            x : 0,
            y : 0,
        },
    });

};

const initNodeBase = (options: InitNodeOptions): void => {

    const {
        shapes,
        cfg,
        group,
        style,
    } = options;

    // TODO : if node is root, cursor is default.
    const cursor = 'move';

    // const data = mindmap.graph.findDataById(cfg.id);

    // NODE INCLUDE :
    // box(最外层容器，不可见)
    //      hover(hover时的外框)
    //      con(主容器，可见)
    //      text(文本)
    //      appendConGroup(尾缀容器)
    //      tagConGroup(标签容器)
    addShape({
        name : 'box',
        type : 'rect',
        group,
        shapes,
        attrs : {
            x : 0,
            y : 0,
            fill : 'transparent',
            cursor,
        },
    });

    addShape({
        name : 'outline',
        type : 'rect',
        group,
        shapes,
        attrs : {
            fill : DEBUG_BOX_SIZING ? '#e3e3e3' : 'transparent',
            radius : style.outlineRadius,
            cursor,
            stroke : 'transparent',
            lineWidth : 3,
        },
    });

    addShape({
        name : 'con',
        type : 'rect',
        group,
        shapes,
        attrs : {
            fill : DEBUG_BOX_SIZING ? '#ccc' : style.bgColor,
            radius : style.radius,
            cursor,
            lineWidth : style.borderWidth,
            stroke : DEBUG_BOX_SIZING ? '#a0a0a0' : style.borderColor,
        },
    });

    addShape({
        name : 'text',
        type : 'text',
        group,
        shapes,
        attrs : {
            x : 0,
            y : 0,
            text : cfg.text,
            textAlign : 'left',
            textBaseline : 'top',
            fill : DEBUG_BOX_SIZING ? '#f00' : style.fontColor,
            fontSize : style.fontSize,
            fontWeight : style.fontWeight,
            fontStyle : style.fontStyle,
            cursor,
        },
    });

    addGroup({
        group,
        shapes,
        name : 'markConGroup',
        id : `node-${cfg.id}-mark-box`,
    });

    addGroup({
        group,
        shapes,
        name : 'appendConGroup',
        id : `node-${cfg.id}-append-box`,
    });

    addGroup({
        group,
        shapes,
        name : 'tagConGroup',
        id : `node-${cfg.id}-tag-box`,
    });

    addGroup({
        group,
        shapes,
        name : 'foldBtnGroup',
        id : `node-${cfg.id}-fold-btn`,
    });

};

const initFoldBtn = (options: InitFoldBtnOptions): void => {

    const {
        shapes,
        style,
        cfg,
    } = options;

    shapes['foldBtnGroup.circle'] = (shapes.foldBtnGroup as IGroup).addShape('circle', {
        attrs : {
            r : style.FOLD_BTN_STYLE.width,
            fill : style.FOLD_BTN_STYLE.bgColor,
            stroke : style.FOLD_BTN_STYLE.borderColor,
        },
    });
    shapes['foldBtnGroup.icon'] = (shapes.foldBtnGroup as IGroup).addShape('text', {
        attrs : {
            x : 0,
            y : 0,
            fill : style.FOLD_BTN_STYLE.fontColor,
            fontFamily : 'mindmap-icon',
            fontSize : style.FOLD_BTN_STYLE.fontSize,
            textAlign : 'center',
            textBaseline : 'middle',
            text : String.fromCharCode(parseInt(`e673;`, 16)),
        },
    });

    // 如果没有子节点不显示按钮
    const children = cfg.folded ? cfg._foldedChildren : cfg.children;

    if (!children || children.length === 0) {

        shapes['foldBtnGroup.circle'].attr({
            fillOpacity : 0,
            strokeOpacity : 0,
        });
        shapes['foldBtnGroup.icon'].attr({
            fillOpacity : 0,
        });

    }

};

const initNodeAppends = (options: InitNodeAppendsOptions): void => {

    const {
        shapes,
        appends,
        style,
    } = options;

    if (appends && appends.length > 0) {

        for (const index in appends) {

            const append = appends[index];
            const appendsConGroup = shapes.appendConGroup as IGroup;
            const appendCon = appendsConGroup.addShape('rect', {
                attrs : {
                    x : 0,
                    y : 0,
                    fill : DEBUG_BOX_SIZING ? '#d8c566' : append.fill,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity : 0.7,
                    stroke : DEBUG_BOX_SIZING ? '#b39e37' : 'transparent',
                    radius : 3, // TODO
                },
                // eslint-disable-next-line no-magic-numbers
                zIndex : 99,
            });

            const appendText = appendsConGroup.addShape('text', {
                attrs : {
                    x : 0,
                    y : 0,
                    fill : append.textFill || style.fontColor,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity : 0.6,
                    fontFamily : append.fontFamily,
                    fontSize : append.fontSize,
                    textAlign : 'center',
                    textBaseline : 'middle',
                },
            });

            appendText.attr({
                text : append.genText(),
            });

            const appendTextBbox = appendText.getBBox();

            appendCon.attr({
                width : appendTextBbox.width + (style.appendsPaddingX * 2),
                height : appendTextBbox.height + (style.appendsPaddingY * 2),
            });

        }

    }

};

const initNodeTags = (options: InitNodeTagsOptions): void => {

    const {
        shapes,
        mindmap,
        cfg,
        style,
    } = options;
    const tags = cfg.tag;

    let tagNum = 0;

    if (tags && tags.length > 0) {

        for (const index in tags) {

            const tag = tags[index];
            const tagConGroup = shapes.tagConGroup as IGroup;
            const tagCon = tagConGroup.addShape('rect', {
                attrs : {
                    x : 0,
                    y : 0,
                    fill : DEBUG_BOX_SIZING ? '#d8c566' : style.tagBgColor,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity : 0.7,
                    stroke : DEBUG_BOX_SIZING ? '#b39e37' : style.tagBorderColor,
                    radius : style.tagBorderRadius,
                    lineWidth : style.tagBorderWidth,
                },
                // eslint-disable-next-line no-magic-numbers
                zIndex : 99,
            });

            const tagText = tagConGroup.addShape('text', {
                attrs : {
                    x : 0,
                    y : 0,
                    fill : style.tagFontColor,
                    // eslint-disable-next-line no-magic-numbers
                    fillOpacity : 0.6,
                    fontSize : style.tagFontSize,
                    textAlign : 'left',
                    textBaseline : 'middle',
                    text : tag,
                },
            });

            tagNum++;

            if (tagNum > mindmap._options.maxShowTagNum) {

                tagText.attr({
                    text : `+${tags.length - tagNum + 1}`,
                });

            }

            const tagTextBbox = getBBox(tagText);

            tagCon.attr({
                width : tagTextBbox.width + (style.tagPaddingX * 2),
                height : tagTextBbox.height + (style.tagPaddingY * 2),
            });

            if (tagNum > mindmap._options.maxShowTagNum) {
                break;
            }

        }

    }

};

const initNodeMarks = (options: InitNodeMarksOptions): void => {

    const {
        cfg,
    } = options;
    const marks = cfg.mark;
    const marksKeys = Object.keys(marks || {}) as (keyof MarkSet)[];

    if (marksKeys.length === 0) {

        return;

    }

    for (const index of marksKeys) {

        const markName = marks[index];
        genMarkShape({
            markName,
            markType : index,
            ...options,
        });

    }

};

const foldBtnGroupStateUpdate = (shapes: MindNodeShapes|MindNodeElements, state: boolean): void => {

    (shapes.foldBtnGroup as IGroup).getChildByIndex(1).attr({
        text : String.fromCharCode(parseInt(state ? `e685;` : `e673;`, 16)),
    });

};

const outlineStateChange = (options: StateChangeOptions): void => {

    const {
        elements,
        group,
        states,
        style,
        mindmap,
    } = options;

    if (
        mindmap.dragging === false
        && (
            states.indexOf('selected') !== -1
            || states.indexOf('editing') !== -1
        )
    ) {

        elements.outline.attr({
            stroke : style.outlineColorActive,
            // lineWidth : 3,
        });
        group.set('zIndex', 9);

    } else if (
        mindmap.dragging === false
        && states.indexOf('hover') !== -1
    ) {

        elements.outline.attr({
            stroke : style.outlineColor,
            // lineWidth : 3,
        });
        group.set('zIndex', 3);

    } else {

        elements.outline.attr({
            stroke : 'transparent',
            // lineWidth : 3,
        });
        group.set('zIndex', 1);

    }

};

const linkStateChange = (options: StateChangeOptions): void => {

    const {
        elements : appendElements,
        cfg,
        states,
        style,
    } = options;

    if (cfg.link) {

        if (states.indexOf('link-hover') !== -1) {

            appendElements.linkCon.attr({
                fill : style.outlineColor,
                stroke : style.outlineColorActive,
                cursor : 'pointer',
            });
            appendElements.link.attr({
                fillOpacity : 1,
                cursor : 'pointer',
            });

        } else {

            appendElements.linkCon.attr({
                fill : 'transparent',
                stroke : 'transparent',
                cursor : 'default',
            });
            appendElements.link.attr({
                // eslint-disable-next-line no-magic-numbers
                fillOpacity : 0.6,
                cursor : 'default',
            });

        }

    }

};

const noteStateChange = (options: StateChangeOptions): void => {

    const {
        elements : appendElements,
        cfg,
        states,
        style,
    } = options;

    if (cfg.note) {

        if (states.indexOf('note-hover') !== -1) {

            appendElements.noteCon.attr({
                fill : style.outlineColor,
                stroke : style.outlineColorActive,
                cursor : 'pointer',
            });
            appendElements.note.attr({
                fillOpacity : 1,
                cursor : 'pointer',
            });

        } else {

            appendElements.noteCon.attr({
                fill : 'transparent',
                stroke : 'transparent',
                cursor : 'default',
            });
            appendElements.note.attr({
                // eslint-disable-next-line no-magic-numbers
                fillOpacity : 0.6,
                cursor : 'default',
            });

        }

    }

};

const tagStateChange = (options: StateChangeOptions): void => {

    const {
        elements,
        cfg,
        states,
        style,
    } = options;

    if (cfg.tag !== null) {

        let index = 0;
        let hoverState: string;

        const tagConGroup = elements.tagConGroup as IGroup;
        const tagConGroupChilren = tagConGroup.getChildren();

        for (const childIndex in tagConGroupChilren) {

            if (Number(childIndex) % 2 === 0) {

                tagConGroupChilren[childIndex].attr({
                    stroke : style.tagBorderColor,
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

            const tagIndex = Number(hoverState.split(':')[1]);
            const tagCon = tagConGroup.getChildByIndex(tagIndex * 2);

            if (tagCon) {

                tagCon.attr({
                    stroke : style.tagBorderColorHover,
                });

            }

        }

    }

};

const foldStateChange = (options: StateChangeOptions): void => {

    const {
        elements,
        cfg,
        states,
        style,
    } = options;

    if (states.indexOf('fold-btn-hover') !== -1) {

        (elements.foldBtnGroup as IGroup).getChildByIndex(0).attr({
            fill : style.FOLD_BTN_STYLE.bgColorHover,
            cursor : 'pointer',
        });
        (elements.foldBtnGroup as IGroup).getChildByIndex(1).attr({
            cursor : 'pointer',
        });

    } else {

        (elements.foldBtnGroup as IGroup).getChildByIndex(0).attr({
            fill : style.FOLD_BTN_STYLE.bgColor,
            cursor : 'default',
        });
        (elements.foldBtnGroup as IGroup).getChildByIndex(1).attr({
            cursor : 'default',
        });

    }

    if (
        states.indexOf('children-folded') !== -1
        || cfg.folded
    ) {

        foldBtnGroupStateUpdate(elements, true);

    } else {

        foldBtnGroupStateUpdate(elements, false);

    }

};

const markStateChange = (options: StateChangeOptions): void => {

    const {
        elements,
        cfg,
        states,
        style,
    } = options;
    const markTypes = Object.keys(cfg.mark || {}) as (keyof MarkSet)[];

    if (markTypes.length > 0) {

        let index = 0;
        let hoverState: string;

        const markConGroup = elements.markConGroup as IGroup;
        const markConGroupChilren = markConGroup.getChildren();

        for (const childIndex in markConGroupChilren) {

            if (Number(childIndex) % 4 === 0) {

                markConGroupChilren[childIndex].attr({
                    fill : style.markConBgColor,
                    stroke : style.markConBorderColor,
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

            const markIndex = Number(hoverState.split(':')[1]);
            const markCon = markConGroup.getChildByIndex(markIndex * 4);

            if (markCon) {

                markCon.attr({
                    fill : style.markConBgColorHover,
                    stroke : style.markConBorderColorHover,
                });

            }

        }

    }
};

export const mindNodeAdjustPosition = (
    elements: MindNodeElements,
    cfg: MindmapNodeItem,
    mindmap: MindmapCoreL0Type,
): void => {

    const style = cfg._isRoot ? genNodeStyles(ROOT_MIND_NODE_STYLE, cfg) : genNodeStyles(MIND_NODE_STYLE, cfg);
    const appends = getAppends(cfg);
    const tags = cfg.tag;
    // const conPaddingX = style.fontSize * 1.5;
    // const conPaddingY = style.fontSize * 0.75;
    const textBBox = elements.text.getBBox();
    const conHeight = textBBox.height + (style.paddingY * 2);
    const markTypes = Object.keys(cfg.mark || {}) as (keyof MarkSet)[];

    let textOffsetX = 0;
    let appendConGroupBbox = elements.appendConGroup.getBBox();
    let markConGroupBBox = elements.markConGroup.getBBox();
    let conWidth = textBBox.width + (style.paddingX * 2);

    if (markTypes && markTypes.length > 0) {

        for (const index in markTypes) {

            const markType = markTypes[index];
            const markKey = `${markType}:${cfg.mark[markType]}`;
            const _index = Number(index) * 4;
            const markCon = (elements.markConGroup as IGroup).getChildByIndex(_index);
            const markIconCon = (elements.markConGroup as IGroup).getChildByIndex(_index + 1);
            const markIcon = (elements.markConGroup as IGroup).getChildByIndex(_index + 2);
            const markText = (elements.markConGroup as IGroup).getChildByIndex(_index + 3);
            // const markBBox = mark.getBBox();
            let markIconBBox = markIcon.getBBox();

            const markConWidth = markIconBBox.width + (style.markConPadding * 2) + (style.markIconBorder * 2);

            markCon.attr({
                x : (
                    (markConWidth + style.markConMarginRight) * Number(index)
                ) + style.paddingX - style.markConPadding - style.markIconBorder,
                y : (conHeight / 2) - (markIconBBox.height / 2) - style.markConPadding - style.markIconBorder,
                width : markConWidth,
                height : markIconBBox.height + (style.markConPadding * 2) + (style.markIconBorder * 2),
            });

            const markConBBox = getBBox(markCon);

            // markCon.attr({
            //     radius : markConBBox.width / 2,
            // });
            markIconCon.attr({
                x : markConBBox.x + style.markConPadding,
                y : markConBBox.y + style.markConPadding,
                width : markConBBox.width - (style.markConPadding * 2),
                height : markConBBox.height - (style.markConPadding * 2),
                radius : (markConBBox.width / 2) - style.markConPadding,
            });

            const markIconConBBox = markIconCon.getBBox();

            markIcon.attr({
                x : markIconConBBox.x + (MARKS_STYLE[markKey].borderWidth / 2) + style.markIconBorder,
                y : markIconConBBox.y + (MARKS_STYLE[markKey].borderWidth / 2) + style.markIconBorder,
            });

            markIconBBox = markIcon.getBBox();

            // const markTextBBox = getBBox(markIconCon);
            const markTextOffsetY = markText.attr('textOffsetY') || 0;

            markText.attr({
                x : markIconBBox.x + (markIconBBox.width / 2),
                y : markIconBBox.y + (markIconBBox.height / 2) + markTextOffsetY,
            });

        }

        markConGroupBBox = getBBox(elements.markConGroup);
        conWidth += markConGroupBBox.width + style.markConGroupMarginRight;
        textOffsetX += markConGroupBBox.width + style.markConGroupMarginRight;

    }

    if (appends && appends.length > 0) {

        appendConGroupAdjustPosition({
            text : elements.text as IShape,
            markConGroup : elements.markConGroup as IGroup,
            appendConGroup : elements.appendConGroup as IGroup,
        }, cfg);
        appendConGroupBbox = elements.appendConGroup.getBBox();
        conWidth += appendConGroupBbox.width + style.appendsMarginLeft;

    }

    elements.con.attr({
        x : 0,
        y : 0,
        width : conWidth,
        height : conHeight,
    });

    const conBBox = elements.con.getBBox();

    elements.box.attr({
        width : conBBox.width,
        height : conBBox.height,
    });
    // shapes.box.set('conPaddingX', conPaddingX);
    // shapes.box.set('conPaddingY', conPaddingY);

    let boxBBox = elements.con.getBBox();

    elements.outline.attr({
        x : conBBox.minX - style.outlinePadding,
        y : conBBox.minY - style.outlinePadding,
        width : conBBox.width + (style.outlinePadding * 2),
        height : conBBox.height + (style.outlinePadding * 2),
    });

    elements.text.attr({
        x : textOffsetX + style.paddingX,
        y : style.paddingY,
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
        x : boxBBox.maxX,
        y : (textBBox.height / 2) + style.paddingY,
    });

    const foldBtnBBox = getBBox(elements['foldBtnGroup.circle']);

    elements['foldBtnGroup.icon'].attr({
        x : foldBtnBBox.maxX - (foldBtnBBox.width / 2),
        y : foldBtnBBox.maxY - (foldBtnBBox.height / 2),
    });

    if (tags && tags.length > 0) {

        tagConGroupAdjustPosition({
            box : elements.box as IShape,
            con : elements.con as IShape,
            tagConGroup : elements.tagConGroup as IShape,
        }, cfg, mindmap);

        const tagConGroupBbox = getBBox(elements.tagConGroup);

        boxBBox = getBBox(elements.box);

        // box增加tags的高度和宽度
        elements.box.attr({
            height : boxBBox.height + tagConGroupBbox.height + style.tagMarginTop,
            width : Math.max(boxBBox.width, tagConGroupBbox.width),
        });

        // 调整锚点至居中
        boxBBox = getBBox(elements.box);
        cfg.anchorPoints[0] = [0, (conBBox.height / 2) / boxBBox.height];
        cfg.anchorPoints[1] = [conBBox.width / boxBBox.width, (conBBox.height / 2) / boxBBox.height];

    } else {

        /* eslint-disable no-magic-numbers*/
        cfg.anchorPoints[0] = [0, 0.5];
        cfg.anchorPoints[1] = [1, 0.5];
        /* eslint-enable no-magic-numbers*/

    }

};

export const getMindNode = (mindmap: MindmapCoreL0Type): MindShapeOptions => ({
    drawShape : (cfg: MindmapNodeItem, group): IShape => {

        const shapes: MindNodeShapes = {};
        const appends = getAppends(cfg);

        let style: NodeStyle;

        if (cfg._isRoot) {

            style = genNodeStyles(ROOT_MIND_NODE_STYLE, cfg);

        } else {

            style = genNodeStyles(MIND_NODE_STYLE, cfg);

        }

        initNodeBase({
            shapes,
            mindmap,
            cfg,
            group,
            style,
        });
        initFoldBtn({
            shapes,
            cfg,
            style,
        });
        initNodeAppends({
            shapes,
            appends,
            style,
        });
        initNodeTags({
            shapes,
            mindmap,
            cfg,
            style,
        });
        initNodeMarks({
            shapes,
            mindmap,
            cfg,
            style,
        });

        mindNodeAdjustPosition(shapes as MindNodeElements, cfg, mindmap);
        foldBtnGroupStateUpdate(shapes, cfg.folded);

        return shapes.box as IShape;

    },
    setState : (name, value, item): void => {

        const cfg = getModel(item);
        const states = item.getStates();
        const box = item.get('keyShape') as IShape;
        const group = box.getParent() as IGroup;
        const elements: MindNodeElements = {
            outline : group.getChildByIndex(_NODE_SHAPE_INDEX.outline),
            markConGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.markConGroup),
            appendConGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.appendConGroup),
            tagConGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.tagConGroup),
            foldBtnGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.foldBtnGroup),
        };

        let style: NodeStyle;

        if (cfg._isRoot) {

            style = genNodeStyles(ROOT_MIND_NODE_STYLE, cfg);

        } else {

            style = genNodeStyles(MIND_NODE_STYLE, cfg);

        }

        const linkIndex = APPENDS_LIST.link.index;
        const noteIndex = cfg.link === null
            ? APPENDS_LIST.link.index
            : APPENDS_LIST.note.index;
        const appendConGroup = elements.appendConGroup as IGroup;
        const appendElements: MindNodeElements = {
            linkCon : appendConGroup.getChildByIndex(linkIndex),
            link : appendConGroup.getChildByIndex(linkIndex + 1),
            noteCon : appendConGroup.getChildByIndex(noteIndex),
            note : appendConGroup.getChildByIndex(noteIndex + 1),
        };

        outlineStateChange({
            elements,
            group,
            states,
            style,
            mindmap,
        });

        linkStateChange({
            elements : appendElements,
            cfg,
            states,
            style,
        });

        noteStateChange({
            elements : appendElements,
            cfg,
            states,
            style,
        });

        tagStateChange({
            elements,
            cfg,
            states,
            style,
        });

        foldStateChange({
            elements,
            cfg,
            states,
            style,
        });

        markStateChange({
            elements,
            cfg,
            states,
            style,
        });

    },
});

export const NODE_SHAPE_INDEX = _NODE_SHAPE_INDEX;
