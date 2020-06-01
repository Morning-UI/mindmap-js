import {
    Constructor,
    ShowContextMenuOptions,
    ContextMenuTypes,
}                                               from '../interface';

export default <TBase extends Constructor>(Base: TBase): TBase =>
    class extends Base {

        showContextMenu (options: ShowContextMenuOptions): this {

            let $menu: HTMLElement;

            if (options.type === ContextMenuTypes.Link) {

                $menu = this._options.$contextMenuLink;
                $menu.style.left = `${options.x}px`;
                $menu.style.top = `${options.y}px`;
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Link;

            }

            this.contextNodeId = options.nodeId;

            return this;

        }

        hideContextMenu (type: ContextMenuTypes): this {

            let $menu: HTMLElement;

            if (type === ContextMenuTypes.Link) {

                $menu = this._options.$contextMenuLink;
                $menu.style.display = 'none';

            }

            this.contextNodeId = null;
            this.contextType = null;

            return this;

        }

        getContextNodeId (): string {

            return this.contextNodeId;

        }

        getContextType (): ContextMenuTypes {

            return this.contextType;

        }

    };
