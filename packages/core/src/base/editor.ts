// import * as G6Types                             from '@antv/g6/lib/types';
import MindmapCore                              from '../index';
import {
    getNodeElements,
}                                               from './utils';
import {
    EventNames,
}                                               from '../interface';

export const refreshTextEditorPosition = (mindmap: MindmapCore): void => {

    const node = mindmap.editNode;

    // if (node) {

    //     const edges = node.getEdges();

    //     vm.data.editNode.refresh();
    //     refreshNodeEdges(edges);

    // }

    const elements = getNodeElements(node);
    const textAttr = elements.text.attr();
    const nodeBbox = node.getBBox();
    const textBbox = elements.text.getBBox();
    const conBbox = elements.con.getBBox();
    const zoom = mindmap.graph.getZoom();
    const {
        x : nodeX,
        y : nodeY,
    } = mindmap.graph.getCanvasByPoint(nodeBbox.x, nodeBbox.y);

    // when text is empty use placeholder
    // if (textBbox.width === 0) {

    //     textBbox = shapes.placeholder.getBBox();

    // }

    const padding = 5;
    const inputX = `${textBbox.x - padding}px`;
    const inputY = `${textBbox.y - padding}px`;

    mindmap._options.$editor.style.display = 'block';
    mindmap._options.$editor.style.left = `${nodeX}px`;
    mindmap._options.$editor.style.top = `${nodeY}px`;
    mindmap._options.$editor.style.width = `${conBbox.width}px`;
    mindmap._options.$editor.style.height = `${conBbox.height}px`;
    // mindmap._options.$editor.style.background = `rgba(0,0,0,0.25)`;

    mindmap._options.$editorInput.style.width = `${textBbox.width + (padding * 2)}px`;
    mindmap._options.$editorInput.style.height = `${textBbox.height + (padding * 2)}px`;
    mindmap._options.$editorInput.style.padding = `${padding}px`;
    mindmap._options.$editorInput.style.left = inputX;
    mindmap._options.$editorInput.style.top = inputY;
    mindmap._options.$editorInput.style.fontSize = `${textAttr.fontSize}px`;
    mindmap._options.$editorInput.style.textAlign = textAttr.textAlign;
    mindmap._options.$editorInput.style.fontWeight = textAttr.fontWeight;
    mindmap._options.$editorInput.style.fontStyle = textAttr.fontStyle;
    mindmap._options.$editorInput.style.fontFamily = textAttr.fontFamily;
    mindmap._options.$editorInput.style.lineHeight = '1em';
    // mindmap._options.$editorInput.style.background = `rgba(0,255,91,0.25)`;
    // mindmap._options.$editorInput.style.color = `rgba(255,0,0,0.8)`;

    // this.data.$editContentInput.style.color = textAttr.fill;
    mindmap.editContent = textAttr.text;
    mindmap.emit(EventNames.EditContentChange);
    mindmap.editZoom = zoom;
    mindmap.emit(EventNames.ZoomChange);

};