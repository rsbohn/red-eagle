// xiki-inspired editor
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
//start with cows
B._eval = function(s){
  try {return eval(s);}
  catch(ex){
    if (ex.name !== "SyntaxError") return ex.message;
    return "| cows";
  }
};
B.fill = function(editor, indent, target){
  return "\n  " + indent + this._eval(target);
};

B.expand_or_contract = function(editor, event) {
    if (B.tree.has_children(editor)) {
        B.tree.remove_children(editor);
    } else {
	var indent = B.line.indent(editor);
	var target = B.line.current(editor);
	B.splice(editor, B.fill(editor, indent, target));
    }
    event.codemirrorIgnore=true;
};

var ed = CodeMirror(document.getElementById('editor'),
        { lineNumbers: true });

ed.setValue(localStorage.scratch || "Welcome to Red Eagle.");
ed.on('dblclick', B.expand_or_contract);


var Menus = {
    hello: function(){return "Welcome to Red Eagle."},
    echo: function(args){return JSON.stringify(args)}
};

