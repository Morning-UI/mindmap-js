import {
    IGroup,
}                                               from '@antv/g-base/lib/interfaces';
import {
    IBBox,
}                                               from '@antv/g6/lib/types';
import {
    MindmapCoreL0Ctor,
    ZoomFeatures,
    Command,
}                                               from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements ZoomFeatures.Mixins {

        zoom (zoom: number): this {

            this.commander.addExec({
                cmd : ZoomFeatures.Commands.Zoom,
                opts : {
                    zoom,
                },
            } as Command<ZoomFeatures.Commands.Zoom>);

            return this;

        }

        getZoom (): number {

            return this.graph.getZoom();

        }

        fitZoom (): this {

            this.commander.addExec({
                cmd : ZoomFeatures.Commands.FitZoom,
            } as Command<ZoomFeatures.Commands.FitZoom>);

            return this;

        }

        fitCenter (): this {

            this.commander.addExec({
                cmd : ZoomFeatures.Commands.FitCenter,
            } as Command<ZoomFeatures.Commands.FitCenter>);

            return this;

        }

        moveCanvas (x: number, y: number): this {

            this.commander.addExec({
                cmd : ZoomFeatures.Commands.MoveCanvas,
                opts : {
                    x,
                    y,
                },
            } as Command<ZoomFeatures.Commands.MoveCanvas>);

            return this;

        }

        getCanvasPos (): ({
            x: number;
            y: number;
        }) {

            const canvasBBox = (this.graph.get('group') as IGroup).getCanvasBBox() as IBBox;

            return {
                x : canvasBBox.x,
                y : canvasBBox.y,
            };

        }

        _updateZoomValue (): this {

            setTimeout(() => {

                const $zoomSlider = this._options.$zoomSlider;
                const $value = $zoomSlider.querySelector('.zoom-value');
                const $track = $zoomSlider.querySelector('.zoom-track');
                const $slider = $zoomSlider.querySelector('.zoom-slider') as HTMLElement;
                const $line = $zoomSlider.querySelector('.zoom-line') as HTMLElement;
                const totalWidth = $track.clientWidth;
                const value = this.getZoom();
                const zoomRange = this._options.maxZoom - this._options.minZoom;
                const zoomPercentage = (value - this._options.minZoom) / zoomRange;
                const currentWidth = zoomPercentage * totalWidth;

                $line.style.width = `${currentWidth}px`;
                $slider.style.left = `${currentWidth - ($slider.clientWidth / 2)}px`;
                $value.innerHTML = `${Math.floor(value * 100)}%`;
                this.zoomValue = value;

            });

            return this;

        }

    };

