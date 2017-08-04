/**
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 * mainEngine.js
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 *
 *  Created by lbaow on 5/31/2017.
 *
 *  mainEngine defines the primary controller that includes timing events and command execution queuing.
 *
 **/


/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * Beginning of global variable declaration block
 ****************************************************************
 ****************************************************************
 ================================================================
 */



/*
 ****************************************************************
 * Variables controlling the timing of the heartbeat check
 ****************************************************************
 */

/*
 * Interval to perform the fastest animation checks allowed in milliseconds
 * INTERVAL_FAST_ANIM must always be the smallest value of these.
 *
 * In addition, to work properly, all other intervals should be
 * divisable by INTERVAL_FAST_ANIM. For instance if this value
 * is 50 then other values could be 100, 200, 250.
 * ------------------
 * Example use for this might be weapons that a player has to dodge during an action/cutscene.
 */
var INTERVAL_FAST_ANIM = 50;

/*
 * Interval to perform the command checks in milliseconds
 *
 * This controls how fast the player command queue will be checked, to allow multiple commands
 * to be entered at the same time then executed sequentially.
 */
var INTERVAL_COMMAND_CHECK = 100;

/*
 * Interval to perform the normal animation checks allowed in milliseconds
 * ------------------
 * Example use for this can be fast moving creatures that are a challenge for a player to catch/avoid on
 * the game map.
 */
var INTERVAL_NORMAL_ANIM = 2000;

/*
 * Interval to perform the slow animation checks allowed in milliseconds
 * ------------------
 * Example use for this can be town NPCs.
 */
var INTERVAL_SLOW_ANIM = 4000;

/*
 * Interval to perform the slowest animation checks allowed in milliseconds
 * ------------------
 * Example use is processor intensive events such as environmental affects that do not
 * need to react immediately to player movement or controls.
 * A moving quest NPC would also be best performed at this time interval
 */
var INTERVAL_SLOWEST_ANIM = 8000;
/*
 ****************************************************************
 */



// Heartbeat is set to the fastest possible interval permitted by this engine
var heartbeatPulse = setInterval(checkHeartbeat, INTERVAL_FAST_ANIM);
var hbCounter = 0; // Initialize the heartbeat counter.
var commandList = [null, null, null, null, null, null, null, null];

/* **DO NOT REMOVE**
 * Performs a one time configuration check to make sure above values
 * are properly configured
 */
var checkEngineConfig = setTimeout(checkConfigurations, 5);

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of all global variables -- Functions defined below this line
 ****************************************************************
 ****************************************************************
 ================================================================
 */


function checkConfigurations() {
    /* Integrity checks on all global variables above to make sure this engine is not
     * mis configured. Any errors will result in a console.log event and the setInterval
     * being aborted.
     */
    var errorFlag = false;

    console.log("Performing engine integrity checks.")

    if ((INTERVAL_FAST_ANIM > INTERVAL_COMMAND_CHECK) ||
        (INTERVAL_FAST_ANIM > INTERVAL_NORMAL_ANIM) ||
        (INTERVAL_FAST_ANIM > INTERVAL_SLOW_ANIM) ||
        (INTERVAL_FAST_ANIM > INTERVAL_SLOWEST_ANIM) ) {
        console.log("ERROR: INTERVAL_FAST_ANIM must be smaller than all other interval values.");
        errorFlag = true;
    }

    if (INTERVAL_COMMAND_CHECK % INTERVAL_FAST_ANIM > 0) {
        console.log("ERROR: INTERVAL_COMMAND_CHECK must be a multiple of INTERVAL_FAST_ANIM.");
        errorFlag = true;
    }

    if (INTERVAL_NORMAL_ANIM % INTERVAL_FAST_ANIM > 0) {
        console.log("ERROR: INTERVAL_NORMAL_ANIM must be a multiple of INTERVAL_FAST_ANIM.");
        errorFlag = true;
    }

    if (INTERVAL_SLOW_ANIM % INTERVAL_FAST_ANIM > 0) {
        console.log("ERROR: INTERVAL_SLOW_ANIM must be a multiple of INTERVAL_FAST_ANIM.");
        errorFlag = true;
    }

    if (INTERVAL_SLOWEST_ANIM % INTERVAL_FAST_ANIM > 0) {
        console.log("ERROR: INTERVAL_SLOWEST_ANIM must be a multiple of INTERVAL_FAST_ANIM.");
        errorFlag = true;
    }

    if (errorFlag) {
        console.log("Configuration errors found in mainEngine.js ; Aborting...");
        clearTimeout(heartbeatPulse);
        return;
    } else {
        console.log("Integrity checks passed. Starting engine.");
    }

    initializeCommands();
}

