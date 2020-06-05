import {
    MindmapCoreConstructor,
    ShowContextMenuOptions,
    ContextMenuTypes,
    ContextMenuFeatures,
}                                               from '../interface';

export default <TBase extends MindmapCoreConstructor>(Base: TBase): TBase =>
    class extends Base implements ContextMenuFeatures {

        showContextMenu (options: ShowContextMenuOptions): this {

            let $menu: HTMLElement;

            this.hideAllContextMenu();

            if (options.type === ContextMenuTypes.Link) {

                $menu = this._options.$contextMenuLink;
                $menu.style.left = `${options.x}px`;
                $menu.style.top = `${options.y}px`;
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Link;

            } else if (options.type === ContextMenuTypes.Note) {

                $menu = this._options.$contextMenuNote;
                $menu.style.left = `${options.x}px`;
                $menu.style.top = `${options.y}px`;
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Note;

            } else if (options.type === ContextMenuTypes.Tag) {

                $menu = this._options.$contextMenuTag;
                $menu.style.left = `${options.x}px`;
                $menu.style.top = `${options.y}px`;
                $menu.style.display = 'flex';
                this.contextType = ContextMenuTypes.Tag;
                this.contextData = options.data;

            }

            this.contextNodeId = options.nodeId;

            return this;

        }

        hideContextMenu (): this {

            let $menu: HTMLElement;

            const type = this.contextType;

            if (type === ContextMenuTypes.Link) {

                $menu = this._options.$contextMenuLink;
                $menu.style.display = 'none';

            } else if (type === ContextMenuTypes.Note) {

                $menu = this._options.$contextMenuNote;
                $menu.style.display = 'none';

            } else if (type === ContextMenuTypes.Tag) {

                $menu = this._options.$contextMenuTag;
                $menu.style.display = 'none';

            }

            this.contextNodeId = null;
            this.contextType = null;
            this.contextData = null;

            return this;

        }

        hideAllContextMenu (): this {

            this.hideContextMenu();
            this.hideEditLink();
            this.hideEditNote();
            this.hideEditTag();

            return this;

        }

        getContextNodeId (): string {

            return this.contextNodeId;

        }

        getContextType (): ContextMenuTypes {

            return this.contextType;

        }

        getContextData (): any {

            return this.contextData;

        }

    };
