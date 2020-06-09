import * as G6                                  from '@antv/g6';
import {
    MindmapCoreL2Ctor,
    MindmapCreateOptions,
}                                               from '../interface';
import {
    create,
    register,
    bindEvent,
}                                               from '../base/graph';

export default <TBase extends MindmapCoreL2Ctor> (Base: TBase) =>
    class extends Base {

        constructor (...args: any[]) {

            super();

            const options: MindmapCreateOptions = args[0];

            register(this);
            this.graph = create(this, options);
            this.G6 = G6;
            bindEvent(this);
            // this._options.$editorInput = this._options.$editor.querySelector('textarea');

            // TODO : remove test
            window.test = this;

            return this;

        }

    };