function checkHeartbeat() {
    if (hbCounter % INTERVAL_COMMAND_CHECK == 0) {
        performHeartbeatCommandCheck();
    }

    // Perform fast heartbeat execution
    performHeartbeatFast();

    if (hbCounter % INTERVAL_NORMAL_ANIM == 0) {
        performHeartbeatNormal();
    }

    if (hbCounter % INTERVAL_SLOW_ANIM == 0) {
        performHeartbeatSlow();
    }

    if (hbCounter % INTERVAL_SLOWEST_ANIM == 0) {
        performHeartbeatSlowest();
    }
    // sendToHTML("demo", hbCounter, null);
    hbCounter += INTERVAL_FAST_ANIM;
}

function performHeartbeatFast() {
    // Perform fast animation events at the interval defined above
}

function performHeartbeatCommandCheck() {
    // Check for player commands checked at the interval defined in the global variables
}

function performHeartbeatNormal() {
    // Perform normal animation events at the interval defined above
    if (player.fighting != null) {
        process_battle_round();
    }
}

function performHeartbeatSlow() {
    // Perform slow animation events at the interval defined above
}

function performHeartbeatSlowest() {
    // Perform slowest animation events at the interval defined above
}

function doCommandChoice(choiceNumber) {
    //sendToHTML("demo", "Command " + choiceNumber + " has been selected.", "blue");
    commandList[choiceNumber]();
}

function initializeCommands() {
    assignCommand(0, CommandLook, "Look");
    assignCommand(1, CommandMoveNorth, "North");
    assignCommand(2, CommandMoveEast, "East");
    assignCommand(3, CommandMoveSouth, "South");
    assignCommand(4, CommandMoveWest, "West");
    assignCommand(5, CommandMoveUp, "Up");
    assignCommand(6, CommandMoveDown, "Down");
    assignCommand(7, CommandInventory, "Inventory");
}

function assignCommand(commandNumber, functionName, functionDescription) {
    var parsedName = "cmd" + commandNumber;

    /* Assign the function to the command list on the appropriate index */
    commandList[commandNumber] = functionName;

    /* And change the HTML element to the descriptive name */
    document.getElementById(parsedName).innerHTML = functionDescription;
}

function CommandLook() {
    sendToHTML("demo","Call to: processCommandLook","blue")
}

function CommandMoveNorth() {
    player = doMove(player, DIRECTION_NORTH);
}

function CommandMoveEast() {
    player = doMove(player, DIRECTION_EAST);
}

function CommandMoveSouth() {
    player = doMove(player, DIRECTION_SOUTH);
}

function CommandMoveWest() {
    player = doMove(player, DIRECTION_WEST);
}

function CommandMoveUp() {
    player = doMove(player, DIRECTION_UP);
}

function CommandMoveDown() {
    player = doMove(player, DIRECTION_DOWN);
}


/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of functions
 ****************************************************************
 ****************************************************************
 ================================================================
 */


/*
 ================================================================
 ================================================================
 ================================================================
 * Code snippets for using this in an HTML page
 ================================================================
 ================================================================
 ================================================================

 :::display Current count:::
 <p id="demo"></p>
 sendToHTML("demo", "Counter = " + hbCounter, null);

 ================================================================
 ================================================================
 ================================================================
 */



