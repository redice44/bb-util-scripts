// Add "Save Settings" and "Apply Settings" buttons
var header = document.getElementById("pageTitleHeader");
header.insertAdjacentHTML('beforeend', '<button id="save_settings" class="button-1" style="width: 120px; height: 30px; font-size: 14px; padding: 0px; margin-right: 15px;">Save Settings</button>');
header.insertAdjacentHTML('beforeend', '<button id="apply_settings" class="button-1" style="width: 120px; height: 30px; font-size: 14px; padding: 0px; margin-right: 15px;">Apply Settings</button>');

// Add listener to "Save Settings" button
document.getElementById("save_settings").addEventListener("click", saveSettings);
		
// Add listener to "Apply Settings" button
document.getElementById("apply_settings").addEventListener("click", applySettings);

// Store form field states/values in localStorage
function saveSettings() {

// Clear local Storage
localStorage.clear();

// Store selected value of "Open test in new window"
localStorage.openInNewWindow = document.querySelector('input[name = "launchInNewWindow"]:checked').value;

// Store selected value of "Make the lnik available"
localStorage.islinkVisible = document.querySelector('input[name = "isLinkVisible"]:checked').value;

// Store state of "Multiple Attempts" checkbox as boolean
localStorage.isMultipleAttempts = document.querySelector('input[name = "isMultipleAttempts"]').checked;

if (localStorage.isMultipleAttempts === "true") {
	
	// Store selected radio button value of "Multple attempts" > "unlimited attempts or number of attempts"
	localStorage.isUnlimitedAttempts = document.querySelector('input[name = "isUnlimitedAttempts"]:checked').value;
	
	if (localStorage.isUnlimitedAttempts === "false") {
		// Store selected value of "Number of attempts"
		localStorage.attemptCountValue = document.querySelector('input[name = "attemptCount"]').value;
	}
}

// Store selected value of "Score attempts using"
localStorage.gradingOptionsValue = document.querySelector('select[name = "gradingOptions_aggregationModel"]').value;

// Store state of "Force completion" checkbox as boolean
localStorage.isForceComplete = document.querySelector('input[name = "isForceComplete"]').checked;

// Store state of "Set timer" checkbox as boolean
localStorage.isTimeLimit = document.querySelector('input[name = "isTimeLimit"]').checked;

if (localStorage.isTimeLimit === "true") {
	
	// Store selected value of "Set timer" > "Minutes"
	localStorage.maxMinutes = document.querySelector('input[name = "maxMinutes"]').value;

	// Store selected radio button value of "Set timer" > "Auto submit"
	localStorage.autoSubmit = document.querySelector('input[name = "timerCompletion"]:checked').value;
}

if (document.querySelector('input[name = "restrict_start_checkbox"]').checked) {
	
	localStorage.restrict_start_checkbox = "true";
	
	// Store selected value of "Display after" Start time
	localStorage.restrict_start_time = document.querySelector('input[name = "restrict_start_time"]').value;

}

if (document.querySelector('input[name = "restrict_end_checkbox"]').checked) {
	
	localStorage.restrict_end_checkbox = "true";

	// Store selected value of "Display after" End time
	localStorage.restrict_end_time = document.querySelector('input[name = "restrict_end_time"]').value;

}

if (document.querySelector('input[name = "due_date_in_use"]').checked) {
	
	localStorage.due_date_in_use = "true";
	
	// Store selected value of "Due date" time
	localStorage.dueDate_time = document.querySelector('input[name = "dueDate_time"]').value;

}

// Check which results/feedback options are selected in first row (if something other than "choose" is selected)
if (!document.querySelector("select[name=feedbackState_0_state] option[value=ns]").selected) {
	
	// Store selected option in localStorage
	localStorage.whenToGiveFeedback0 = document.querySelector("select[name=feedbackState_0_state").value;
	
	// Store state of "Score per question" in localStorage
	localStorage.feedbackState_0_score = document.querySelector('input[name = "feedbackState_0_score"]').checked;
	
	// Store states of "Asnwers" in localStorage
	localStorage.feedbackState_0_allAnswers = document.querySelector('input[name = "feedbackState_0_allAnswers"]').checked;
	localStorage.feedbackState_0_correctAnswers = document.querySelector('input[name = "feedbackState_0_correctAnswers"]').checked;
	localStorage.feedbackState_0_submittedAnswers = document.querySelector('input[name = "feedbackState_0_submittedAnswers"]').checked;
	
	// Store state of "Feedback" in localStorage
	localStorage.feedbackState_0_instructorFeedback = document.querySelector('input[name = "feedbackState_0_instructorFeedback"]').checked;
	
	// Store state of "Show incorrect questions" in localStorage
	localStorage.feedbackState_0_incorrectAnswers = document.querySelector('input[name = "feedbackState_0_incorrectAnswers"]').checked;
}

// Check which results/feedback options are selected in first row (if something other than "choose" is selected)
if (!document.querySelector("select[name=feedbackState_1_state] option[value=ns]").selected) {
	
	// Store selected option in localStorage
	localStorage.whenToGiveFeedback1 = document.querySelector("select[name=feedbackState_1_state").value;
	
	// Store state of "Score per question" in localStorage
	localStorage.feedbackState_1_score = document.querySelector('input[name = "feedbackState_1_score"]').checked;
	
	// Store states of "Asnwers" in localStorage
	localStorage.feedbackState_1_allAnswers = document.querySelector('input[name = "feedbackState_1_allAnswers"]').checked;
	localStorage.feedbackState_1_correctAnswers = document.querySelector('input[name = "feedbackState_1_correctAnswers"]').checked;
	localStorage.feedbackState_1_submittedAnswers = document.querySelector('input[name = "feedbackState_1_submittedAnswers"]').checked;
	
	// Store state of "Feedback" in localStorage
	localStorage.feedbackState_1_instructorFeedback = document.querySelector('input[name = "feedbackState_1_instructorFeedback"]').checked;
	
	// Store state of "Show incorrect questions" in localStorage
	localStorage.feedbackState_1_incorrectAnswers = document.querySelector('input[name = "feedbackState_1_incorrectAnswers"]').checked;

}

// Store selected value of "Test presentation" ("All at once" or "One at a time")
localStorage.deliveryType = document.querySelector('input[name = "deliveryType"]:checked').value;

// Store state of "Prohibit backtracking" checkbox as boolean
localStorage.isBacktrackProhibited = document.querySelector('input[name = "isBacktrackProhibited"]').checked;

// Store state of "Randomize questions" checkbox as boolean
localStorage.randomizeQuestionsIndicator = document.querySelector('input[name = "randomizeQuestionsIndicator"]').checked;

alert("Settings have been saved.");

}

