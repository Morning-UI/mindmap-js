import copy                                     from 'clipboard-copy';
import {
    ClipboardFeatures,
    MindmapCoreL1Ctor,
    MindmapNodeItem,
    NodeIds,
    MindmapNodeItems,
    MindmapCoreL2Ctor,
}                                               from '../interface';
import {
    pluckDataFromModels,
    nodeItemGetter,
}                                               from '../utils/dataGetter';
import {
    fillNodeIds,
}                                               from '../base/utils';
import {
    getModel,
}                                               from '../utils/G6Ext';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL2Ctor> (Base: TBase) =>
    class extends Base implements ClipboardFeatures {

        copyNodeToClipboard (nodeIds: NodeIds): string {

            const data = JSON.stringify(this.copyNodes(nodeIds));

            window.__MINDMAP_CLIPBOARD = data;
            copy(data).catch(() => {
                // do not handle errors.
            });

            return data;

        }

        cutNodeToClipboard (nodeIds: NodeIds): string {

            const data = JSON.stringify(this.cutNodes(nodeIds));

            window.__MINDMAP_CLIPBOARD = data;
            copy(data).catch(() => {
                // do not handle errors.
            });

            return data;

        }

        // copyNode (nodeIds: NodeIds): MindmapNodeItems {

        //     const ids = fillNodeIds(nodeIds);
        //     const isSingle = (typeof nodeIds === 'string' || nodeIds.length === 1);
        //     const nodes = [];

        //     for (const id of ids) {

        //         const node = this.graph.findById(id);
        //         const model = getModel(node);
        //         const data = pluckDataFromModels([model], nodeItemGetter, this);

        //         nodes.push(data[0]);

        //     }

        //     if (isSingle) {

        //         return nodes[0];

        //     }

        //     return nodes;

        // }

        // eslint-disable-next-line class-methods-use-this
        getClipboard (): string {

            return window.__MINDMAP_CLIPBOARD;

        }

    };