/**
 * CODE EXPORTS BEING SENT TO THE NAMED EXTERNAL JAVASCRIPT FILES
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ************************************************************************************
 * ************************************************************************************
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ====================================================================================
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 **/

/**
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 * dataTypes.js
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 *  Created by lbaow on 6/2/2017.
 *
 *  Most data structures (objects) which are used by multiple JS files will be defined here.
 *  Constants will also be declared here.
 *
 **/

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * Beginning of global variable declaration block
 ****************************************************************
 ****************************************************************
 ================================================================
 */
var NUMBER_OF_PAGELINKS     = 8;


var STARTING_HIT_POINTS     = 20;
var STARTING_MANA_POINTS    = 10;
var STARTING_STAMINA_POINTS = 10;


// ******************************************************
// Bitwise presets for CONDITION
var CONDITION_DISEASED    = 1 <<  0;
var CONDITION_POISONED    = 1 <<  1;
var CONDITION_PARALYZED   = 1 <<  2;
var CONDITION_CONFUSED    = 1 <<  3;
var CONDITION_SLEEPING    = 1 <<  4;
var CONDITION_UNCONSCIOUS = 1 <<  5;
var CONDITION_BURNING     = 1 <<  6;
var CONDITION_ENLARGED    = 1 <<  7;
var CONDITION_SHRUNKEN    = 1 <<  8;
var CONDITION_UNUSED09    = 1 <<  9;
var CONDITION_UNUSED10    = 1 << 10;
var CONDITION_UNUSED11    = 1 << 11;
var CONDITION_UNUSED12    = 1 << 12;
var CONDITION_UNUSED13    = 1 << 13;
var CONDITION_UNUSED14    = 1 << 14;
var CONDITION_UNUSED15    = 1 << 15;
var CONDITION_UNUSED16    = 1 << 16;
var CONDITION_UNUSED17    = 1 << 17;
var CONDITION_UNUSED18    = 1 << 18;
var CONDITION_UNUSED19    = 1 << 19;
var CONDITION_UNUSED20    = 1 << 20;
var CONDITION_UNUSED21    = 1 << 21;
var CONDITION_UNUSED22    = 1 << 22;
var CONDITION_UNUSED23    = 1 << 23;
var CONDITION_UNUSED24    = 1 << 24;
var CONDITION_UNUSED25    = 1 << 25;
var CONDITION_UNUSED26    = 1 << 26;
var CONDITION_GRAPPLED    = 1 << 27;
var CONDITION_SWALLOWED   = 1 << 28;
var CONDITION_DEAD        = 1 << 29;
var CONDITION_DIGESTED    = 1 << 30;
var CONDITION_SOULDEAD    = 1 << 31;
// ******************************************************
// ******************************************************

/*
 ****************************************************************
 */


// ====================================================================================================
// NEW BITVECTOR TEMPLATE
/* ====================================================================================================
 * This template may be used for additional bitvectors that need added.
 * Simply rename NEWBITVECTOR to some other property name, then rename then UNUSED values to represent
 * the value(s) being changed.
 *
 * WARNING: Due to the 32 bit bitwise limitation do not add any new values past bit 1 << 31
 */
