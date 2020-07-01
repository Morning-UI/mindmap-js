import difference                               from 'lodash.difference';
import {
    TreeGraph,
}                                               from '@antv/g6';
import {
    Item,
}                                               from '@antv/g6/lib/types';
import {
    NodeIds,
    TagFeatures,
    Command,
    MindmapCoreL1Ctor,
    ContextMenuTypes,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
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
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements TagFeatures.Mixins {

        menuItemTagEdit (): void {

            this.showEditTag(this.getContextNodeIds());

        }

        menuItemTagDelete (): void {

            this.untag(this.getContextNodeIds(), this.getContextData().tag);
            this.hideContextMenu();

        }

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

            $boxEditTagInput.value = tag.join(',');

            this.showContextMenu({
                type : ContextMenuTypes.TagEditor,
                nodeIds,
                x,
                y,
                data : tag.join(','),
                hiddenCallback : (_nodeIds: NodeIds, value: string) => this.tagAll(_nodeIds, value.split(',')),
            });

            return this;

        }

        hideEditTag (): this {

            this.hideContextMenu();

            return this;

        }

        tag (nodeIds: NodeIds, tags: string[]|string): this {

            const ids = fillNodeIds(nodeIds);

            let _tags = typeof tags === 'string' ? [tags] : tags;

            _tags = difference(_tags, ['']);

            this.commander.commandNewGroup();

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = getModel(node);
                const modelTag = Object.assign([], model.tag).concat(_tags);

                this.commander.addExec({
                    cmd : TagFeatures.Commands.TagAll,
                    opts : {
                        nodeIds : id,
                        tags : modelTag,
                    },
                } as Command<TagFeatures.Commands.TagAll>);

            }

            this.commander.commandExecGroup();

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

            const ids = fillNodeIds(nodeIds);

            let _untags = typeof tags === 'string' ? [tags] : tags;

            _untags = difference(_untags, ['']);

            this.commander.commandNewGroup();

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = getModel(node);

                if (tags === undefined) {

                    // 若tags没有入参，则清除所有tags
                    this.commander.addExec({
                        cmd : TagFeatures.Commands.TagAll,
                        opts : {
                            nodeIds : id,
                            tags : null,
                        },
                    } as Command<TagFeatures.Commands.TagAll>);

                } else {

                    this.commander.addExec({
                        cmd : TagFeatures.Commands.TagAll,
                        opts : {
                            nodeIds : id,
                            tags : difference(model.tag, _untags),
                        },
                    } as Command<TagFeatures.Commands.TagAll>);

                }

                cleanTagHoverState(this.graph, node);

            }

            this.commander.commandExecGroup();

            return this;

        }

    };
