// ==UserScript==
// @name         Bb Insert Knowledge Center Icons
// @version      1.1
// @description  Adds a Knowledge Center icon based on user selection from select box added to TinyMCE editor tools.
// @author       Daniel Victoriano
// @match        https://fiu.blackboard.com/*
// ==/UserScript==

(function() {
    'use strict';

    if(unsafeWindow.tinyMCE !== undefined) {

    setTimeout(function() {

    // Add event listener on select box

    var tinyMCE = unsafeWindow.tinyMCE.getInstanceById("htmlData_text"); // Get Editor instance

    var newMenu = document.createElement("td"); // Create td element

    newMenu.style.position = "relative"; // Set style

    // Set innerHTML
    newMenu.innerHTML = '<select style="width: 120px; max-width: 120px !important;" id="htmlData_text_iconselect" class="mceNativeListBox" tabindex="-1">\
<option value="">Style 5 Icons</option>\
<option value="Content Folder">Content Folder</option>\
<option value="Chapter Resources">Chapter Resources</option>\
<option value="Videos">Videos</option>\
<option value="Presentation">Presentation</option>\
<option value="Supplemental">Supplemental</option>\
<option value="Assignment">Assignment</option>\
<option value="Assessment">Assessment</option>\
<option value="Discussion Board">Discussion Board</option>\
<option value="Groups">Groups</option>\
<option value="Adobe Connect">Adobe Connect</option>\
<option value="Checklist">Checklist</option>\
<option value="Next">Next</option>\
</select>';

    var editorTable = document.querySelector("#htmlData_text_toolbar2 tr"); // Get parent node to add cloned node to

    var insertLocation = editorTable.children.length-1; // Calculate second to last child element

    editorTable.insertBefore(newMenu, editorTable.children[insertLocation]); // Insert newMenu to parent node


// Add event listener on select box
var iconSelectBox = document.getElementById("htmlData_text_iconselect");

iconSelectBox.addEventListener("change", function() {
addIconHTML();
});


// Sets style icon HTML in editor
function addIconHTML() {

	var currContent;

	if(tinyMCE.dom.get("icon_table")) {
		currContent = tinyMCE.dom.get("second_td").innerHTML; // Get Editor's current content within table's second child td
	}
	else {
		currContent = tinyMCE.getContent(); // Get Editor's current content
	}

	if(document.getElementById("htmlData_text_iconselect").value == "Content Folder") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"http://vivomedia.fiu.edu/5617d8b83f4fd/New%20Icon%20Set%203/bluefolder.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}

	else if(document.getElementById("htmlData_text_iconselect").value == "Chapter Resources") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"https://s3.amazonaws.com/vivomedia.fiu.edu/465b2b5d-9184-4da2-adbf-982d810083cb/source.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Videos") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"http://vivomedia.fiu.edu/5617d8b83f4fd/New%20Icon%20Set%203/bluevideo.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	if(document.getElementById("htmlData_text_iconselect").value == "Presentation") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"https://s3.amazonaws.com/vivomedia.fiu.edu/43316968-c806-44a5-99eb-efe9aea03da9/source.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Supplemental") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"http://vivomedia.fiu.edu/5617d8b83f4fd/New%20Icon%20Set%203/bluelink.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Assignment") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"https://s3.amazonaws.com/vivomedia.fiu.edu/ec48bea4-eea3-4abd-9efa-c727e8aecbe6/source.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Assessment") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"http://vivomedia.fiu.edu/5617d8b83f4fd/New%20Icon%20Set%203/blueassessment.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Discussion Board") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"http://vivomedia.fiu.edu/5617d8b83f4fd/New%20Icon%20Set%203/bluediscussion.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Groups") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"http://vivomedia.fiu.edu/5617d8b83f4fd/New%20Icon%20Set%203/group.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Adobe Connect") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"https://s3.amazonaws.com/vivomedia.fiu.edu/4c60d63b-6445-4d00-99b0-224fdbb7d7bf/source.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Checklist") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"http://vivomedia.fiu.edu/5617d8b83f4fd/New%20Icon%20Set%203/bluechecklist.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}
	
	else if(document.getElementById("htmlData_text_iconselect").value == "Next") {
	tinyMCE.setContent('\<table id="icon_table" border="0" cellspacing="1" cellpadding="5">\
	<tbody>\
	<tr>\
	<td valign="top" width="100">\
	<img style="vertical-align: middle;" alt="icon" src=\"https://s3.amazonaws.com/vivomedia.fiu.edu/a561914c-6532-4890-85d8-b026b56c7f88/source.png" width="100" height="100" />\
	</td>\
	<td id="second_td" valign="left">\
	</td>\
	</tr>\
	</tbody>\
	</table>', {format: 'raw'});
	}

	// Get td element
	var secondColumn = tinyMCE.dom.get("second_td");

	// Set content from HTML String
	secondColumn.innerHTML = currContent;

}
  }, 2000);
    }
})();