// ******************************************************
// ******************************************************
// Bitwise presets for NEWBITVECTOR
var NEWBITVECTOR_UNUSED00 = 1 <<  0;
var NEWBITVECTOR_UNUSED01 = 1 <<  1;
var NEWBITVECTOR_UNUSED02 = 1 <<  2;
var NEWBITVECTOR_UNUSED03 = 1 <<  3;
var NEWBITVECTOR_UNUSED04 = 1 <<  4;
var NEWBITVECTOR_UNUSED05 = 1 <<  5;
var NEWBITVECTOR_UNUSED06 = 1 <<  6;
var NEWBITVECTOR_UNUSED07 = 1 <<  7;
var NEWBITVECTOR_UNUSED08 = 1 <<  8;
var NEWBITVECTOR_UNUSED09 = 1 <<  9;
var NEWBITVECTOR_UNUSED10 = 1 << 10;
var NEWBITVECTOR_UNUSED11 = 1 << 11;
var NEWBITVECTOR_UNUSED12 = 1 << 12;
var NEWBITVECTOR_UNUSED13 = 1 << 13;
var NEWBITVECTOR_UNUSED14 = 1 << 14;
var NEWBITVECTOR_UNUSED15 = 1 << 15;
var NEWBITVECTOR_UNUSED16 = 1 << 16;
var NEWBITVECTOR_UNUSED17 = 1 << 17;
var NEWBITVECTOR_UNUSED18 = 1 << 18;
var NEWBITVECTOR_UNUSED19 = 1 << 19;
var NEWBITVECTOR_UNUSED20 = 1 << 20;
var NEWBITVECTOR_UNUSED21 = 1 << 21;
var NEWBITVECTOR_UNUSED22 = 1 << 22;
var NEWBITVECTOR_UNUSED23 = 1 << 23;
var NEWBITVECTOR_UNUSED24 = 1 << 24;
var NEWBITVECTOR_UNUSED25 = 1 << 25;
var NEWBITVECTOR_UNUSED26 = 1 << 26;
var NEWBITVECTOR_UNUSED27 = 1 << 27;
var NEWBITVECTOR_UNUSED28 = 1 << 28;
var NEWBITVECTOR_UNUSED29 = 1 << 29;
var NEWBITVECTOR_UNUSED30 = 1 << 30;
var NEWBITVECTOR_UNUSED31 = 1 << 31;

// ====================================================================================================
// ====================================================================================================


// ****************************************************************************************************
// ====================================================================================================
// ====================================================================================================
// Beginning of object declarations
// ====================================================================================================
// ====================================================================================================
// ****************************************************************************************************



// ====================================================================================================
// Player specific related objects
// ====================================================================================================
var player = {
    outputNode: null,
    name:"",
    curHitPoints:STARTING_HIT_POINTS,
    maxHitPoints:STARTING_HIT_POINTS,
    curManaPoints:STARTING_MANA_POINTS,
    maxManaPoints:STARTING_MANA_POINTS,
    curStaminaPoints:STARTING_STAMINA_POINTS,
    maxStaminaPoints:STARTING_STAMINA_POINTS,
    conditionFlags:0,
    position:[0, 0, 0],
    fighing:null
};


// ===================================================================================================
// Mobile (player or NPC) related objects
// ====================================================================================================



// ====================================================================================================
// Room (world) related objects
// ====================================================================================================



// ====================================================================================================
// Item related objects
// ====================================================================================================



// ****************************************************************************************************
// ====================================================================================================
// ====================================================================================================
// End of object declarations
// ====================================================================================================
// ====================================================================================================
// ****************************************************************************************************


/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of all global variables -- Functions defined below this line
 ****************************************************************
 ****************************************************************
 ================================================================
 */

/*
 * The setBit, removeBit & checkBit functions are designed to use bitwise
 * math and comparisons to add, remove or check for the bit on the bitvector.
 *
 * Example uses:
 * conditionFlags = setBit(conditionFlags, CONDITION_POISONED);
 *
 * if (checkBit(conditionFlags, CONDITION_DISEASED))
 *
 */
function setBit(bitvector, bit) {
    // Make sure this bit isn't already set. Otherwise, ignore this.
    if (!checkBit(bitvector, bit)) {
        bitvector = bitvector + bit;
    }

    // Return the new value whether or not a bit was modified above
    return bitvector;
}

function removeBit(bitvector, bit) {
    // Make sure this bit isn't already cleared. Otherwise, ignore this
    if (checkBit(bitvector, bit)) {
        bitvector = bitvector - bit;
    }

    // Return the new value whether or not a bit was modified above
    return bitvector;
}

function checkBit(bitvector, bit) {
    if (bitvector & bit) {
        return true;
    } else {
        return false;
    }
}