// Apply stored settings
function applySettings() {

document.querySelector('input[name = "launchInNewWindow"][value= '+ localStorage.openInNewWindow + ']').checked = true;

document.querySelector('input[name = "isLinkVisible"][value=' + localStorage.islinkVisible + ']').checked = true;

if (localStorage.isMultipleAttempts === "true") {
	
	if (!document.querySelector('input[name = "isMultipleAttempts"]').checked) {
		document.querySelector('input[name = "isMultipleAttempts"]').click();
	}
	
	document.querySelector('input[name = "isUnlimitedAttempts"][value=' + localStorage.isUnlimitedAttempts + ']').checked = true;
	
	document.querySelector("select[name = gradingOptions_aggregationModel]").value = localStorage.gradingOptionsValue;
	
	if (localStorage.isUnlimitedAttempts === "false") {
		
		document.querySelector('input[name = "attemptCount"]').value = localStorage.attemptCountValue;
	}
}

if (localStorage.isMultipleAttempts === "false") {
	
	if (document.querySelector('input[name = "isMultipleAttempts"]').checked) {
		document.querySelector('input[name = "isMultipleAttempts"]').click();
	}
}

document.querySelector('input[name = "isForceComplete"]').checked = JSON.parse(localStorage.isForceComplete);

if (localStorage.isTimeLimit === "true") {
	
	if (!document.querySelector('input[name = "isTimeLimit"]').checked) {
		document.querySelector('input[name = "isTimeLimit"]').click();
	}
	
	document.querySelector('input[name = "maxMinutes"]').value = localStorage.maxMinutes;
	document.querySelector('input[name = "timerCompletion"][value=' + localStorage.autoSubmit + ']').checked = true;
}
else if (localStorage.isTimeLimit === "false") {
	
	if (document.querySelector('input[name = "isTimeLimit"]').checked) {
		document.querySelector('input[name = "isTimeLimit"]').click();
	}
}

if (localStorage.restrict_start_checkbox === "true") {
	
	if (!document.querySelector('input[name = "restrict_start_checkbox"]').checked) {
		document.querySelector("input[name = restrict_start_checkbox]").click();
	}
	
	document.querySelector('input[name = "restrict_start_time"]').setAttribute("value", localStorage.restrict_start_time);
	document.querySelector('input[name = "restrict_start_time"]').value = localStorage.restrict_start_time;
	
}

if (localStorage.restrict_start_checkbox === "false") {
	
	if (document.querySelector('input[name = "restrict_start_checkbox"]').checked) {
		document.querySelector("input[name = restrict_start_checkbox]").click();
	}	
}

if (localStorage.restrict_end_checkbox === "true") {
	
	if (!document.querySelector('input[name = "restrict_end_checkbox"]').checked) {
		document.querySelector("input[name = restrict_end_checkbox]").click();
	}
	
	document.querySelector('input[name = "restrict_end_time"]').setAttribute("value", localStorage.restrict_end_time);
	document.querySelector('input[name = "restrict_end_time"]').value = localStorage.restrict_end_time;
	
}

if (localStorage.restrict_end_checkbox === "false") {
	
	if (document.querySelector('input[name = "restrict_end_checkbox"]').checked) {
		document.querySelector("input[name = restrict_end_checkbox]").click();
	}
}

if (localStorage.due_date_in_use === "true") {
	
	if (!document.querySelector('input[name = "due_date_in_use"]').checked) {
		document.querySelector("input[name = due_date_in_use]").click();
	}
	
	document.querySelector('input[name = "dueDate_time"]').setAttribute("value", localStorage.dueDate_time);
	document.querySelector('input[name = "dueDate_time"]').value = localStorage.dueDate_time;
	
}

if (localStorage.due_date_in_use === "false") {
	
	if (document.querySelector('input[name = "due_date_in_use"]').checked) {
		document.querySelector("input[name = due_date_in_use]").click();
	}

if (localStorage.whenToGiveFeedback0 !== undefined) {
	
	document.querySelector("select[name=feedbackState_0_state]").value = localStorage.whenToGiveFeedback0;

	document.querySelector("input[name=feedbackState_0_score]").checked = JSON.parse(localStorage.feedbackState_0_score);

	document.querySelector("input[name=feedbackState_0_allAnswers").checked = JSON.parse(localStorage.feedbackState_0_allAnswers);
	document.querySelector("input[name=feedbackState_0_correctAnswers]").checked = JSON.parse(localStorage.feedbackState_0_correctAnswers);
	document.querySelector("input[name=feedbackState_0_submittedAnswers]").checked = JSON.parse(localStorage.feedbackState_0_submittedAnswers);

	document.querySelector("input[name=feedbackState_0_instructorFeedback]").checked = JSON.parse(localStorage.feedbackState_0_instructorFeedback);
	
	document.querySelector("input[name=feedbackState_0_incorrectAnswers]").checked = JSON.parse(localStorage.feedbackState_0_incorrectAnswers);
		
}

if (localStorage.whenToGiveFeedback1 !== undefined) {
	
	document.querySelector("select[name=feedbackState_1_state]").value = localStorage.whenToGiveFeedback1;

	document.querySelector("input[name=feedbackState_1_score]").checked = JSON.parse(localStorage.feedbackState_1_score);

	document.querySelector("input[name=feedbackState_1_allAnswers").checked = JSON.parse(localStorage.feedbackState_1_allAnswers);
	document.querySelector("input[name=feedbackState_1_correctAnswers]").checked = JSON.parse(localStorage.feedbackState_1_correctAnswers);
	document.querySelector("input[name=feedbackState_1_submittedAnswers]").checked = JSON.parse(localStorage.feedbackState_1_submittedAnswers);

	document.querySelector("input[name=feedbackState_1_instructorFeedback]").checked = JSON.parse(localStorage.feedbackState_1_instructorFeedback);

	document.querySelector("input[name=feedbackState_1_incorrectAnswers]").checked = JSON.parse(localStorage.feedbackState_1_incorrectAnswers);
		
}

document.querySelector("input[name = deliveryType][value= " + localStorage.deliveryType + "]").checked = true;

document.querySelector("[name=isBacktrackProhibited]").checked = JSON.parse(localStorage.isBacktrackProhibited);

document.querySelector("[name=randomizeQuestionsIndicator]").checked = JSON.parse(localStorage.randomizeQuestionsIndicator);

alert("Settings have been applied.");

}