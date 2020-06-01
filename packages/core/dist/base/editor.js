import { getNodeElements, } from './utils';
import { EventNames, } from '../interface';
export var refreshTextEditorPosition = function (mindmap) {
    var node = mindmap.editNode;
    // if (node) {
    //     const edges = node.getEdges();
    //     vm.data.editNode.refresh();
    //     refreshNodeEdges(edges);
    // }
    var elements = getNodeElements(node);
    var textAttr = elements.text.attr();
    var nodeBbox = node.getBBox();
    var textBbox = elements.text.getBBox();
    var conBbox = elements.con.getBBox();
    var zoom = mindmap.graph.getZoom();
    var _a = mindmap.graph.getCanvasByPoint(nodeBbox.x, nodeBbox.y), nodeX = _a.x, nodeY = _a.y;
    // when text is empty use placeholder
    // if (textBbox.width === 0) {
    //     textBbox = shapes.placeholder.getBBox();
    // }
    var padding = 5;
    var inputX = textBbox.x - padding + "px";
    var inputY = textBbox.y - padding + "px";
    mindmap._options.$editor.style.display = 'block';
    mindmap._options.$editor.style.left = nodeX + "px";
    mindmap._options.$editor.style.top = nodeY + "px";
    mindmap._options.$editor.style.width = conBbox.width + "px";
    mindmap._options.$editor.style.height = conBbox.height + "px";
    // mindmap._options.$editor.style.background = `rgba(0,0,0,0.25)`;
    mindmap._options.$editorInput.style.width = textBbox.width + (padding * 2) + "px";
    mindmap._options.$editorInput.style.height = textBbox.height + (padding * 2) + "px";
    mindmap._options.$editorInput.style.padding = padding + "px";
    mindmap._options.$editorInput.style.left = inputX;
    mindmap._options.$editorInput.style.top = inputY;
    mindmap._options.$editorInput.style.fontSize = textAttr.fontSize + "px";
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
