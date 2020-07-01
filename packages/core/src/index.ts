import * as G6                                  from '@antv/g6';
import * as G6Types                             from '@antv/g6/lib/types';
import {
    INode,
    IEdge,
}                                               from '@antv/g6/lib/interface/item';
import {
    MindmapNodeItem,
    MindNodeElements,
    MindmapInsideOptions,
    EventNames,
    EventList,
    EditContentChangeCallback,
    ZoomChangeCallback,
    EventCallbacks,
    ContextMenuTypes,
    NodeIds,
    MindMark,
}                                               from './interface';
import {
    manualPaint,
}                                               from './base/graph';
import {
    getNodeElements,
}                                               from './base/utils';
import {
    setItemState,
}                                               from './utils/setItemState';
import {
    refreshTextEditorPosition,
}                                               from './base/editor';
import {
    mindNodeAdjustPosition,
    NODE_SHAPE_INDEX,
}                                               from './nodes/mindNode';
import mixinConstructor                         from './mixins/constructor';
import mixinLink                                from './mixins/link';
import mixinNote                                from './mixins/note';
import mixinTag                                 from './mixins/tag';
import mixinMark                                from './mixins/mark';
import mixinContextMenu                         from './mixins/contextMenu';
import mixinNode                                from './mixins/node';
import mixinGet                                 from './mixins/get';
import mixinFold                                from './mixins/fold';
import mixinZoom                                from './mixins/zoom';
import mixinExport                              from './mixins/export';
import mixinReadData                            from './mixins/readData';
import mixinClipboard                           from './mixins/clipboard';
import mixinCommand                             from './mixins/command';
import {
    Commander,
}                                               from './commander';

export class MindmapCoreBase {

    graph: G6.TreeGraph;
    G6: typeof G6;
    data: MindmapNodeItem;
    dragging = false;
    editting = false;
    editElements: MindNodeElements;
    editNode: G6Types.Item;
    editContent: string;
    editZoom: number;

    $contextEle: HTMLElement;
    contextNodeIds: NodeIds;
    contextType: ContextMenuTypes;
    contextData: any;
    contextHiddenCallback: Function;

    // currentEditLinkNodeIds: NodeIds;
    // currentEditNoteNodeIds: NodeIds;
    // currentEditTagNodeIds: NodeIds;
    currentEditMarkNodeIds: NodeIds;
    currentEditMarkValue: MindMark;
    zoomValue: number;
    focus = false;

    isMindmap = true;
    eventList: EventList = {};

    keydownState = {
        mod : false,
        shift : false,
    };

    _options: MindmapInsideOptions;
    commander: Commander;

    constructor (...args: any[]) {

        return this;

    }

    editorInput (content: string): this {

        if (this.editting) {

            const elements = getNodeElements(this.editNode);

            manualPaint(this.graph, () => {

                elements.text.attr({
                    text : content,
                });

                this.editNode.update({
                    text : content,
                });

                this.graph.paint();
                mindNodeAdjustPosition(elements, this.editNode.getModel() as MindmapNodeItem, this);
                refreshTextEditorPosition(this);

            });

        }

        return this;

    }

    on (eventName: EventNames, callback: EventCallbacks): this {

        if (this.eventList[eventName] === undefined) {

            this.eventList[eventName] = [];

        }

        // this.eventList[eventName].push(callback);

        switch (eventName) {

            case EventNames.EditContentChange:
                this.eventList[eventName].push(callback as EditContentChangeCallback);
                break;

            case EventNames.ZoomChange:
                this.eventList[eventName].push(callback as ZoomChangeCallback);
                break;

            default:
                break;

        }

        return this;

    }

    emit (eventName: EventNames): this {

        const fns = this.eventList[eventName];

        if (!fns) {

            return this;

        }

        for (const fn of fns) {

            switch (eventName) {
                case EventNames.EditContentChange:
                    (fn as EditContentChangeCallback)(this.editContent);
                    break;

                case EventNames.ZoomChange:
                    (fn as ZoomChangeCallback)(this.graph.getZoom());
                    break;

                default:
                    break;
            }

        }

        return this;

    }

    openLink (nodeId: string): this {

        const node = this.graph.findById(nodeId);
        const model = node.getModel() as MindmapNodeItem;

        if (model.link) {

            window.open(model.link);

        }

        return this;

    }

    getNodeBBox (nodeId: string): object {

        const node = this.graph.findById(nodeId);
        const group = node.getContainer();
        const bbox: {
            [name: string]: G6Types.IBBox,
        } = {
            _node : node.getBBox(),
        };

        for (const name in NODE_SHAPE_INDEX) {

            bbox[name] = group.getChildByIndex(NODE_SHAPE_INDEX[name]).getBBox();

        }

        return bbox;

    }

}

/* eslint-disable */
// LO includes : corebase.
// L1(base function) includes : link/note/tag.
// L2(advance function) includes : contextmenu/node, L2 which is public core.
const MindmapCoreL1 = 
    mixinZoom(
    mixinTag(
    mixinMark(
    mixinNote(
    mixinLink(
    mixinGet(
    mixinFold(
        MindmapCoreBase
    )))))));

const MindmapCoreL2 =
    mixinReadData( 
    mixinNode(
    mixinContextMenu(
        MindmapCoreL1
    )));

const MindmapCoreL3 = 
    mixinExport(
    mixinClipboard(
    mixinCommand(
        MindmapCoreL2
    )));

const MindmapCore =
    mixinConstructor(
        MindmapCoreL3
    );
/* eslint-enable */

export default MindmapCore;
export * from './utils/testData';
export * from './interface';
