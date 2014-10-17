var editor = CodeMirror(document.getElementById('editor'),
        { lineNumbers: true });
        
editor.setValue(localStorage.scratch || "Welcome to Red Eagle.");
editor.on('dblclick', B.expand_or_contract);

var inject = function(url) {
    var script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
}
        
var B = {};
B.line = {
    current: function(editor, offset) {
        var dot = editor.getCursor();
        offset = offset || 0;
        return editor.getRange({line:dot.line+offset, ch:0},
            {line:dot.line+offset});
    },
    indent: function(editor, offset) {
        return B.line.current(editor, offset)
            .match("^( *)")[1];
    }
};

B.splice = function(editor, text) {
    editor.setCursor({line:editor.getCursor().line})
    editor.replaceSelection(text);
};
B.kill_line = function(editor, offset) {
    var dot = editor.getCursor();
    var original = {line:dot.line, ch:dot.ch};
    dot.line += offset || 0;
    editor.replaceRange("", {line:dot.line, ch: 0}, {line:dot.line+1, ch:0});
    editor.setCursor(original);
}
B.tree = {
    has_children: function(editor){
        var my_indent = B.line.indent(editor).length;
        var next_indent = B.line.indent(editor,1).length;
        return (next_indent > my_indent);
    },
    remove_children: function(editor){
        while(B.tree.has_children(editor)) {
            B.kill_line(editor, +1);
        }
    }
};
B.expand_or_contract = function(editor, event) {
    if (B.tree.has_children(editor)) {
        console.log("has_children=true");
        B.tree.remove_children(editor);
    } else {
        var text = "\n"+B.line.indent(editor)+"  | cows";
        B.splice(editor, text);
    }
    event.codemirrorIgnore=true;
};

var Menus = {
    hello: function(){return "Welcome to Red Eagle."},
    echo: function(args){return JSON.stringify(args)}
};