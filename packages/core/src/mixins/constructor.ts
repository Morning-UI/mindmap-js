import * as G6                                  from '@antv/g6';
import {
    MindmapCoreL3Ctor,
    MindmapCreateOptions,
}                                               from '../interface';
import {
    create,
    register,
    bindEvent,
}                                               from '../base/graph';
import {
    Commander,
}                                               from '../commander/index'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL3Ctor> (Base: TBase) =>
    class extends Base {

        constructor (...args: any[]) {

            super();

            const options: MindmapCreateOptions = args[0];

            register(this);
            this.graph = create(this, options);
            this.commander = new Commander({
                maxRecordNums : 100,
                mindmap : this,
            });
            this.G6 = G6;
            bindEvent(this);
            // this._options.$editorInput = this._options.$editor.querySelector('textarea');
            const $g6Minimap = this._options.$con.querySelector('.g6-minimap');
            const g6MinimapHeight = $g6Minimap.clientHeight;

            this._options.$zoomSlider.style.paddingBottom = `${g6MinimapHeight}px`;

            // TODO : remove test
            window.test = this;

            return this;

        }

    };