# Project Overview

## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

You are **responsible** for scheduling time with your squad to seek approval for each deliverable by the end of the corresponding day, excluding `Saturday` and `Sunday`.

|  Day | Deliverable | Approval From Squad Lead
|---|---| ---|
|Day 1: Wed| Game Idea|
|Day 2: Thur| Wireframes and Priority Matrix|
|Day 3: Fri| Pseudocode\actual code|
|Day 4: Sat| Basic Clickable Model |
|Day 5: Sun| Working Prototype |
|Day 6: Mon| Game Completed / Slides |
|Day 7: Tue| Project Presentations |

## Project Description

My Game is a Fly Swatter Game, AKA "debugger".  The point of the game is to "swat" all the flies in the alloted time frame.  I set event listeners on the flies to fun several functions when they are clicked upon.  One  all flies are gone in the alloted time, the user wins.

Codepen Link: https://codepen.io/katebrenner/pen/e2620e8b375c897620c34cf7802fded1

Google Slides : https://docs.google.com/presentation/d/1jXoN_4ZHoOyfhEplzriyk7vojjmbNtWr_-vKmuRRDh4/edit?usp=sharing


## Priority Matrix

Include a full list of features that have been prioritized based on the `Time and Importance` Matix. 
-  Have images for the flies, added dynamically in javascript
-  Add animations to each div to move the flies 
-  Create event listeners to make flies “visibility: hidden” and also change their “alive” value from true to false
-  Create a countdown timer
-  Create a form to capture the player’s information
-  Turn mouse into an image
-  keep a win count
-  make it a 2 player game
-  have form appear “in front” of page

## MVP 

-  Include the full list of features that will be part of your MVP 
-  Have images for the flies, added dynamically in javascript
-  Add animations to each div to move the flies
-  Create event listeners to make flies “visibility: hidden” and also change their “alive” value from true to false
-  Create a countdown timer
-  Create a form to capture the player’s information

## POST MVP

-  Include the full list of features that you are considering for POST MVP
-  Turn mouse into an image
-  Keep a win count
-  Make it a 2 player game
-  Have form appear “in front” of page

## Wireframes

Include images of your wireframes. 

![](https://i.imgur.com/hPNyrVt.jpg)
![](https://i.imgur.com/3WQDfVY.jpg)
![](https://i.imgur.com/saTrj9e.jpg)
![](https://i.imgur.com/W18DP4s.jpg)

## Game Components

### Landing Page
When the player goes to the site, he or she will see a form that provides them with game instructions and also instructs them to enter their name



### Game Initialization
When the player starts the game, he or she will see the coutdown timer begin and also see the flies circling.  The win count will be kept as well.

### Playing The Game
The user will have to swat all the flies in the alloted time. When they hover their swatter over the fly, it will expand so they know they are about it hit it.

### Winning The Game
If the player gets all the flies in the alloted time, he or she wins.  Either way, they able to press the try again button, and play again, and keep track of how many consecutive wins they get.

### Game Reset
The user will press the play again button, which restarts the timer and makes all the flies reappear and resets all of their "alive" values back to true.

## Functional Components

Based on the initial logic defined in the previous game phases section try and breakdown the logic further into functional components, and by that we mean functions.  Does your logic indicate that code could be encapsulated for the purpose of reusablility.  Once a function has been defined it can then be incorporated into a class as a method. 

Time frames are also key in the development cycle.  You have limited time to code all phases of the game.  Your estimates can then be used to evalute game possibilities based on time needed and the actual time you have before game must be submitted. 

| Component | Priority | Estimated Time | Time Invetsted | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| Form | H | 10hrs| 8hrs | 8hrs |
| Dynamically Adding images | H |  5hrs | 7hrs | 7hrs |
| Win Logic | H | 10hrs| 15hrs | 15hrs |
| Creating classes | H | 5hrs| 10hrs | 10hrs |
| Adding animations | H | 5hrs| 5hrs | 5hrs |
| Countdown Timer | L | 5hrs| 5hrs | 5hrs |
| Change Mouse | L | 2hrs| 2hrs | 2hrs |
| Win Count | L | 3hrs| 2hrs | 2hrs |

## Helper Functions
Helper functions should be generic enought that they can be reused in other applications. Use this section to document all helper functions that fall into this category.

| Function | Description | 
| --- | :---: |  
| .setInterval()| This will run a function multiple times every X amount of milliseconds| 
| .bind()| Attaches an event handler to an element| 

## Additional Libraries
 Use this section to list all supporting libraries and thier role in the project. 
 
-  Google fonts
-  jQuery

## Code Snippet

Use this section to include a brief code snippet of functionality that you are proud of an a brief description.

I struggled with classes so I am happy I was able to create the fly class and bind the squash functio to the image tag below:
```javascript
class Fly {
  constructor(divid, divclass, im, alive){
    this.divid = divid;
    this.divclass = divclass;
    this.im = im.click(this.squash.bind(this));
    this.alive = true;
    fliesArray.push(this);
  }
  squash(){
    this.alive= false;
    this.im.css("visibility", "hidden");
    }
  }
  ```


## jQuery Discoveries
 -  .setInterval
 -  .bind
 -  .map
 -  .attr

## Change Log

 I didn't make the form appear "in front of" the screen.  I actually preferred how I originaoly set up the forma and I was spending too much time trying to change it.  Also, I also originally wanted to push all instances of the class into an array and loop through the array to check the "alive" value of each, so that my win logic wouldn't be as repetative.  I am still trying to do it, but I left the win logic as is for now. 

## Issues and Resolutions
-  **Roadblocks-**
-  Ideally I would have pushed all instances of the class into an array, and looped through the array for the win logic, instead of having repetitive code
-  Would have liked to have more than one class
-  **Wins-**
-  Using “bind” (thanks stack overflow!).  Still trying to master when to use this.
-  Learning to use setinterval for the timer.
-  Changing the cursor to an image was much easier that I thought.


#### SAMPLE.....
**ERROR**: app.js:34 Uncaught SyntaxError: Unexpected identifier                                
**RESOLUTION**: Missing comma after first object in sources {} object
