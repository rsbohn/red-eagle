// https://gist.github.com/andyhd/1618403
function maybe(value) {
  var obj = null;
  function isEmpty() { return value === undefined || value === null }
  function nonEmpty() { return !isEmpty() }
  obj = {
    map: function (f) { return isEmpty() ? obj : maybe(f(value)) },
    otherwise: function (n) { return isEmpty() ? n : value },
    isEmpty: isEmpty,
    nonEmpty: nonEmpty
  }
  return obj;
};


var B = document.getElementById("B");
B.getTag = function(){
    return B.value.split("\n")[0];
};
B.alt="empty";
B.store = function(tag) {
    tag = tag || B.getTag();
    localStorage[tag] = B.value;
};
B.load = function(tag) {
    B.value = localStorage[tag] || "not found";
};
// custom user interactions
B.selection = function(){
    return this.value.substring(this.selectionStart, this.selectionEnd);
};
B.selected_line = function(update_selection) {
    var p0 = this.selectionStart;
    var p1 = this.selectionEnd;
    var s = this.value;
    //back up if we're on a \n
    if (s[p0] === "\n") {p0--;p1--}
    for (;p0 >= 0 && s[p0] !== "\n"; p0--);
    if (s[p0] === "\n") p0++;

    for (;p1 <= s.length && s[p1] !== "\n"; p1++);
    if (update_selection) {
	this.selectionStart = p0;
	this.selectionEnd = p1;
    }
    return s.substring(p0,p1);
};
//there must be a better way...
B.lines = {
    all: function() {
	return B.value.split("\n");
    },
    current: function() {
	return B.selected_line(false);
    },
    indent: function() {
	return B.selected_line(false).match("^( *)")[1];
    },
    before: function(include_current) {
	var n;
	if (include_current) { for (n = B.selectionEnd; n < B.value.length && B.value[n] !== "\n"; n++); }
	else { for (n = B.selectionStart; n >= 0 && B.value[n] !== "\n"; n--); }
	return B.value.substring(0,n);
    },
    after: function() {
	for (var m = B.selectionEnd; m < B.value.length && B.value[m] != "\n"; m++);
	return B.value.substring(m+1);
    }
};

B.forward_eol = function() {
    for (x = this.selectionStart; x < this.value.length && this.value[x] != "\n"; x++);
    this.selectionEnd=x+1;
    this.selectionStart=x;
};

B.hard_splice = function(s, marker) {
    var v = this.lines.before(true) + "\n";
    var m = v.length;
    var indent = this.lines.indent();
    marker = marker || "|";
    v += s.split("\n").map(function(t){return indent+"  "+marker+" "+t}).join("\n");
    var n = v.length;
    v += "\n" + this.lines.after();
    return {value: v, start: m, end: n};
};

B.splice = function(s, marker) {
    marker = marker || "|";
    var indent = this.lines.indent();
    var marked = s.split("\n").map(function(t){return indent+"  "+marker+" "+t}).join("\n");
    this.forward_eol();
    try {
	if (!document.execCommand("insertText", false, "\n"+marked+"\n"))
	    throw "must be IE";
    } catch (e) {
	this.update(this.hard_splice(s,marker));
    }
};

B.update = function(t){
    this.value = t.value;
    this.selectionStart = t.start;
    this.selectionEnd = t.end;
    return this;
};

B.ondblclick = function(e) {
    //e.defaultPrevented=true;
    if (this.lines.current() === "") return;
    if (!Tree(this).has_children()) {
	this.splice("cows");
    } else {
	Tree(this).remove_children();
    }
};

//text is a string with a selection.
B.as_text = function(){
    return { value: this.value, start: this.selectionStart, end: this.selectionEnd};
};

var Tree = function(that){
    var T = function(that) {
	this.client = that;
    };
    T.prototype.has_children = function() {
	var indent = this.client.lines.indent().length;
	var a = this.client.lines.after().split("\n")[0];
	return a.match(/^( *)/)[1].length > indent;
    }
    T.prototype.remove_children = function() {
	var indent = this.client.lines.indent();
	this.client.forward_eol();
	this.client.selectionStart++;
	var start = this.client.selectionStart;
	var end = start+1;
	while (end < this.client.value.length) {
	    if (this.client.lines.indent() <= indent) break;
	    this.client.forward_eol();
	    this.client.selectionStart++;
	    end = this.client.selectionStart;
	}
	this.client.selectionStart = start;
	this.client.selectionEnd = end;
	try {
	    if (!document.execCommand("delete"))
		throw "must be IE";
	} catch (e) {
	    this.client.update({
		value: this.client.value.substring(0,start)+this.client.value.substring(end),
		start: start,
		end: end
	    });
	}
	return this.client;
    }
    return new T(that);
};

var note = function(msg) {
    document.getElementsByTagName("footer")[0].textContent = 
	new Date().toTimeString().substr(0,9) + msg;
};

var truthy = function() { return true; };

/*
// remotestorage
RemoteStorage.defineModule('notes', function(prv,pub){
    prv.cache('');
    var note=[], cb;
    prv.on('change', function(e){
	note.push(e.newValue);
	if (cb) cb(e);
    });
    return { exports: {
	setNote: function(text) {
	    prv.storeFile('text/plain', 'eagle.txt', text);
	    return "ok";
	},
	getNote: function() {
	    return note;
	},
	onChange: function(setCb) {
	    cb = setCb;
	}}};
});

var log_note = function(e){
    console.log(JSON.stringify(e));
    console.log(remoteStorage.notes.getNote());
};

remoteStorage.access.claim('notes', 'rw');
remoteStorage.displayWidget();
remoteStorage.notes.onChange(log_note);
*/