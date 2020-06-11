import {
    ShowContextMenuOptions,
    ContextMenuTypes,
    MindmapCoreL1Ctor,
    ContextMenuFeatures,
    MindMarks,
}                                               from '../interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL1Ctor> (Base: TBase) =>
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
            this.hideEditMark();

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

        menuItemLinkEdit (): void {

            this.showEditLink(this.getContextNodeId());
            this.hideContextMenu();

        }

        menuItemLinkDelete (): void {

            this.unlink(this.getContextNodeId());
            this.hideContextMenu();

        }

        menuItemNoteEdit (): void {

            this.showEditNote(this.getContextNodeId());
            this.hideContextMenu();

        }

        menuItemNoteDelete (): void {

            this.unnote(this.getContextNodeId());
            this.hideContextMenu();

        }

        menuItemTagEdit (): void {

            this.showEditTag(this.getContextNodeId());
            this.hideContextMenu();

        }

        menuItemTagDelete (): void {

            this.untagByIndex(this.getContextNodeId(), this.getContextData().tagIndex);
            this.hideContextMenu();

        }

        menuItemMarkEdit (evt: MouseEvent): void {

            const $target = evt.target as HTMLElement;
            const markValue = $target.getAttribute('mark-value') as MindMarks;

            this.mark(this.getCurrentEditMarkNodeIds(), markValue);

        }

        menuItemMarkDelete (): void {

            // const $target = evt.target as HTMLElement;
            // const markValue = $target.getAttribute('mark-value') as MindMarks;

            this.unmark(this.getCurrentEditMarkNodeIds(), this.getCurrentEditMarkValue());
            this.hideAllContextMenu();

        }

    };
