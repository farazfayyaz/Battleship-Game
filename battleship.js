//visual object

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}


var ships = [
    {
        locations: ["10", "20", "30"],
        hits: ["", "", ""]
    },
    {
        locations: ["32", "33", "34"],
        hits: ["", "", ""]
    },
    {
        locations: ["63", "64", "65"],
        hits: ["", "", ""]
    }
]

//Model object

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },

        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },

        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        }
    ],

    //Function checks guess by iterating through each position of the ships in the object
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess); //for each ships - if the guess is in the locations array, we have a hit
            if (index >= 0) {
                ship.hits[index] = "hit"; //mark the hits array at the same index
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipSunk++;
                }
                return true; //return true when there is a hit
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false; //if there is not hit, then there is a miss
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) { //takes ship and checks possible location for hit
            if (ship.hits[i] !== "hit") {
                return false; //no hit = returns false
            }
        }
        return true; //otherwise ship is sunk = returns true
    },

    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip(); //generate new ships
            } while (this.collision(locations)); //if ships collide, new ship is generated until no collision

            this.ships[i].locations = locations; //assigns locations to property in model.ships array
        }
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            //if direction is 1
            //generate starting location for horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            //if direction is 0
            //generate starting location for vertical ship
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                //add location to array for new horizontal ship
                newShipLocations.push(row + "" + (col + i));
            } else {
                //add location to array for new vertical ship
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

// Controller object

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++; //valid guess, increase number by 1 (wrong answers do not get counted)
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
            }
        }
    }
};

function parseGuess (guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"]; //helper array


    if (guess === null || guess.length !== 2) { //checks for a null or guess that is only 2 characters
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        var firstChar = guess.charAt(0);//grab first character of guess
        var row = alphabet.indexOf(firstChar);//checks first character to letter in the Helper Array
        var col = guess.charAt(1);//gra thhe second character of the guess

        if (isNaN(row) || isNaN(col)) { //if any part of guess is not a number
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || 
                   col < 0 || col >= model.boardSize) { //if guess is not within the board
            alert("Oops, that's off the board!"); 
        } else {
            return row + col; //if all checks pass, return the value
        }
    }
    return null; //if any check fails, return null
}

function handleKeyPress (e) { //key press handler
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) { //when enter is hit, property would be 13, so we trick code to press button when enter is hit
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput"); //reference to input form
    var guess = guessInput.value;
    controller.processGuess(guess); //passing player's guess to the controller

    guessInput.value = ""; //resets the form to be empty after a guess attempt
}

window.onload = init; //will run when page is fully loaded

function init() {
    // Fire! button handler
    var fireButton = document.getElementById("fireButton"); //reference to Fire! button
    fireButton.onclick = handleFireButton; //click handler for the button = runs function action

    // Return key handler
    var guessInput = document.getElementById("guessInput"); //new handler = key press events
    guessInput.onkeypress = handleKeyPress

    model.generateShipLocations();
}