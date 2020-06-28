import copy                                     from 'clipboard-copy';
import {
    ClipboardFeatures,
    NodeIds,
    MindmapCoreL2Ctor,
}                                               from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL2Ctor> (Base: TBase) =>
    class extends Base implements ClipboardFeatures.Mixins {

        copyNodeToClipboard (nodeIds: NodeIds): this {

            const data = JSON.stringify(this.copyNodes(nodeIds));

            window.__MINDMAP_CLIPBOARD = data;
            copy(data).catch(() => {
                // do not handle errors.
            });

            return this;

        }

        cutNodeToClipboard (nodeIds: NodeIds): this {

            const data = JSON.stringify(this.cutNodes(nodeIds));

            window.__MINDMAP_CLIPBOARD = data;
            copy(data).catch(() => {
                // do not handle errors.
            });

            return this;

        }

        // eslint-disable-next-line class-methods-use-this
        getClipboard (): string {

            return window.__MINDMAP_CLIPBOARD;

        }

    };
