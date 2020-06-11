import {
    GraphData,
}                                               from '@antv/g6/lib/types';
import {
    MindmapDataItem,
    MindmapCoreL1Ctor,
    ReadDataFeatures,
}                                               from '../interface';
import {
    traverseData,
}                                               from '../utils/traverseData';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
    class extends Base implements ReadDataFeatures {

        readData (data: MindmapDataItem): this {

            this.data = traverseData(data);
            this.graph.read(this.data as GraphData);

            setTimeout(() => {

                this.graph.layout(true);
                // this.$refs['mor-mindmap-zoomslider'].set(vm.getZoom() * 100);
                this._updateZoomValue();

            });

            return this;

        }

    };