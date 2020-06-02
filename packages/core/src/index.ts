import * as G6                                  from '@antv/g6';
import * as G6Types                             from '@antv/g6/lib/types';
// import * as G6Graph                             from '@antv/g6/lib/interface/graph';
import {
    MindmapCreateOptions,
    MindmapDataItem,
    MindmapNodeItem,
    MindNodeElements,
    MindmapInsideOptions,
    EventNames,
    EditContentChangeCallback,
    ZoomChangeCallback,
    EventCallbacks,
    ContextMenuTypes,
    NodeIds,
}                                               from './interface';
import {
    create,
    traverseData,
    register,
    bindEvent,
    manualPaint,
}                                               from './base/graph';
import {
    getNodeElements,
}                                               from './base/utils';
import {
    refreshTextEditorPosition,
}                                               from './base/editor';
import {
    mindNodeAdjustPosition,
}                                               from './nodes/mindNode';
import mixinLink                                from './features/link';
import mixinNote                                from './features/note';
import mixinTag                                 from './features/tag';
import mixinContextMenu                         from './features/contextMenu';

export class MindmapCore {

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

    eventList: {
        [EventNames.EditContentChange]?: EditContentChangeCallback[];
        [EventNames.ZoomChange]?: ZoomChangeCallback[];
    } = {};

    keydownState = {
        mod : false,
    };

    _options: MindmapInsideOptions;

    constructor (options: MindmapCreateOptions) {

        register(this);
        this.graph = create(this, options);
        this.G6 = G6;
        bindEvent(this);
        // this._options.$editorInput = this._options.$editor.querySelector('textarea');

        return this;

    }

    readData (data: MindmapDataItem): this {

        this.data = traverseData(data);
        this.graph.read(this.data as G6Types.GraphData);

        setTimeout(() => {

            this.graph.refreshLayout(true);
            // this.$refs['mor-mindmap-zoomslider'].set(vm.getZoom() * 100);

        });

        return this;

    }

    clearSelectedNode (): this {

        const selectedState = 'selected';
        const graph = this.graph;
        const autoPaint: boolean = graph.get('autoPaint');
        const nodeItems = graph.findAllByState('node', selectedState);
        const edgeItems = graph.findAllByState('edge', selectedState);

        graph.setAutoPaint(false);
        nodeItems.forEach((node) => graph.setItemState(node, selectedState, false));
        edgeItems.forEach((edge) => graph.setItemState(edge, selectedState, false));
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
        this.graph.refreshLayout();
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
                mindNodeAdjustPosition(elements, this.editNode.getModel() as MindmapNodeItem);
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

}

let MindmapClass;

MindmapClass = mixinLink(MindmapCore);
MindmapClass = mixinNote(MindmapClass);
MindmapClass = mixinTag(MindmapClass);
MindmapClass = mixinContextMenu(MindmapClass);

export default MindmapClass;
export const EventNamesEnum = EventNames;
