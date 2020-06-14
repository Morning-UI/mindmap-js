import {
    MindmapNodeItem,
    NodeIds,
    MindmapCoreL0Ctor,
    LinkFeatures,
    Command,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements LinkFeatures.Mixins {

        showEditLink (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = getModel(node);
            const bbox = node.getBBox();
            const {
                x,
                y,
            } = this.graph.getCanvasByPoint(bbox.centerX, bbox.maxY);
            const $boxEditLink = this._options.$boxEditLink;
            const $boxEditLinkInput = $boxEditLink.querySelector('textarea');

            let boxEditLinkWidth = 0;

            this.currentEditLinkNodeIds = nodeIds;
            $boxEditLink.style.display = 'block';
            boxEditLinkWidth = $boxEditLink.clientWidth;
            $boxEditLink.style.left = `${x - (boxEditLinkWidth / 2)}px`;
            $boxEditLink.style.top = `${y}px`;
            $boxEditLinkInput.value = model.link;
            // this.data.currentEditLinkValue = model.link;
            // this.data.$editLinkDialog.toggle(true);
            // this.data.mouseOnCanvas = false;
            return this;

        }

        hideEditLink (): this {

            const $boxEditLink = this._options.$boxEditLink;

            this.currentEditLinkNodeIds = [];
            $boxEditLink.style.display = 'none';
            return this;

        }

        getCurrentEditLinkNodeIds (): NodeIds {

            return this.currentEditLinkNodeIds;

        }

        link (nodeIds: NodeIds, link: string): this {

            this.commander.addExec({
                cmd: LinkFeatures.Commands.Link,
                opts : {
                    nodeIds,
                    link,
                },
            } as Command<LinkFeatures.Commands.Link>);

            return this;

        }

        unlink (nodeIds: NodeIds): this {

            this.commander.addExec({
                cmd: LinkFeatures.Commands.Unlink,
                opts : {
                    nodeIds,
                },
            } as Command<LinkFeatures.Commands.Unlink>);

            return this;

        }

    };