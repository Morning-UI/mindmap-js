import {
    NodeIds,
    LinkFeatures,
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements LinkFeatures.Mixins {

        menuItemLinkEdit (): void {

            this.showEditLink(this.getContextNodeIds());

        }

        menuItemLinkDelete (): void {

            this.unlink(this.getContextNodeIds());
            this.hideContextMenu();

        }

        showEditLink (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = getModel(node);
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);

            this.showContextMenu({
                type : ContextMenuTypes.LinkEditor,
                nodeIds,
                x,
                y,
                data : model.link,
                hiddenCallback : this.link,
            });

            return this;

        }

        hideEditLink (): this {

            return this.hideContextMenu();

        }

        link (nodeIds: NodeIds, link: string): this {

            this.commander.addExec({
                cmd : LinkFeatures.Commands.Link,
                opts : {
                    nodeIds,
                    link,
                },
            } as Command<LinkFeatures.Commands.Link>);

            return this;

        }

        unlink (nodeIds: NodeIds): this {

            this.commander.addExec({
                cmd : LinkFeatures.Commands.Link,
                opts : {
                    nodeIds,
                    link : null,
                },
            } as Command<LinkFeatures.Commands.Link>);

            return this;

        }

    };