/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of functions
 ****************************************************************
 ****************************************************************
 ================================================================
 */


/*
 ================================================================
 ================================================================
 ================================================================
 * Code snippets for using this in an HTML page
 ================================================================
 ================================================================
 ================================================================



 ================================================================
 ================================================================
 ================================================================
 */



/**
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 * mainMapper.js
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 *  Created by lbaow on 6/1/2017.
 *
 *  Duplicates of this JScript file may be made for smaller maps. This one controls the navigation for the
 *  game maps if there is only one map in the game, and for the overworld map if there is more than one map in
 *  the game.
 **/

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * Beginning of global variable declaration block
 ****************************************************************
 ****************************************************************
 ================================================================
 */
var mainCoordinates = [{longitude:0, latitude:0, altitude:0}];

var curPosition = mainCoordinates[0].longitude;
/*
 * Variables controlling the size of map and starting position
 * Alternatively the starting position may be over-ridden by a call to
 * placePlayer from the calling HTML page.
 ********************************************************************
 */



/*
 ****************************************************************
 ****************************************************************
 */

/* Directional constants used by mainMapper */
var DIRECTION_NORTH = 1;
var DIRECTION_EAST = 2;
var DIRECTION_SOUTH = 3;
var DIRECTION_WEST = 4;
var DIRECTION_NORTHEAST = 5;
var DIRECTION_SOUTHEAST = 6;
var DIRECTION_SOUTHWEST = 7;
var DIRECTION_NORTHWEST = 8;
var DIRECTION_UP = 9;
var DIRECTION_DOWN = 10;

var MAP_X = 0;
var MAP_Y = 1;
var MAP_Z = 2;

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of all global variables -- Functions defined below this line
 ****************************************************************
 ****************************************************************
 ================================================================
 */

/*
 * function doMove
 * This function may potentially be called by creatures other than the player
 * to process a movement on the map.
 */
function doMove(moveChar, direction) {
    var changeX = 0, changeY = 0, changeZ = 0;
    var validMovement = true;

    switch (direction) {
        case DIRECTION_NORTH:
            changeY = 1;
            break;
        case DIRECTION_EAST:
            changeX = 1;
            break;
        case DIRECTION_SOUTH:
            changeY = -1;
            break;
        case DIRECTION_WEST:
            changeX = -1;
            break;
        case DIRECTION_NORTHEAST:
            changeX = 1;
            changeY = 1;
            break;
        case DIRECTION_SOUTHEAST:
            changeX = 1;
            changeY = -1;
            break;
        case DIRECTION_SOUTHWEST:
            changeX = -1;
            changeY = -1;
            break;
        case DIRECTION_NORTHWEST:
            changeX = -1;
            changeY = 1;
            break;
        case DIRECTION_UP:
            changeZ = 1;
            break;
        case DIRECTION_DOWN:
            changeZ = -1;
            break;
        default:
            sendToHTML("demo", "Direction: " + direction + " passed to doMove and needs assignment.", "orange");
            validMovement = false;
            break;
    }

    /* Check that the player is standing & not in combat. */
    if (moveChar.fighting != null) {
        sendToHTML("demo", "In the middle of combat?", "orange");
        validMovement = false;
    }

    /* Check various conditions for conditions that might prevent movement */
    if (checkBit(moveChar.conditionFlags, CONDITION_PARALYZED)) {
        sendToHTML("demo", "Try as you might, you can't move a muscle.", "red");
        validMovement = false;
    }
    if (checkBit(moveChar.conditionFlags, CONDITION_SLEEPING)) {
        sendToHTML("demo", "Sleepwalking? Very funny, but try waking up first.", "red");
        validMovement = false;
    }
    if (checkBit(moveChar.conditionFlags, CONDITION_UNCONSCIOUS)) {
        sendToHTML("demo", "You are in no state to do that.", "red");
        validMovement = false;
    }
    if (checkBit(moveChar.conditionFlags, CONDITION_DEAD)) {
        sendToHTML("demo", "Spiritwalking may work in some cultures, but.... NO.", "red");
        validMovement = false;
    }
    if (checkBit(moveChar.conditionFlags, CONDITION_SOULDEAD)) {
        sendToHTML("demo", "Your soul is no longer your own.", "red");;
        validMovement = false;
    }
    if (checkBit(moveChar.conditionFlags, CONDITION_GRAPPLED)) {
        sendToHTML("demo", "You are a bit pinned down at the moment.", "red");;
        validMovement = false;
    }
    if (checkBit(moveChar.conditionFlags, CONDITION_SWALLOWED)) {
        sendToHTML("demo", "You should probably be thinking of getting outside of this thing first.", "red");;
        validMovement = false;
    }
    if (checkBit(moveChar.conditionFlags, CONDITION_DIGESTED)) {
        sendToHTML("demo", "You have been completely dissolved. " +
            "The only movement you'll be experiencing is no longer in your control", "red");;
        validMovement = false;
    }

    /* If all checks above passed, process the movement */
    if (validMovement) {
        moveChar = processCommandMovement(moveChar, changeX, changeY, changeZ);
    }

    return moveChar;
}


