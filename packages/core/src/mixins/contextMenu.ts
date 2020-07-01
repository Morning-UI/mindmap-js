import {
    ShowContextMenuOptions,
    ContextMenuTypes,
    ContextMenuFeatures,
    MindMark,
    MindmapCoreL0Ctor,
    NodeIds,
    ContextMenuElementSelector,
}                                               from '../interface';

const contextMenuMap = {
    [ContextMenuTypes.Link] : ContextMenuElementSelector.Link,
    [ContextMenuTypes.Note] : ContextMenuElementSelector.Note,
    [ContextMenuTypes.Tag] : ContextMenuElementSelector.Tag,
    [ContextMenuTypes.LinkEditor] : ContextMenuElementSelector.LinkEditor,
    [ContextMenuTypes.NoteEditor] : ContextMenuElementSelector.NoteEditor,
    [ContextMenuTypes.TagEditor] : ContextMenuElementSelector.TagEditor,
    [ContextMenuTypes.MarkEditor] : ContextMenuElementSelector.MarkEditor,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <TBase extends MindmapCoreL0Ctor> (Base: TBase) =>
    class extends Base implements ContextMenuFeatures.Mixins {

        showContextMenu (options: ShowContextMenuOptions): this {

            let $menu: HTMLElement;
            let $menuInput: HTMLTextAreaElement;

            this.hideContextMenu();

            switch (options.type) {

                case ContextMenuTypes.Link:
                case ContextMenuTypes.Note:
                case ContextMenuTypes.Tag:
                    $menu = this._options[contextMenuMap[options.type]];
                    $menu.style.left = `${options.x}px`;
                    $menu.style.top = `${options.y}px`;
                    $menu.style.display = 'flex';
                    this.$contextEle = $menu;
                    break;

                case ContextMenuTypes.LinkEditor:
                case ContextMenuTypes.NoteEditor:
                case ContextMenuTypes.TagEditor:
                case ContextMenuTypes.MarkEditor:
                    $menu = this._options[contextMenuMap[options.type]];
                    $menu.style.display = 'block';
                    $menu.style.left = `${options.x - ($menu.clientWidth / 2)}px`;
                    $menu.style.top = `${options.y}px`;
                    $menuInput = $menu.querySelector('textarea');
                    if ($menuInput) {

                        $menuInput.value = options.data;

                    }
                    this.$contextEle = $menu;
                    this.contextHiddenCallback = options.hiddenCallback;
                    break;

                default:
                    break;

            }

            this.contextType = options.type;
            this.contextData = options.data;
            this.contextNodeIds = options.nodeIds;

            return this;

        }

        hideContextMenu (): this {

            switch (this.contextType) {

                case ContextMenuTypes.Link:
                case ContextMenuTypes.Note:
                case ContextMenuTypes.Tag:
                    this.$contextEle.style.display = 'none';
                    break;

                case ContextMenuTypes.LinkEditor:
                case ContextMenuTypes.NoteEditor:
                case ContextMenuTypes.TagEditor:
                case ContextMenuTypes.MarkEditor:
                    this.$contextEle.style.display = 'none';
                    if (typeof this.contextHiddenCallback === 'function') {

                        this.contextHiddenCallback(this.contextNodeIds, this.$contextEle.querySelector('textarea').value);

                    }
                    break;

                default:
                    break;

            }

            this.$contextEle = null;
            this.contextNodeIds = null;
            this.contextType = null;
            this.contextData = null;
            this.contextHiddenCallback = null;

            return this;

        }

        getContextNodeIds (): NodeIds {

            return this.contextNodeIds;

        }

        getContextType (): ContextMenuTypes {

            return this.contextType;

        }

        getContextData (): any {

            return this.contextData;

        }

    };
