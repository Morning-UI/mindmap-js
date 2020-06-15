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
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    setItemState,
}                                               from '../utils/setItemState';
import {
    getModel,
}                                               from '../utils/G6Ext';

const cleanTagHoverState = (graph: TreeGraph, node: Item): void => {

    const states = node.getStates();

    for (const state of states) {

        if ((/^tag-hover/u).test(state)) {

            setItemState(graph, node.get('id'), state, false);

        }

    }

};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements TagFeatures.Mixins {

        showEditTag (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = getModel(node);
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);
            const $boxEditTag = this._options.$boxEditTag;
            const $boxEditTagInput = $boxEditTag.querySelector('textarea');
            const tag = model.tag || [];

            let boxEditTagWidth = 0;

            this.currentEditTagNodeIds = nodeIds;
            $boxEditTag.style.display = 'block';
            boxEditTagWidth = $boxEditTag.clientWidth;
            $boxEditTag.style.left = `${x - (boxEditTagWidth / 2)}px`;
            $boxEditTag.style.top = `${y}px`;
            $boxEditTagInput.value = tag.join(',');

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

            this.commander.addExec({
                cmd : TagFeatures.Commands.Tag,
                opts : {
                    nodeIds,
                    tags,
                },
            } as Command<TagFeatures.Commands.Tag>);

            return this;

        }

        tagAll (nodeIds: NodeIds, tags: string[]|string): this {

            this.commander.addExec({
                cmd : TagFeatures.Commands.TagAll,
                opts : {
                    nodeIds,
                    tags,
                },
            } as Command<TagFeatures.Commands.TagAll>);

            return this;

        }

        untag (nodeIds: NodeIds, tags: string[]|string): this {

            this.commander.addExec({
                cmd : TagFeatures.Commands.Untag,
                opts : {
                    nodeIds,
                    tags,
                },
            } as Command<TagFeatures.Commands.Untag>);

            return this;

        }

        untagByIndex (nodeIds: NodeIds, index: number): this {

            this.commander.addExec({
                cmd : TagFeatures.Commands.UntagByIndex,
                opts : {
                    nodeIds,
                    index,
                },
            } as Command<TagFeatures.Commands.UntagByIndex>);

            return this;

        }

    };
