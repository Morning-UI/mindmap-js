<template>
    <div class="mindmap">
        <div class="mindmap-canvas"></div>
        <div class="mindmap-editor">
            <textarea
                v-model="editContent"
            ></textarea>
        </div>
        <div class="mindmap-menu-link">
            <a @click="mindmap.menuItemLinkEdit">编辑链接</a>
            <i class="line"></i>
            <a @click="mindmap.menuItemLinkDelete">删除链接</a>
        </div>
        <div class="mindmap-menu-note">
            <a @click="mindmap.menuItemNoteEdit">编辑备注</a>
            <i class="line"></i>
            <a @click="mindmap.menuItemNoteDelete">删除备注</a>
        </div>
        <div class="mindmap-menu-tag">
            <a @click="mindmap.menuItemTagEdit">编辑标签</a>
            <i class="line"></i>
            <a @click="mindmap.menuItemTagDelete">删除标签</a>
        </div>
        <div class="mindmap-box-edit-link">
            <i class="arrow"></i>
            <h3>编辑链接</h3>
            <textarea rows="3" v-model="edittingLink"></textarea>
        </div>
        <div class="mindmap-box-edit-note">
            <i class="arrow"></i>
            <h3>编辑备注</h3>
            <textarea rows="5" v-model="edittingNote"></textarea>
        </div>
        <div class="mindmap-box-edit-tag">
            <i class="arrow"></i>
            <h3>编辑标签</h3>
            <textarea rows="5" v-model="edittingTag"></textarea>
        </div>
    </div>
</template>

<script>
import {
    default as Mindmap,
    EventNamesEnum,
    testData,
}                                               from 'mindmap-core';

export default {
    data : function () {
        return {
            mindmap : {},
            editContent : '',
            edittingLink : null,
            edittingNote : null,
            edittingTag : null,
        };
    },
    methods : {},
    mounted : function () {

        this.mindmap = new Mindmap({
            $con : this.$el,
        })
        .readData(testData.data2)
        .on(EventNamesEnum.EditContentChange, (editContent) => {
            this.editContent = editContent;
        });

        this.$watch('editContent', (content) => {
            this.mindmap.editorInput(content);
        });
        this.$watch('edittingLink', () => {
            this.mindmap.link(this.mindmap.getCurrentEditLinkNodeIds(), this.edittingLink);
        });

        this.$watch('edittingNote', () => {
            this.mindmap.note(this.mindmap.getCurrentEditNoteNodeIds(), this.edittingNote);
        });

        this.$watch('edittingTag', () => {
            this.mindmap.tag(this.mindmap.getCurrentEditTagNodeIds(), this.edittingTag.split(','));
        });

    }
};
</script>