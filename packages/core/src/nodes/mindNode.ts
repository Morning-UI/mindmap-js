import {
    IShapeBase,
}                                               from '@antv/g6/lib/types';
import {
    IShape,
    IGroup,
}                                               from '@antv/g-canvas/lib/interfaces';
import {
    MindmapCore,
}                                               from '../index';
import {
    genNodeStyles,
    getAppends,
    appendConGroupAdjustPosition,
    tagConGroupAdjustPosition,
}                                               from '../base/utils';
import {
    APPENDS_LIST,
}                                               from '../base/const';
import {
    ROOT_MIND_NODE_STYLE,
    MIND_NODE_STYLE,
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
}                                               from '../interface';

const _NODE_SHAPE_INDEX: {
    [index: string]: number;
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
        mindmap,
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
        name : 'appendConGroup',
        id : `node-${cfg.id}-append-box`,
    });

    addGroup({
        group,
        shapes,
        name : 'tagConGroup',
        id : `node-${cfg.id}-tag-box`,
    });

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
                    textAlign : 'center',
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

            const tagTextBbox = tagText.getBBox();

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

export const mindNodeAdjustPosition = (elements: MindNodeElements, cfg: MindmapNodeItem, mindmap: MindmapCore): void => {

    const style = cfg._isRoot ? genNodeStyles(ROOT_MIND_NODE_STYLE, cfg) : genNodeStyles(MIND_NODE_STYLE, cfg);
    // const markConGroupBbox = elements.markConGroup.getBBox();
    // const textX = 0;
    const appends = getAppends(cfg);
    const tags = cfg.tag;
    // const conPaddingX = style.fontSize * 1.5;
    // const conPaddingY = style.fontSize * 0.75;
    const textBBox = elements.text.getBBox();
    const conHeight = textBBox.height + (style.paddingY * 2);

    let textOffsetX = 0;
    let appendConGroupBbox = elements.appendConGroup.getBBox();
    let conWidth = textBBox.width + (style.paddingX * 2);

    // if (cfg._mark && cfg._mark.length > 0) {

    //     for (let index in cfg._mark) {

    //         let markCon = shapes.markConGroup.getChildByIndex(index * 2);
    //         let mark = shapes.markConGroup.getChildByIndex((index * 2) + 1);
    //         let markBbox = mark.getBBox();
    //         let markConBbox = markCon.getBBox();

    //         markCon.attr({
    //             x : (markConBbox.width * index) + conPaddingX,
    //             y : conPaddingY
    //         });
    //         mark.attr({
    //             x : (markConBbox.width * index) + (markConBbox.width / 2) + conPaddingX,
    //             y : (markConBbox.height / 2) + conPaddingY
    //         });

    //     }

    //     markConGroupBbox = shapes.markConGroup.getBBox();

    // }

    // if (cfg._mark && cfg._mark.length > 0) {

    //     conWidth += markConGroupBbox.width;
    //     conWidth += MARKS_MARGIN.right;
    //     textX += markConGroupBbox.width;
    //     textX += MARKS_MARGIN.right;

    // }

    if (appends && appends.length > 0) {

        appendConGroupAdjustPosition({
            text : elements.text as IShape,
            markConGroup : elements.markConGroup as IShape,
            appendConGroup : elements.appendConGroup as IShape,
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

    // shapes.collapseBtnGroup.getChildByIndex(0).attr({
    //     x : boxBbox.maxX,
    //     y : (textBbox.height / 2) + conPaddingY
    // });

    // let collapseBtnBbox = shapes.collapseBtnGroup.getChildByIndex(0).getBBox();

    // shapes.collapseBtnGroup.getChildByIndex(1).attr({
    //     x : collapseBtnBbox.maxX - (collapseBtnBbox.width / 2),
    //     y : collapseBtnBbox.maxY - (collapseBtnBbox.height / 2)
    // });

    if (tags && tags.length > 0) {

        tagConGroupAdjustPosition({
            con : elements.con as IShape,
            tagConGroup : elements.tagConGroup as IShape,
        }, cfg, mindmap);

        const tagConGroupBbox = elements.tagConGroup.getBBox();

        boxBBox = elements.box.getBBox();

        // box增加tags的高度和宽度
        elements.box.attr({
            height : boxBBox.height + tagConGroupBbox.height + style.tagMarginTop,
            width : Math.max(boxBBox.width, tagConGroupBbox.width),
        });

        // 调整锚点至居中
        boxBBox = elements.box.getBBox();
        cfg.anchorPoints[0] = [0, ((conBBox.height / 2) / boxBBox.height)];

    } else {

        // eslint-disable-next-line no-magic-numbers
        cfg.anchorPoints[0] = [0, 0.5];

    }

};

export const getMindNode = (mindmap: MindmapCore): MindShapeOptions => ({
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

        mindNodeAdjustPosition(shapes as MindNodeElements, cfg, mindmap);

        return shapes.box;

    },
    setState : (name, value, item): void => {

        const cfg = item.getModel() as MindmapNodeItem;
        const states = item.getStates();
        const box: IShapeBase = item.get('keyShape');
        const group = box.getParent();
        const elements: MindNodeElements = {
            outline : group.getChildByIndex(_NODE_SHAPE_INDEX.outline),
            markConGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.markConGroup),
            appendConGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.appendConGroup),
            tagConGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.tagConGroup),
            // collapseBtnGroup : group.getChildByIndex(_NODE_SHAPE_INDEX.collapseBtnGroup),
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

    },
});

export const NODE_SHAPE_INDEX = _NODE_SHAPE_INDEX;