import difference                               from 'lodash.difference';
import {
    TreeGraph,
}                                               from '@antv/g6';
import {
    Item,
}                                               from '@antv/g6/lib/types';
import {
    NodeIds,
    MindmapNodeItem,
    MindmapCoreL0Ctor,
    TagFeatures,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';

const cleanTagHoverState = (graph: TreeGraph, node: Item): void => {

    const states = node.getStates();

    for (const state of states) {

        if ((/^tag-hover/u).test(state)) {

            graph.setItemState(node, state, false);

        }

    }

};

export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements TagFeatures {

        showEditTag (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = node.getModel() as MindmapNodeItem;
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);
            const $boxEditTag = this._options.$boxEditTag;
            const $boxEditTagInput = $boxEditTag.querySelector('textarea');

            let boxEditTagWidth = 0;

            this.currentEditTagNodeIds = nodeIds;
            $boxEditTag.style.display = 'block';
            boxEditTagWidth = $boxEditTag.clientWidth;
            $boxEditTag.style.left = `${x - (boxEditTagWidth / 2)}px`;
            $boxEditTag.style.top = `${y}px`;
            $boxEditTagInput.value = model.tag.join(',');

            return this;

        }

        hideEditTag (): this {

            const $boxEditTag = this._options.$boxEditTag;

            this.currentEditTagNodeIds = [];
            $boxEditTag.style.display = 'none';
            return this;

        }

        getCurrentEditTagNodeIds (): NodeIds {

            return this.currentEditTagNodeIds;

        }

        tag (nodeIds: NodeIds, tags: string[]|string): this {

            const ids = fillNodeIds(nodeIds);

            let _tags = typeof tags === 'string' ? [tags] : tags;

            _tags = difference(_tags, ['']);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.tag = Object.assign([], _tags);
                node.draw();

            }

            this.graph.layout();
            return this;

        }

        tagAdd (nodeIds: NodeIds, tags: string[]|string): this {

            const ids = fillNodeIds(nodeIds);

            let _tags = typeof tags === 'string' ? [tags] : tags;

            _tags = difference(_tags, ['']);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.tag = Object.assign([], model.tag).concat(_tags);
                node.draw();

            }

            this.graph.layout();
            return this;

        }

        untag (nodeIds: NodeIds, untags: string[]|string): this {

            const ids = fillNodeIds(nodeIds);

            let _untags = typeof untags === 'string' ? [untags] : untags;

            _untags = difference(_untags, ['']);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.tag = difference(model.tag, _untags);
                cleanTagHoverState(this.graph, node);
                node.draw();

            }

            this.graph.layout();
            return this;

        }

        untagByIndex (nodeIds: NodeIds, index: number): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.tag.splice(index, 1);
                cleanTagHoverState(this.graph, node);
                node.draw();

            }

            this.graph.layout();
            return this;

        }

    };
