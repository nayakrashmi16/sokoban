/*
    Sokoban

    - Rashmi Pramod Nayak
 */

/*
    CONSTANTS
 */

/*
    JavaScript Object that contains array representation of all levels
 */
const levels = {
    "1": [
        ['#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', '@', ' ', '$', ' ', ' ', ' ', '#'],
        ['#', ' ', ' ', ' ', '$', ' ', ' ', '#'],
        ['#', ' ', '.', ' ', '.', ' ', ' ', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    "2": [
        [' ', ' ', '#', '#', '#', '#', '#', ' '],
        ['#', '#', '#', ' ', ' ', ' ', '#', ' '],
        ['#', ' ', '$', ' ', '#', ' ', '#', '#'],
        ['#', ' ', '#', ' ', ' ', '.', ' ', '#'],
        ['#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
        ['#', '#', ' ', '#', ' ', ' ', ' ', '#'],
        [' ', '#', '@', ' ', ' ', '#', '#', '#'],
        [' ', '#', '#', '#', '#', '#', ' ', ' ']
    ],
    "3": [
        [' ', ' ', ' ', ' ', '#', '#', '#', '#'],
        ['#', '#', '#', '#', '#', ' ', ' ', '#'],
        ['#', ' ', ' ', ' ', '$', ' ', ' ', '#'],
        ['#', ' ', ' ', '.', '#', ' ', ' ', '#'],
        ['#', '#', ' ', '#', '#', ' ', '#', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '@', '#', ' ', ' ', ' ', '#'],
        ['#', ' ', ' ', '#', '#', '#', '#', '#'],
        ['#', '#', '#', '#', ' ', ' ', ' ', ' ']
    ],
    "4": [
        [' ', ' ', ' ', ' ', '#', '#', '#', '#', ' '],
        [' ', '#', '#', '#', '#', ' ', ' ', '#', ' '],
        ['#', '#', ' ', '$', ' ', ' ', ' ', '#', ' '],
        ['#', ' ', ' ', '#', ' ', '#', '$', '#', ' '],
        ['#', '.', '@', '.', ' ', ' ', ' ', '#', '#'],
        ['#', '#', ' ', '#', ' ', '#', ' ', ' ', '#'],
        [' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        [' ', '#', ' ', ' ', '#', '#', '#', '#', '#'],
        [' ', '#', '#', '#', '#', ' ', ' ', ' ', ' ']
    ],
    "5" : [
        [' ', ' ', ' ', ' ', '#', '#', '#', '#', ' '],
        [' ', '#', '#', '#', '#', ' ', ' ', '#', ' '],
        ['#', '#', ' ', '$', ' ', ' ', ' ', '#', ' '],
        ['#', ' ', ' ', '#', ' ', '#', '$', '#', ' '],
        ['#', '.', '@', '.', ' ', ' ', ' ', '#', '#'],
        ['#', '#', ' ', '#', ' ', '#', ' ', ' ', '#'],
        [' ', '#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        [' ', '#', ' ', ' ', '#', '#', '#', '#', '#'],
        [' ', '#', '#', '#', '#', ' ', ' ', ' ', ' ']
    ]
};

/*
    Constants to store the representation of various elements on the
    Sokoban board - Wall, Floor, Box, GoalSquare, Player etc.
 */
const WALL = '#';
const FLOOR = ' ';
const BOX = '$';
const BOX_IN_GOAL_SQUARE = '*';
const GOAL_SQUARE = '.';
const PLAYER = '@';
const PLAYER_ON_GOAL_SQUARE = '+';

/*
    Constants to store the representation of the directions in which
    a player/box can be moved
 */
const TOP = "top";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";


/*
    UTILITY VARIABLES
 */

/*
    2-Dimensional Array that stores the array representation of the
    level being played
 */
let levelMap;

/*
    2-Dimensional Array that stores the current state of the level
    being played
 */
let currentLevelMap;

/*
    Variable to store the length of the longest row in the Sokoban
    level
 */
let maxLength = 0;

/*
    Variable to store the level value. Initially set to 1
 */
let currentLevel;

/*
    Variable to store the total number of moves made by player
    each level
 */
let moves;

/*
    Variable to store and check if level is completed
 */
let isLevelComplete;


/*
    GAME LEVEL FUNCTIONS
 */

/*
    Function that starts the Sokoban Game, game can be started from
    level 1, or any level that the player desires. Level number is
    passed as Query Param
 */
function startGame() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let levelParam = Number(params.level);
    if (levelParam !== undefined && !isNaN(levelParam) && levelParam <= Object.keys(levels).length && levelParam > 0) {
        currentLevel = levelParam;
        startLevel(levelParam);
    } else {
        currentLevel = 1;
        startLevel(1);
    }
}

/*
    Function that starts a particular level by loading the map
    for the level
 */
function startLevel(level) {
    let map = levels[level];
    setUtilityVariables(map);
    renderMapOnDOM();
}

/*
    Function that starts a level that is either greater, lesser or
    equal to current level
 */
function playLevel(displacement) {
    currentLevel += displacement;
    startLevel(currentLevel);
}

/*
    Function that sets the values for all utility variables
    used by the Sokoban game
 */
function setUtilityVariables(map) {
    levelMap = map;
    currentLevelMap = levelMap.map((arr) => {
        return arr.slice();
    });
    moves = 0;
    isLevelComplete = false;
    maxLength = findMaxLengthOfMapRows(map);
}

/*
    Function that calculates the maximum length of a row in
    map to allow for determination of game canvas width
 */
function findMaxLengthOfMapRows(map) {
    let maximumLength = map[0].length;

    for (let index = 0; index < map.length; index++) {
        if (maximumLength < map[index].length) {
            maximumLength = map[index].length;
        }
    }
    return maximumLength;
}

/*
    DOM UPDATE FUNCTIONS
 */

/*
    Function to update the number of moves displayed on
    the DOM
 */
function updateMovesOnDOM() {
    let movesEle = document.getElementsByClassName("moves")[0];
    movesEle.innerHTML = moves;
}

/*
    Function to update the level number displayed on
    the DOM
 */
function updateLevelOnDOM() {
    let levelNumberEle = document.getElementsByClassName("level-number")[0];
    levelNumberEle.innerHTML = currentLevel;
}

/*
    Function that renders the elements of Sokoban on to 
    the DOM - Player, Walls, Floor, Boxes and Goal Square
 */
function renderMapOnDOM() {
    hideModal();
    updateLevelOnDOM();
    updateMovesOnDOM();

    let sokobanCanvasEle = document.getElementsByClassName("sokoban-canvas")[0];
    sokobanCanvasEle.style.width = (maxLength * 80) + "px";
    sokobanCanvasEle.innerHTML = "";

    for (let iIndex = 0; iIndex < currentLevelMap.length; iIndex++) {
        for (let jIndex = 0; jIndex < currentLevelMap[iIndex].length; jIndex++) {

            let divEle = document.createElement("div");
            divEle.classList.add("sokoban-element");
            let imgEle = document.createElement("img");
            imgEle.classList.add("sokoban-element-img");
            divEle.appendChild(imgEle);

            if (currentLevelMap[iIndex][jIndex] === '#') {
                imgEle.src = "resources/wall.png";
            } else if (currentLevelMap[iIndex][jIndex] === '$') {
                imgEle.src = "resources/box.png";
            } else if (currentLevelMap[iIndex][jIndex] === '@' || currentLevelMap[iIndex][jIndex] === '+') {
                imgEle.src = "resources/player.png";
            } else if (currentLevelMap[iIndex][jIndex] === '.') {
                imgEle.src = "resources/goal-square.png";
            } else if (currentLevelMap[iIndex][jIndex] === '*') {
                imgEle.src = "resources/success-box.png";
            }
            sokobanCanvasEle.appendChild(divEle);

        }
    }
}

/*
    Function that hides the previous or next level button depending
    on which level the player is playing
 */
function showRelevantLevelOptions() {
    let previousLevelElement = document.getElementById("previous-level");
    let nextLevelElement = document.getElementById("next-level");
    if (currentLevel === 1) {
        previousLevelElement.classList.add("display-none");
    } else if (currentLevel === Object.keys(levels).length) {
        nextLevelElement.classList.add("display-none");
    } else {
        previousLevelElement.classList.remove("display-none");
        nextLevelElement.classList.remove("display-none");
    }
}

/*
    Function that generates navigational buttons for each level in the
    Levels Modal on the HomePage
 */
function generateLevelButtons() {
    let levelsContainerEle = document.getElementById("levels-container");
    for (let iIndex = 0; iIndex < Object.keys(levels).length; iIndex++) {
        let buttonEle = document.createElement("a");
        buttonEle.href = "sokoban.html?level=" + (iIndex + 1);
        buttonEle.classList.add("levels-btn");
        buttonEle.innerHTML = "Level " + (iIndex + 1);
        levelsContainerEle.appendChild(buttonEle);
    }
}

/*
    EVENT LISTENER FUNCTIONS
 */

/*
    Function to add an event listener that detects key presses to
    allow player to use the arrow keys
 */
function addEventListenerForKeyPress() {
    document.addEventListener('keydown', (event) => getKeyPressDirectionAndPosition(event));
}

/*
    Function to check which key was pressed and detect current position
    and call the checkPlayerMovementAndMove function
 */
function getKeyPressDirectionAndPosition(event) {

    let position = getPlayerCoordinates();
    let adjacentPositionElements = getPlayerAdjacentPositionElements(position);

    if (!isLevelComplete) {
        if (event.keyCode === 37) {
            checkPlayerMovementAndMove(position, adjacentPositionElements, LEFT);
        } else if (event.keyCode === 38) {
            checkPlayerMovementAndMove(position, adjacentPositionElements, TOP);
        } else if (event.keyCode === 39) {
            checkPlayerMovementAndMove(position, adjacentPositionElements, RIGHT);
        } else if (event.keyCode === 40) {
            checkPlayerMovementAndMove(position, adjacentPositionElements, DOWN);
        }
    }
}


/*
    COORDINATE FUNCTIONS
 */

/*
    Function that finds the players current coordinates
 */
function getPlayerCoordinates() {
    let x = currentLevelMap.findIndex(row => (row.includes(PLAYER) || row.includes(PLAYER_ON_GOAL_SQUARE)));
    let y = (currentLevelMap[x].indexOf(PLAYER)) === -1 ? currentLevelMap[x].indexOf(PLAYER_ON_GOAL_SQUARE) : currentLevelMap[x].indexOf(PLAYER);
    let position = {
        "x": x,
        "y": y
    }
    return position;
}


/*
    Function that finds the elements that are adjacent to the players
    current position
 */
function getPlayerAdjacentPositionElements(position) {
    let adjacentPositionsElements = {
        "top": currentLevelMap[position.x - 1][position.y],
        "down": currentLevelMap[position.x + 1][position.y],
        "left": currentLevelMap[position.x][position.y - 1],
        "right": currentLevelMap[position.x][position.y + 1],
    }
    return adjacentPositionsElements;
}

/*
    Function to get the Coordinates that is 'X' number of steps
    from a particular position in particular direction
 */
function getCoordinates(position, direction, steps) {
    if (direction === TOP) {
        return {
            "x": position.x - steps,
            "y": position.y
        }
    } else if (direction === DOWN) {
        return {
            "x": position.x + steps,
            "y": position.y
        }
    } else if (direction === LEFT) {
        return {
            "x": position.x,
            "y": position.y - steps
        }
    } else if (direction === RIGHT) {
        return {
            "x": position.x,
            "y": position.y + steps
        }
    }
}

/*
    MOVEMENT FUNCTIONS
 */

/*
    Function that checks if movement in a particular direction from
    Player's current position is possible by checking the adjacent position
    elements
 */
function checkPlayerMovementAndMove(position, adjacentPositions, direction) {
    //Check if position is traversable
    if (isTraversable(adjacentPositions[direction])) {
        movePlayer(position, direction, adjacentPositions);
    }

    //Check if position contains a Box
    if (isBox(adjacentPositions[direction]) || isBoxInGoalSquare(adjacentPositions[direction])) {
        moveBoxWithPlayer(position, direction);
    }


}

/*
    Function that moves the player in a particular direction from
    the Player's current position
 */
function movePlayer(position, direction) {
    //Increment no.of moves and update the DOM
    moves++;
    updateMovesOnDOM();

    let lastMapPosition;

    //Check if position that Player is currently on was a Goal Square or Floor
    if (isGoalSquare(levelMap[position.x][position.y]) || isBoxInGoalSquare(levelMap[position.x][position.y])) {
        lastMapPosition = GOAL_SQUARE;
    } else {
        lastMapPosition = FLOOR;
    }
    currentLevelMap[position.x][position.y] = lastMapPosition;
    let newCoordinates = getCoordinates(position, direction, 1);

    //Check if new position is going to be a Goal Square or Floor
    if (currentLevelMap[newCoordinates.x][newCoordinates.y] === GOAL_SQUARE || currentLevelMap[newCoordinates.x][newCoordinates.y] === BOX_IN_GOAL_SQUARE) {
        currentLevelMap[newCoordinates.x][newCoordinates.y] = PLAYER_ON_GOAL_SQUARE;
    } else {
        currentLevelMap[newCoordinates.x][newCoordinates.y] = PLAYER;
    }

    //Re-render the DOM
    renderMapOnDOM();
}

/*
    Function that allows Player to push the box in a particular
    direction and also moves the player
 */
function moveBoxWithPlayer(position, direction) {
    let boxNextPosition = getCoordinates(position, direction, 2);

    // Check if the next position in the direction is traversable
    if (isTraversable(currentLevelMap[boxNextPosition.x][boxNextPosition.y])) {

        //If traversable, check if box is being pushed 
        if (isGoalSquare(currentLevelMap[boxNextPosition.x][boxNextPosition.y])) {
            currentLevelMap[boxNextPosition.x][boxNextPosition.y] = BOX_IN_GOAL_SQUARE;
        } else {
            currentLevelMap[boxNextPosition.x][boxNextPosition.y] = BOX;
        }
        //Call movePlayer function to move the player
        movePlayer(position, direction);

        //Check if level is completed and display modal
        isLevelComplete = isWin();
        if (isLevelComplete) {
            showModal();
            showRelevantLevelOptions();
        }
    }
}

/*
    UTILITY FUNCTIONS
 */

/*
    Function that checks if player has won current level by checking
    if all goal squares have been filled by the boxes
 */
function isWin() {
    let totalGoalSquares = currentLevelMap.filter((row) => row.some((element) => element === GOAL_SQUARE || element === PLAYER_ON_GOAL_SQUARE));
    return (totalGoalSquares.length === 0);
}

/*
    Function that checks if a position is traversable or not
 */
function isTraversable(position) {
    return (position === FLOOR || position === GOAL_SQUARE);
}

/*
    Function that checks if there is a box present on the position
 */
function isBox(position) {
    return (position === BOX);
}

/*
    Function that checks if there player is present on the position
 */
function isPlayer(position) {
    return (position === PLAYER);
}

/*
    Function that checks if there is a wall present on the position
 */
function isWall(position) {
    return (position === WALL);
}

/*
    Function that checks if there is a box on goal square present on the position
 */
function isBoxInGoalSquare(position) {
    return (position === BOX_IN_GOAL_SQUARE);
}

/*
    Function that checks if there is a goal square present on the position
 */
function isGoalSquare(position) {
    return (position === GOAL_SQUARE);
}


/*
    MODAL FUNCTIONS
 */

/*
    Function that is used to display a modal with actions for
    the player to take (Choosing Level, Proceeding to next level etc)
 */
function showModal() {
    let modalEle = document.getElementsByClassName("modal")[0];
    modalEle.classList.add("visible");
}

/*
    Function that is used to hide a modal with actions for
    the player to take (Choosing Level, Proceeding to next level etc)
 */
function hideModal() {
    let modalEle = document.getElementsByClassName("modal")[0];
    modalEle.classList.remove("visible");
}


/*
    Calling the startGame function to start the Sokoban game
 */
startGame();