function processCommandMovement(moveChar, changeX, changeY, changeZ) {
    moveChar.position[MAP_X] += changeX;
    moveChar.position[MAP_Y] += changeY;
    moveChar.position[MAP_Z] += changeZ;

    sendToHTML("demo", "processCommandMovement is not yet fully implemented", "red");
    return moveChar;
}






/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of functions
 ****************************************************************
 ****************************************************************
 ================================================================
 */

/*
 ================================================================
 ================================================================
 ================================================================
 * Code snippets for using this in an HTML page
 ================================================================
 ================================================================
 ================================================================




 ================================================================
 ================================================================
 ================================================================
 */

/**
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 * fight.js
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 *  Created by lbaow on 6/2/2017.
 *
 *  Battle related code (with the exception of the object types themselves) will be defined here.
 *
 **/

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * Beginning of global variable declaration block
 ****************************************************************
 ****************************************************************
 ================================================================
 */



/*
 ****************************************************************
 ****************************************************************
 */


/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of all global variables -- Functions defined below this line
 ****************************************************************
 ****************************************************************
 ================================================================
 */

function doCommandAttack() {
    // Temporary call to local script for debugging
    performAttack2();
}

function process_battle_round() {
    // Temporary call to local script for debugging.
    process_battle_round2();
}






/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of functions
 ****************************************************************
 ****************************************************************
 ================================================================
 */

/*
 ================================================================
 ================================================================
 ================================================================
 * Code snippets for using this in an HTML page
 ================================================================
 ================================================================
 ================================================================




 ================================================================
 ================================================================
 ================================================================
 */

/**
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 * inventoryControl.js
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 *  Created by lbaow on 6/1/2017.
 *
 *  Primary inventory control system created via Angular JS
 **/

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * Beginning of global variable declaration block
 ****************************************************************
 ****************************************************************
 ================================================================
 */

/*
 * Customize STARTING_INVENTORY_LIST with whatever you want the player
 * to begin with.
 ********************************************************************
 */
var STARTING_INVENTORY_LIST = ["item 1", "item 2", "item 3"]

/*
 ****************************************************************
 */

var app = angular.module("myInventoryList", []);

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of all global variables -- Functions defined below this line
 ****************************************************************
 ****************************************************************
 ================================================================
 */

app.controller("invCtrl", function($scope) {
    $scope.plrInventory = STARTING_INVENTORY_LIST;
    $scope.addItem = function () {
        $scope.products.push($scope.addMe);
    }
});


function CommandInventory() {
    sendToHTML("demo","Call to: CommandInventory","blue")
}






/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of functions
 ****************************************************************
 ****************************************************************
 ================================================================
 */

