import {
    MindmapDataItem,
    MindmapCoreL1Ctor,
    DataFeatures,
    Command,
}                                               from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements DataFeatures.Mixins {

        readData (data: MindmapDataItem, first = false): this {

            this.commander.addExec({
                cmd : DataFeatures.Commands.ReadData,
                opts : {
                    data,
                },
            } as Command<DataFeatures.Commands.ReadData>, !first);

            return this;

        }

    };
