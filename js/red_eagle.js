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

B.splice = function(s, marker) {
    var v = this.lines.before(true) + "\n";
    var m = v.length;
    var indent = this.lines.indent();
    marker = marker || "|";
    v += s.split("\n").map(function(t){return indent+"  "+marker+" "+t}).join("\n");
    var n = v.length;
    v += "\n" + this.lines.after();
    return {value: v, start: m, end: n};
}

B.ondblclick = function(e) {
    e.preventDefault();
    var line = this.selected_line(true);
    var s = this.splice("cows");
    this.value = s.value;
    this.selectionStart = s.start;
    this.selectionEnd = s.end;
    //console.log(this.selected_line(true));
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