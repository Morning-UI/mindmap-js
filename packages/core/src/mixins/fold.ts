import {
    NodeIds,
    MindmapCoreL0Ctor,
    FoldFeatures,
    Command,
}                                               from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements FoldFeatures.Mixins {

        foldToggle (nodeIds: NodeIds, fold: boolean|undefined): this {

            this.commander.addExec({
                cmd : FoldFeatures.Commands.FoldToggle,
                opts : {
                    nodeIds,
                    fold,
                },
            } as Command<FoldFeatures.Commands.FoldToggle>);

            return this;

        }

        fold (nodeIds: NodeIds): this {

            return this.foldToggle(nodeIds, true);

        }

        unfold (nodeIds: NodeIds): this {

            return this.foldToggle(nodeIds, false);

        }

    };
