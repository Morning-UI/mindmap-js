import {
    NodeId,
    NodeIds,
    Constructor,
    MindmapNodeItem,
}                                               from '../interface';
import {
    fillNodeIds,
}                                               from '../base/utils';

export default <TBase extends Constructor>(Base: TBase): TBase =>
    class extends Base {

        showEditLink (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);
            const node = this.graph.findById(ids[0]);
            const model = node.getModel() as MindmapNodeItem;
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

        }

        link (nodeIds: NodeIds, link: string): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.link = link;
                node.draw();

            }

            this.graph.refreshLayout();
            return this;

        }

        unlink (nodeIds: NodeIds): this {

            const ids = fillNodeIds(nodeIds);

            for (const id of ids) {

                const node = this.graph.findById(id);
                const model = node.getModel() as MindmapNodeItem;

                model.link = null;
                node.draw();

            }

            this.graph.refreshLayout();
            return this;

        }

    };
