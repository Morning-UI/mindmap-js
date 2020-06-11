import * as G6                                  from '@antv/g6';
import {
    GraphData,
}                                               from '@antv/g6/lib/types';
import {
    MindmapCoreL3Ctor,
    MindmapCreateOptions,
    MindmapDataItem,
}                                               from '../interface';
import {
    create,
    register,
    bindEvent,
}                                               from '../base/graph';
import {
    traverseData,
}                                               from '../utils/traverseData';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL3Ctor> (Base: TBase) =>
    class extends Base {

        constructor (...args: any[]) {

            super();

            const options: MindmapCreateOptions = args[0];

            register(this);
            this.graph = create(this, options);
            this.G6 = G6;
            bindEvent(this);
            // this._options.$editorInput = this._options.$editor.querySelector('textarea');
            console.log(this._options.$con);
            const $g6Minimap = this._options.$con.querySelector('.g6-minimap');
            const g6MinimapWidth = $g6Minimap.clientWidth;
            const g6MinimapHeight = $g6Minimap.clientHeight;

            // this._options.$zoomSlider.style.bottom = `${g6MinimapHeight}px`;
            this._options.$zoomSlider.style.paddingBottom = `${g6MinimapHeight}px`;

            // TODO : remove test
            window.test = this;

            return this;

        }

        readData (data: MindmapDataItem): this {

            this.data = traverseData(data);
            this.graph.read(this.data as GraphData);

            console.log(data);

            setTimeout(() => {

                this.graph.layout(true);
                // this.$refs['mor-mindmap-zoomslider'].set(vm.getZoom() * 100);
                this._updateZoomValue();

            });

            return this;

        }

    };