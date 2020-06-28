import {
    CommandFeatures,
    MindmapCoreL2Ctor,
}                                               from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL2Ctor> (Base: TBase) =>
    class extends Base implements CommandFeatures.Mixins {

        redo (): number {

            return this.commander.redo();

        }

        undo (): number {

            return this.commander.undo();

        }

        commandNewGroup (): this {

            this.commander.commandNewGroup();

            return this;

        }

        commandExecGroup (): this {

            this.commander.commandExecGroup();

            return this;

        }

    };