/*
 ================================================================
 ================================================================
 ================================================================
 * Code snippets for using this in an HTML page
 ================================================================
 ================================================================
 ================================================================



 Display player inventory:
 <div ng-app="myInventoryList" ng-controller="invCtrl">
 <ul>
 <li ng-repeat="x in plrInventory">{{x}}</li>
 </ul>
 </div>



 ================================================================
 ================================================================
 ================================================================
 */

/**
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 * utils.js
 * ====================================================================================
 * ************************************************************************************
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * ************************************************************************************
 * ====================================================================================
 *  Created by lbaow on 6/2/2017.
 *
 *  Miscellaneous utilities to perform common functions that don't fall into any other
 *  JavaScript file for this engine.
 *
 **/

/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * Beginning of global variable declaration block
 ****************************************************************
 ****************************************************************
 ================================================================
 */



/*
 ****************************************************************
 ****************************************************************
 */


/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of all global variables -- Functions defined below this line
 ****************************************************************
 ****************************************************************
 ================================================================
 */


/*
 * sendToHTML(outputElementbyID, message, colorCode)
 *
 * Simple utility designed to send to the HTML element by ID specified a specific message
 *
 * Parameters passed are as follows:
 * outputElementbyID = ID of the HTML element that text is being sent to
 * message = String message to be displayed
 * colorCode = Color name or code to display the message in;
 *
 * Default if 'null' is passed in will be black.
 *
 */
function sendToHTML(outputElementbyID, message, colorCode) {
    document.getElementById(outputElementbyID).innerHTML = message;

    if ((colorCode == null) || (colorCode == undefined)) {
        document.getElementById(outputElementbyID).style.color = "black";
    } else {
        document.getElementById(outputElementbyID).style.color = colorCode;
    }
}



/*
 ================================================================
 ****************************************************************
 ****************************************************************
 * End of functions
 ****************************************************************
 ****************************************************************
 ================================================================
 */

/*
 ================================================================
 ================================================================
 ================================================================
 * Code snippets for using this in an HTML page
 ================================================================
 ================================================================
 ================================================================

 sendToHTML(player, "Test of new output method", null);




 ================================================================
 ================================================================
 ================================================================
 */







/** **************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ====================================================================================================
 * Temporary test of local scripts, do not save into permanent js files
 * ====================================================================================================
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************/
function performAttack2() {
    sendToHTML("demo2", "", null);

    if (!checkBit(player.conditionFlags, CONDITION_DEAD) && (player.fighting == null)) {
        player.fighting = player;
    } else {
        switch (player.conditionFlags) {
            case 0:
                sendToHTML("demo", "You are already doing the best you can!", null);
                break;
            case CONDITION_UNCONSCIOUS:
                sendToHTML("demo", "You aren't conscious enough to do anything right now.", null);
                break;
            case CONDITION_DEAD:
                sendToHTML("demo", "You are DEAD! You can't do anything.", null);
                break;
            default:
                sendToHTML("demo", "Unknown condition passed in to performAttack()", null);
                break;
        }
    }

}

function process_battle_round2() {
    damage = 1;

    player.curHitPoints -= damage;

    sendToHTML("demo", "You are attacked for " + damage + " point of damage.  Current HP: " + player.curHitPoints, null);

    if (player.curHitPoints > 0) {
        sendToHTML("demo2",  "You swing your wooden sword and miss!", null);
    } else if (player.curHitPoints > -10) {
        sendToHTML("demo2",  "You have lost consciousness.", "orange");

        player.conditionFlags = setBit(player.conditionFlags, CONDITION_UNCONSCIOUS);
    } else {
        sendToHTML("demo2",  "You are DEAD!", "red");

        player.conditionFlags = removeBit(player.conditionFlags, CONDITION_UNCONSCIOUS);
        player.conditionFlags = setBit(player.conditionFlags, CONDITION_DEAD);
        player.fighting = null;
    }
}
/** **************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ====================================================================================================
 * END OF Temporary test of local scripts, do not save into permanent js files
 * ====================================================================================================
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************
 * ***************************************************************************************************/
