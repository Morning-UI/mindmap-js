import './index.less';

import React, {
    useState,
    useEffect,
    ChangeEventHandler,
    MouseEventHandler,
    KeyboardEventHandler,
    ChangeEvent,
}                                               from 'react';
import {
    default as Mindmap,
    testData,
    EventNames,
    MindmapCoreType,
}                                               from 'mindmap-core';

const MindmapComponent = () => {

    const elRef = React.createRef<HTMLDivElement>();
    const [mindmap, setMindmap]: [MindmapCoreType, React.Dispatch<any>] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [edittingLink, setEdittingLink] = useState('');
    const [edittingNote, setEdittingNote] = useState('');
    const [edittingTag, setEdittingTag] = useState('');

    const editContentChange: ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
        mindmap.editorInput(evt.target.value);
    };

    const edittingLinkChange: ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
        mindmap.link(mindmap.getCurrentEditLinkNodeIds(), evt.target.value);
        setEdittingLink(evt.target.value);
    }

    const edittingNoteChange: ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
        mindmap.note(mindmap.getCurrentEditNoteNodeIds(), evt.target.value);
        setEdittingNote(evt.target.value);
    };

    const edittingTagChange: ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
        mindmap.tag(mindmap.getCurrentEditTagNodeIds(), evt.target.value.split(','));
        setEdittingTag(evt.target.value);
    };

    useEffect(() => {

        if (mindmap === null) {

            const $el = elRef.current;

            setMindmap(
                new Mindmap({
                    $con : $el
                })
                .readData(testData.data2)
                .on(EventNames.EditContentChange, (_editContent: string): void => {
                    setEditContent(_editContent);
                })
            );

        }

    });

    if (mindmap) {

        return (
            <div className="mindmap" ref={elRef}>
                <div className="mindmap-canvas"></div>
                <div className="mindmap-editor">
                    <textarea
                        value={editContent}
                        onChange={editContentChange}
                    ></textarea>
                </div>
                <div className="mindmap-menu-link">
                    <a onClick={mindmap.menuItemLinkEdit.bind(mindmap)}>编辑链接</a>
                    <i className="line"></i>
                    <a onClick={mindmap.menuItemLinkDelete.bind(mindmap)}>删除链接</a>
                </div>
                <div className="mindmap-menu-note">
                    <a onClick={mindmap.menuItemNoteEdit.bind(mindmap)}>编辑备注</a>
                    <i className="line"></i>
                    <a onClick={mindmap.menuItemNoteDelete.bind(mindmap)}>删除备注</a>
                </div>
                <div className="mindmap-menu-tag">
                    <a onClick={mindmap.menuItemTagEdit.bind(mindmap)}>编辑标签</a>
                    <i className="line"></i>
                    <a onClick={mindmap.menuItemTagDelete.bind(mindmap)}>删除标签</a>
                </div>
                <div className="mindmap-box-edit-link">
                    <i className="arrow"></i>
                    <h3>编辑链接</h3>
                    <textarea
                        rows={3}
                        value={edittingLink}
                        onChange={edittingLinkChange}
                    ></textarea>
                </div>
                <div className="mindmap-box-edit-note">
                    <i className="arrow"></i>
                    <h3>编辑备注</h3>
                    <textarea
                        rows={5}
                        value={edittingNote}
                        onChange={edittingNoteChange}
                    ></textarea>
                </div>
                <div className="mindmap-box-edit-tag">
                    <i className="arrow"></i>
                    <h3>编辑标签</h3>
                    <textarea
                        rows={5}
                        value={edittingTag}
                        onChange={edittingTagChange}
                    ></textarea>
                </div>
            </div>
        );

    } else {

        return (
            <div className="mindmap" ref={elRef}>
                <div className="mindmap-canvas"></div>
                <div className="mindmap-editor">
                    <textarea></textarea>
                </div>
                <div className="mindmap-menu-link"></div>
                <div className="mindmap-menu-note"></div>
                <div className="mindmap-menu-tag"></div>
                <div className="mindmap-box-edit-link"></div>
                <div className="mindmap-box-edit-note"></div>
                <div className="mindmap-box-edit-tag"></div>
            </div>
        );

    }

};

export default MindmapComponent;
