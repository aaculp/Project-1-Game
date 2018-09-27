# Project Overview

## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

You are **responsible** for scheduling time with your squad to seek approval for each deliverable by the end of the corresponding day, excluding `Saturday` and `Sunday`.

|  Day | Deliverable |
|---|---| 
|Day 1: Wed| Game Idea| Complete
|Day 2: Thur| Wireframes and Priority Matrix| Complete
|Day 3: Fri| Pseudocode\actual code| Complete
|Day 4: Sat| Basic Clickable Model | Complete
|Day 5: Sun| Working Prototype | Complete
|Day 6: Mon| Game Completed / Slides | Complete
|Day 7: Tue| Project Presentations |

## Project Description

The Food and Wine Pairing Knowledge Test is a self-scoring trivia game that takes design/style inspiration from Kahoot.com and content inspiration from the winerist.com.

![Codepen - Final Version.Dec2017](https://codepen.io/ashleystarks/pen/LeParE)

## Priority Matrix

Prioritized features include the following:
- Form
- Game logic triggered by a click
- CSS animation for transitions
- Game logic triggered by a lapse in time
- Restart button
- Score counter

![time matrix](https://git.generalassemb.ly/ashleyamin/PROJECT-1-PROMPT/blob/master/whiteboarding/IMG_4918.JPG?raw=true)

## MVP 

- form with intro, directions, input for name, and 'start' button
- question/answer logic, varying phrase based upon score
- score counter
- winning logic, presenting final score and varying phrase based upon score
- 'try again' button

## POST MVP

- statis footer
- animated logo in upper left
- randomized questions; additional questions
- timer
- add fun animations

## Wireframes

![Wireframes - high fid, color version](https://git.generalassemb.ly/ashleyamin/PROJECT-1-PROMPT/blob/master/Trivia%20Game%20Wireframes_Comments.pdf)

![Wireframes - white boarding all images](https://git.generalassemb.ly/ashleyamin/PROJECT-1-PROMPT/tree/master/whiteboarding)

![whiteboard wireframes](https://git.generalassemb.ly/ashleyamin/PROJECT-1-PROMPT/blob/master/whiteboarding/IMG_4917.JPG?raw=true)


## Game Components

### Landing Page
When the game is loaded the user will see a page that states the following:
- title of the game "Wine and Food Pairing Knowledge Test"
- description of the game "Food and wine pairing is an art with just a few rules. Answer a few questions to find out if you're on your way to becoming a true aficionado!"
- a direction for the user to enter name and click start to start the game
- a name input field
- a 'start' button

### Game Initialization
When the user clicks on the game button, the page will fade away and the following will appear:
- First question and answer, "Wine increases the heat of spicy food." True or False.
- Score board 0/10

### Playing The Game
When the user clicks on true or false to answer the question, the question and answer will fade away and the result will be displayed through the following messages - If correct, "You're correct! One sip closer to becoming a wine-o." If incorrect, "That's very wrong. You may need to eat and wine more." At the same time, the score will be updated if the answer was correct and will not be updated if the answer is incorrect. After 3 seconds the result will disappear and the second question/answer will appear. This loop will continue 9 more times (for a total of 10).

### Winning The Game
After the loop is finished, the individual question result will fade away and the following will be displayed:
- answers correct, total questions
- phrase based upon # of correct answers (e.g. "You're absolutely perfect! Congratulations, you're an aficionado!" if score is 10/10)
- 'restart game' button

### Game Reset
When the restart game button is clicked, the final result will fade away and the following will be displayed:
- score counter, reset to 0
- first question and answers

## Functional Components

Based on the initial logic defined in the previous game phases section try and breakdown the logic further into functional components, and by that we mean functions.  Does your logic indicate that code could be encapsulated for the purpose of reusablility.  Once a function has been defined it can then be incorporated into a class as a method. 

Time frames are also key in the development cycle.  You have limited time to code all phases of the game.  Your estimates can then be used to evalute game possibilities based on time needed and the actual time you have before game must be submitted. 

| Component | Priority | Estimated Time | Time Invetsted | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| HTML Setup | H | 1hr| 1hr | 1hr |
| CSS Setup (CSS Grid and Flexbox) | H | 2hr| 1hr | 1hr |
| Form Show/Hide, Start Game Event | H | 4hrs| 5hrs | 5hrs |
| Game Play Logic | H | 4hrs| 20hrs | 20hrs |
| Update Score Logic | H | 4hrs| 10hrs | 10hrs |
| Win Game Logic | H | 4hrs| 10hrs | 10hrs |
| Restart Game Event | H | 4hrs| Xhrs | Xhrs |
| Static Footer | M | 2hrs| 2hrs | 2hrs |
| Animated Logo | L | 4hrs| 1hr | 1hr |
| Randomized Questions, Additional Questions | L | 8hrs| Xhrs | Xhrs |

## Helper Functions
Helper functions should be generic enought that they can be reused in other applications. Use this section to document all helper functions that fall into this category.

| Function | Description | 
| --- | :---: |  
| Capitalize | This will capitalize the first letter in a string |
| Question Class | Enables the ability to create new question sets |
| Trivia Class | Enables the ability to create new instances of the game |
| Trivia Methods | Part of the class and would be reused in new instances | 

## Additional Libraries
| Library | Description | 
| --- | :---: |  
| Google Fonts | Used to set font for all text in game |
| Jquery | Used to enable easy DOM traversing, manipulating, event handling, animating, |
| Emoji | A library on github that makes it easier to insert emojis via unicode |

## Code Snippet

```
class PlayingTrivia {
  constructor(score, questionSet, questionId){
  this.score = score;
  this.questionSet = questionSet;
  this.questionId = questionId;
  this.showScore = this.showScore.bind(this)
  }

  checkQuestionId() {}

  showQuestion() {}
    if() {
    }
    else{
      let $question = $('#questions');
      $question.text(this.checkQuestionId().text); //adds the questions via .text
        let $choices0 = $('#choice0');
        let $choices1 = $('#choice1');
        $choices0.text(this.checkQuestionId().choices[0]); //adds the answers via .text
        $choices1.text(this.checkQuestionId().choices[1]); //adds the answer via .text
    }
  }
  nextQuestion(answer) {
    this.questionId++;
    }
  }
```

The above code snippet was a huge accomplishment. It adds the question text and answer text from the array, and when a button is clicked, it moves to the next question by adding +1 to the ID.

## jQuery Discoveries
 - Bind method was discovered for use inside of classes; still need to practice to use it properly

## Change Log
 1. Tried to add scoreboard to upper right corner of page and am having trouble with css grid. For now, will instead only show score at the end of all the trivia questions. 

## Issues and Resolutions
1. Scoreboard location - resolution for this issue was to only have score at the end of game play
2. Placing HTML on page for end score - a temporary resolution for this issue is to have an alert show up with the final score
3. Score Logic/Win Logic - a temporary resolution for this issue during the demo will be to hard code the score at the end
