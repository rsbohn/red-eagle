var editor = CodeMirror(document.getElementById('editor'),
        { lineNumbers: true });
        
editor.setValue(localStorage.scratch || "Welcome to Red Eagle.");
var inject = function(url) {
    var script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
}
        
var B = {};
B.line = {
    current: function(editor) {return editor.getValue();}
};

B.splice = function(editor, text) {
    editor.setCursor({line:editor.getCursor().line})
    editor.replaceSelection(text);
    return editor;
}