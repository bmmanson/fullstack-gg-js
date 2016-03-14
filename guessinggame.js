/* --NOTE TO SELF:--
Before submitting this, it's necessary to refactor the code so that 
there are as few objects in the global context as possible.

Encapsulate the functions into an object, along with all the variables

//ANOTHER NOTE -- Use the jQuery ready function. See my notes on jQuery from the Code School course

*/

var GameObject = {

	generateWinningNumber: function(){
		return (Math.floor((Math.random() * 20) + 1)) * 5;
	},
	numberLog: [],
	guessesRemaining: 5,
	wins: 0,
	score: 0,
	justWon: false,
	justLost: false,
	askedForHint: false,
	winningNumber: 0,
	playersGuess: 105,
	rounds: 0,
	submitScore: function(){
		$("#main-info-text").removeClass("duck-yellow ferrari-red pumpkin emerald");

		if (!GameObject.askedForHint) {
			$("#hint-display").text("You haven't asked for a hint yet")	
		}

		if (GameObject.justLost) {
			$("#main-info-text").text("You already lost! Start a new game!");
		} else if (GameObject.justWon) {
			$("#main-info-text").text("You already won! Reset!");
		} else {
			GameObject.playersGuess = $(".game-ui input").val();
			GameObject.playersGuess = parseInt(GameObject.playersGuess);
			console.log("Player guesses: " + GameObject.playersGuess);
			if (isNaN(GameObject.playersGuess)) {
				//if someone doesn't input any number at all, there should be an error
				$("#main-info-text").addClass("ferrari-red");
				$("#main-info-text").text("Hey! That's not a number!");
			} else if (GameObject.playersGuess > 100) {
				//check if num is greater than 100
				$("#main-info-text").addClass("ferrari-red");
				$("#main-info-text").text("The number can't be greater than 100!");	
			} else if (GameObject.playersGuess < 5) {
				//check if num is less than 5
				$("#main-info-text").addClass("ferrari-red");
				$("#main-info-text").text("The number can't be less than 5!");
			} else if (GameObject.playersGuess % 5 !== 0) {
				//check if number is divisible by 5
				$("#main-info-text").addClass("ferrari-red");
				$("#main-info-text").text("The number must be divisible by 5!");
			} else if (GameObject.numberLog.indexOf(GameObject.playersGuess) !== -1) {
				//if you the user has already guessed a certain number, don't let them guess again
				$("#main-info-text").addClass("ferrari-red");
				$("#main-info-text").text("You already guessed that number! Try again!");
			} else {
				//update stats
				GameObject.numberLog.push(GameObject.playersGuess);
				$("#guess-log").text(GameObject.numberLog.join(", "));
				$("#last-guess").text(GameObject.playersGuess)
				//check the inputed number and see if it matches the winning number	
				if (GameObject.playersGuess === GameObject.winningNumber) {
					//if the player wins
					$("#main-info-text").addClass("emerald");
					$("#main-info-text").text("That's it! You WIN!!!");
					GameObject.guessesRemaining = 0;
					$("#guesses").text(GameObject.guessesRemaining);
					GameObject.justWon = true;
					GameObject.wins++;
					$("#wins").text(GameObject.wins);
					if (GameObject.askedForHint) {
						GameObject.score++;
					} else {
						GameObject.score = GameObject.score + 2;
					}
					$("#score").text(GameObject.score);
				} else {
					//if player's guess is not correct
					GameObject.guessesRemaining--;
					$("#guesses").text(GameObject.guessesRemaining);
					if (GameObject.guessesRemaining === 0) {
						//if the player loses because no guesses left
						$("#main-info-text").addClass("ferrari-red");
						$("#main-info-text").text("YOU LOSE! (The number was " + GameObject.winningNumber + ")");
						GameObject.justLost = true;
					} else {
						//if the player's guess is not correct, but close, give player a hint
						var difference = Math.abs(GameObject.winningNumber - GameObject.playersGuess);

						if (difference <= 10) {
							$("#main-info-text").addClass("duck-yellow");
							$("#main-info-text").text("Close! You're off by 10 or less!");	
						} else {
							$("#main-info-text").addClass("pumpkin");
							$("#main-info-text").text("That wasn't it! Try again!");
						}
					}
				}
				$(".game-ui input").val("");
			}
		}
		$(".game-ui input").focus();
	},
	resetScore: function(){
		//reset all the data
		$("#main-info-text").removeClass("duck-yellow ferrari-red pumpkin emerald");
		$("#hint-display").removeClass("emerald");
		GameObject.numberLog = [];
		GameObject.rounds++;
		GameObject.guessesRemaining = 5;
		GameObject.justWon = false;
		GameObject.justLost = false;
		GameObject.askedForHint = false;
		GameObject.winningNumber = GameObject.generateWinningNumber();
		console.log("new round. New number is:" + GameObject.winningNumber);
		//change the text on the DOM
		$("#last-guess").text("It's a new round!");
		$("#guesses").text(GameObject.guessesRemaining);
		$("#guess-log").text("It's a new round!");
		$("#hint-display").text("It's a new round!");
		$("#main-info-text").text("Alright! A new game! Let do this!");
		$("#rounds").text(GameObject.rounds);
	}
}


GameObject.winningNumber = GameObject.generateWinningNumber();
console.log("The winning number is: " + GameObject.winningNumber);

$("#submit-button").click(function() {
	GameObject.submitScore();
});

$(".game-ui input").keypress(function(event) {
	if (event.which == 13) {
		if (GameObject.justWon || GameObject.justLost) {
    		GameObject.resetScore();   
    	} else {
    		GameObject.submitScore();
    	}
  	}
	
});

$("#hint-button").click(function(){
	$("#main-info-text").removeClass("duck-yellow ferrari-red");	
	if (GameObject.justLost || GameObject.justWon) {
		$("#main-info-text").addClass("ferrari-red");
		$("#main-info-text").text("You can't ask for a reset now!");
	} else if (GameObject.guessesRemaining < 3) {
		$("#main-info-text").addClass("ferrari-red");
		$("#main-info-text").text("You don't have enough guesses left!");
	} else if (GameObject.askedForHint) {
		$("#main-info-text").addClass("ferrari-red");
		$("#main-info-text").text("You already got a hint! Greedy!");
	} else {
		$("#main-info-text").text("Okay... there's your hint!");
		GameObject.numberLog.push("Hint");
		GameObject.guessesRemaining = GameObject.guessesRemaining - 2;
		GameObject.askedForHint = true;
		$("#guesses").text(GameObject.guessesRemaining);
		//give the hint
		if (GameObject.winningNumber > 50) {
			$("#hint-display").addClass("emerald");
			$("#hint-display").text("The number is greater than 50");
		} else {
			$("#hint-display").addClass("emerald");
			$("#hint-display").text("The number is less than 55");
		}
	}
})

$("#reset-button").click(function(){
	GameObject.resetScore();
});

