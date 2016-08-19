// Store selected values in localStorage

// Store selected value of "Open test in new window"
localStorage.openInNewWindow = document.querySelector('input[name = "launchInNewWindow"]:checked').value;

// Store selected value of "Make the lnik available"
localStorage.islinkVisible = document.querySelector('input[name = "isLinkVisible"]:checked').value;

// Store state of "Multiple Attempts" checkbox as boolean
localStorage.isMultipleAttempts = document.querySelector('input[name = "isMultipleAttempts"]').checked;

if (localStorage.isMultipleAttempts) {
	
	// Store selected radio button value of "Multple attempts" > "unlimited attempts or number of attempts"
	localStorage.isUnlimitedAttempts = document.querySelector('input[name = "isUnlimitedAttempts"]:checked').value;
	
	if (!localStorage.isUnlimitedAttempts) {
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

if (localStorage.isTimeLimit) {
	
	// Store selected value of "Set timer" > "Minutes"
	localStorage.maxMinutes = document.querySelector('input[name = "maxMinutes"]').value;

	// Store selected radio button value of "Set timer" > "Auto submit"
	localStorage.autoSubmit = document.querySelector('input[name = "timerCompletion"]:checked').value;
}

// Store selected value of "Display after" Start time
localStorage.autoSubmit = document.querySelector('input[name = "restrict_start_time"]').value;

// Store selected value of "Display after" End time
localStorage.autoSubmit = document.querySelector('input[name = "restrict_end_time"]').value;

// Store selected value of "Due date" time
localStorage.autoSubmit = document.querySelector('input[name = "dueDate_time"]').value;

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