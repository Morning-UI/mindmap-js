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
    contextNodeId: string;
    contextType: ContextMenuTypes;
    contextData: any;
    currentEditLinkNodeIds: NodeIds;
    currentEditNoteNodeIds: NodeIds;
    currentEditTagNodeIds: NodeIds;
    currentEditMarkNodeIds: NodeIds;
    currentEditMarkValue: MindMark;
    zoomValue: number;

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

    clearSelectedNode (): this {

        const selectedState = 'selected';
        const graph = this.graph;
        const autoPaint: boolean = graph.get('autoPaint');
        const nodeItems = graph.findAllByState<INode>('node', selectedState);
        const edgeItems = graph.findAllByState<IEdge>('edge', selectedState);

        graph.setAutoPaint(false);
        nodeItems.forEach((node) => setItemState(graph, node.get('id'), selectedState, false));
        edgeItems.forEach((edge) => setItemState(graph, edge.get('id'), selectedState, false));
        graph.paint();
        graph.setAutoPaint(autoPaint);

        return this;

    }

    focusNodeTextEditor (nodeId: string, clean = false): this {

        const node = this.graph.findById(nodeId);
        const elements = getNodeElements(node);

        this.editting = true;
        this.editElements = elements;
        this.editNode = node;
        refreshTextEditorPosition(this);
        elements.text.attr({
            opacity : 0,
        });
        this.editNode.setState('editing', true);
        this.graph.paint();
        this._options.$editorInput.focus();

        // if (clean) {

        //     setTimeout(() => {

        //         this.data.editContent = this
        //             .data
        //             .editContent
        //             .split('')
        //             .slice(-1)
        //             .join('');
        //         editInput(this);

        //     });

        // }

        // TODO : 实现聚焦
        return this;

    }

    blurNodeTextEditor (): this {

        if (!this.editting) {

            return this;

        }

        const elements = getNodeElements(this.editNode);

        elements.text.attr({
            opacity : 1,
        });
        this.graph.paint();
        this._options.$editor.style.display = 'none';
        this.editContent = '';
        this.editElements = {};
        this.editZoom = 1;
        this.editNode.setState('editing', false);
        this.editNode = null;
        this.graph.layout();
        setTimeout(() => {

            this.editting = false;

        });

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

    showLink (nodeId: string): this {

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
    mixinClipboard(
    mixinReadData( 
    mixinNode(
    mixinContextMenu(
        MindmapCoreL1
    ))));

const MindmapCoreL3 = 
    mixinExport(
        MindmapCoreL2
    );

const MindmapCore =
    mixinConstructor(
        MindmapCoreL3
    );
/* eslint-enable */

export default MindmapCore;
export * from './utils/testData';
export * from './interface';
