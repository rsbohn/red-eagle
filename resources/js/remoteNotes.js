RemoteStorage.defineModule('notes', function(prv,pub){
    prv.cache('');
    var note=[], cb;
    prv.on('change', function(e) {
	note.push(e.newValue);
	if (cb) cb(e);
    });
    return { exports: {
	setNote: function(text) {
	    prv.storeFile('text/plain', 'eagle.note', text);
	    return "ok";
	},
	getNote: function() {
	    return note;
	},
	onChange: function(setCb) {
	    cb = setCb;
	}
    }};
});
remoteStorage.access.claim('notes','rw');