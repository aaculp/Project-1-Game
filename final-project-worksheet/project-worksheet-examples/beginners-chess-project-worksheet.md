## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

You are **responsible** for scheduling time with your squad to seek approval for each deliverable by the end of the corresponding day, excluding `Saturday` and `Sunday`.


|  Day | Deliverable | Status |
|---|---| ---|
|Day 1: Wed| Game Idea| Complete
|Day 2: Thur| Wireframes and Priority Matrix| Complete
|Day 3: Fri| Pseudocode\actual code| Complete
|Day 4: Sat| Basic Clickable Model | Complete
|Day 5: Sun| Working Prototype | Complete
|Day 6: Mon| Game Completed / Slides | Complete
|Day 7: Tue| Project Presentations | Complete

## Project Description

Beginner's Chess, is a variation on chess where the only pieces on the board are pawns. It is a variation of chess designed for beginners and to help them learn the game. The pawns will be in their natural position and the players must advance their piece to the end of the board in order to promote their pawn and thus, winning the game.

## Wireframes

![MVP](https://res.cloudinary.com/andytham/image/upload/v1512673082/PROJECT1/wireframe_mvp.jpg)

![PostMVP](https://res.cloudinary.com/andytham/image/upload/v1512673082/PROJECT1/wireframe_post_mvp.jpg)

## Priority Matrix

![priority matrix](https://res.cloudinary.com/andytham/image/upload/v1512673082/PROJECT1/priority_matrix.jpg)


## MVP

* 2 players black and white
* enter name on page
* game will initialize
* checkered board create along with pawns
* pawn logic 5 moves
  * forward two moves only if first move
  * forward one move
  * diagonally to capture enemy piece
  * en passant - capture a piece that it normally could if it moved one space instead of the allowed two that it performed taking its 'one-move' spot
  * promotion - pawn reaches the end of the opposite side and can be 'promoted' to a higher rank piece, usually a queen.
* promotion of a pawn in this beginner's chess signifies victory for the player who promoted their pawn and ends the game
* click on pawn to select, click on allowed spots to move, click on self again to deselect.

## POST MVP

* AI (super optional)
* Speed beginner's Chess
* Moving through keyboard using rank and file notation
* Full game of chess
* Move history


## Game Components

Chess board
Chess pieces
Move logic
Special move logic (en passant)
Promotion/Win condition
Restart
History


### Landing Page

There is a in game prompt asking for the two player's name and a continue button so they can start the game.

### Game Initialization
The chess board is setup with all the pawns in place, the player's turn is indicated.

### Playing The Game

Player 1, who controls the white pawns start the game, and can move their pawns in several ways, one move per player per turn. On a pawn's very first move they can move forward two spaces. As a caveat, an opponent can capture a pawn that it could normally capture if it didn't move two spaces, in a move called en passant, and place it in that space. Otherwise, pawns can only move forward one space, and only capture pieces in diagonally spot. If a pawn reaches the opposite end of a board, it will be promoted into a queen and the game will end.


### Winning The Game
Winning the game shows a popup that shows the player's name indicating

### Game Reset

A reset will pop up under the victory line and allow the players to start over from scratch without reloading the page.

## Functional Components

Based on the initial logic defined in the previous game phases section try and breakdown the logic further into functional components, and by that we mean functions.  Does your logic indicate that code could be encapsulated for the purpose of reusability.  Once a function has been defined it can then be incorporated into a class as a method.

Time frames are also key in the development cycle.  You have limited time to code all phases of the game.  Your estimates can then be used to evaluate game possibilities based on time needed and the actual time you have before game must be submitted.

| Component | Priority | Estimated Time | Time Invested | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| Board Creation | H | 3 hrs| 2 hrs | 2 hrs |
| Board Layout | M | 1 hrs| 2 hrs | 2 hrs  |
| Render Logic | H | 3 hrs| 1 hr | 1 hr  |
| Pawn Move Logic | H | 10hrs| 11.5 hrs | 11.5 hrs |
| En Passant | H | 1 hr| 3.5 hrs | 3.5 hrs |
| Page Layout | M | 2 hrs | 3 hr | 3 hr  |
| Landing Page | M | 1 hr| 1.5 hrs | 1.5 hrs |
| Win Screen | M | 1 hr| 1 hr | 1 hr |
| Restart | M | 2 hrs | 1 hr | 1 hr  |
| History | L | 2 hrs| 3 hrs | 3 hrs |
| Total   |   | 26 hrs |       | 29.5hrs |

## Helper Functions
Helper functions should be generic enough that they can be reused in other applications. Use this section to document all helper functions that fall into this category.

| Function | Description |
| --- | :---: |  
| createBoard | Creates a checkered board. |
| ChessPiece | Class for creating chess piece objects. |

## Additional Libraries
 No additional libraries used, only jQuery.

## Code Snippet

```
move6.attr("data-piece") == "pawn") { // En passant to the right
  let targetColor = move6.attr("data-color");
  let targetPiece = move6.attr("data-piece");
  let targetNumber = move6.attr("data-number");
  let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
    return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
  });

  if (targetChessPiece[0].isEnPassantable == true) {

    move4.css("border", "2px red solid");
    move4.click(function() {
      targetChessPiece[0].isAlive = false;
      selectedChessPiece[0].rank = rank1Fix;
      selectedChessPiece[0].file = fileRev1Fix;
      let historyRegex = currentTarget.match(/\d/g);
      updateHistory(historyRegex[1],historyRegex[0],playerTurn);
      playerTurn = "black";
      render();
    });
  }
}
```

## jQuery Discoveries
 - .match()
 - regex function for finding strings or characters
 - .remove(), deletes the element and everything in it

## Issues and Resolutions
 Use this section to list of all major issues encountered and their resolution.

**ISSUE**: Problems dealing with strings
```
let move1 = $(`.row${selectedChessPiece[0].rank + 1}.col${selectedChessPiece[0].file}`);
let move2 = $(`.row${selectedChessPiece[0].rank + 2}.col${selectedChessPiece[0].file}`);
let move3 = $(`.row${selectedChessPiece[0].rank + 1}.col${selectedChessPiece[0].file - 1}`);
let move4 = $(`.row${selectedChessPiece[0].rank + 1}.col${selectedChessPiece[0].file + 1}`)
```

**RESOLUTION**: The solution to this is there are multiple problems dealing with strings that I'm not intuitively aware of. doing calculations in strings work most of the time but it seems like it is something that should be avoided, mostly in jQuery as it acts a bit weird when calling upon jQuery and trying to pass a selector while also doing calculations. evaluating the string or converting it to a number while inside the jQuery function will not work.
