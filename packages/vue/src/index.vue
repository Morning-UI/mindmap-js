<template>
    <div class="mindmap">
        <div class="mindmap-canvas"></div>
        <div class="mindmap-editor">
            <textarea
                v-model="editContent"
            ></textarea>
        </div>
        <div class="mindmap-menu-link">
            <a @click="mindmap.menuItemLinkEdit($event)">编辑链接</a>
            <i class="line"></i>
            <a @click="mindmap.menuItemLinkDelete($event)">删除链接</a>
        </div>
        <div class="mindmap-menu-note">
            <a @click="mindmap.menuItemNoteEdit($event)">编辑备注</a>
            <i class="line"></i>
            <a @click="mindmap.menuItemNoteDelete($event)">删除备注</a>
        </div>
        <div class="mindmap-menu-tag">
            <a @click="mindmap.menuItemTagEdit($event)">编辑标签</a>
            <i class="line"></i>
            <a @click="mindmap.menuItemTagDelete($event)">删除标签</a>
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
        <div class="mindmap-box-edit-mark">
            <i class="arrow"></i>
            <h3>编辑标记</h3>
            <ul @click="mindmap.menuItemMarkChoose($event)"></ul>
        </div>
    </div>
</template>

<script>
import {
    default as Mindmap,
    EventNames,
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
        .on(EventNames.EditContentChange, (editContent) => {
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