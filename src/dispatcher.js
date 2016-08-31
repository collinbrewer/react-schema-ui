var Dispatcher = require('flux').Dispatcher;
var dispatcher = new Dispatcher();

dispatcher.stagedEditors = [];

// manage editing session
function updateEditSessions () {
	let activeElement = document.activeElement.tagName.toLowerCase();

	dispatcher.stagedEditors = dispatcher.stagedEditors.filter(function (editor) {
		var keep = true;

		if (editor.isMounted()) {
			if (!editor.hasFocus() && (dispatcher.stagedEditors.length === 1 || activeElement !== 'body')) {
				editor.endEditSession();
			}

			keep = editor.isEditing();
		}
		else {
			keep = false;
		}

		return keep;
	});
}

// poll for changes in focus
setInterval(updateEditSessions, 250);

dispatcher.register(function (payload) {
	if (payload.actionType === 'beginEditSession') {
		updateEditSessions();

		dispatcher.stagedEditors.push(payload.editor);
	}
});

module.exports = dispatcher;
