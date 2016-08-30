var Dispatcher = require('flux').Dispatcher;
var dispatcher = new Dispatcher();

dispatcher.stagedEditors = [];

// manage editing session
function updateEditSessions () {
	dispatcher.stagedEditors = dispatcher.stagedEditors.filter(function (editor) {
		var keep = true;

		if (editor.isMounted()) {
			if (!editor.hasFocus() && document.activeElement.tagName.toLowerCase() !== 'body') {
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
