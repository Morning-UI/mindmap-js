import {
    MindmapCoreL0Ctor,
    ZoomFeatures,
}                                               from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements ZoomFeatures {

        zoom (zoom: number): this {

            let _zoom = zoom;

            if (_zoom > this._options.maxZoom) {

                _zoom = this._options.maxZoom;

            }

            if (_zoom < this._options.minZoom) {

                _zoom = this._options.minZoom;

            }

            this.graph.zoomTo(_zoom, {
                x : this.graph.get('width') / 2,
                y : this.graph.get('height') / 2,
            });
            this._updateZoomValue();

            return this;

        }

        getZoom (): number {

            return this.graph.getZoom();

        }

        fitZoom (): this {

            this.graph.fitView();
            this._updateZoomValue();

            return this;

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

