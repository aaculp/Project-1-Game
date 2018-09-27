# Project Overview

## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

You are **responsible** for scheduling time with your squad to seek approval for each deliverable by the end of the corresponding day, excluding `Saturday` and `Sunday`.

|  Day | Deliverable | 
|---|---| 
|Day 1: Wed| Game Idea| Yes
|Day 2: Thur| Wireframes and Priority Matrix| Yes
|Day 3: Fri| Pseudocode\actual code| Yes
|Day 4: Sat| Basic Clickable Model | Yes
|Day 5: Sun| Working Prototype | Yes
|Day 6: Mon| Game Completed / Slides | Yes
|Day 7: Tue| Project Presentations | Yes

## Project Description

Use this section to describe your final project and perhaps any links to relevant sites that help convey the concept and\or functionality.

https://docs.google.com/presentation/d/1QyVbekVsT6-d2_OX67u3OAb_x20VE297VXtMY3CYCCc/edit?usp=sharing

https://codepen.io/camcash714/pen/mqojBa

My project is a Roulette game. The player will input their name, select the number they can choose from the board and then click to throw the ball on the spinning wheel. If the number the player chooses matches the number the ball lands on the roulette spinner, they win, if numbers do not match, they lose. After either outcome the user can choose to click a button to play again.

## Priority Matrix

Include a full list of features that have been prioritized based on the `Time and Importance` Matix.

http://res.cloudinary.com/camcash17/image/upload/v1512677468/project1_matrix_ocy5gc.jpg  

## MVP

Include the full list of features that will be part of your MVP 

- The player will start by typing out their name and clicking a submit button.

- They will then be able to select any number 1-36 on the roulette table.

- Once they select their number, they can click another button to throw the ball on the spinning roulette wheel.


- The winning logic will only take into conisderation the one number the player chose that has a specific degree saved in its object and compare it to the degree of which the ball landed on the wheel.

## POST MVP

Include the full list of features that you are considering for POST MVP

POST MVP features are laid out to essentially make the game as realistic as possible:

- Add additional bets to choose from outside of just selecting one number 1-36
    (even/odd, red/black, dozens and halves)

- Add additional form to submit a $ bid amount The user could start out with a set amount of money and either win a certain payout if their bet hits, or lose the money wagered if it doesnt.

- Add the option to place multiple bets other than just one option.

## Wireframes

Include images of your wireframes. 

http://res.cloudinary.com/camcash17/image/upload/v1512677455/project1_wireframe_tpwhdy.jpg

## Game Components

### Landing Page
What will a player see when they start your game?
The landing page will depict the header with the title, game directions, a form to submit your name a button to start the game and display the game boards.

### Game Initialization
What will a player see when the game is started? 
The player will see a prompt to choose any number featured on the table, as well as a roulette wheel constantly spinning.

### Playing The Game
What will be the flow of the game, what will the user be expeted to do and what will the user expect from the gam
After the user has submitted their name and selected their number from the table, they will be prompted to click a button to throw the ball and Roulette!

### Winning The Game
What does it look like when the game ends, what determines winning or losing?
Depending on where the ball lands, a prompt will appear either saying if the player wins or loses the game. If the position of the ball by degree matches the degree saved in the number object, the player wins and if not, they lose.

### Game Reset
How will the user restart the game once it has been completed.
Once the ball stops and the prompt appears saying if they win or lose, a button will also appear to click and reset the game to the initialization settings.

## Functional Components

Based on the initial logic defined in the previous game phases section try and breakdown the logic further into functional components, and by that we mean functions.  Does your logic indicate that code could be encapsulated for the purpose of reusablility.  Once a function has been defined it can then be incorporated into a class as a method. 

number.click(function())
    - click any number on the roulette table to store its value in the Numbers class to compare to the the spinner degree

throw.click(function())
    - click the throw button to throw the ball onto the spinner

reset.click(function())
    - click the reset button to change displays and allow user to restart the game

compareDegree(function()) 
    - take the degree of the position the ball lands around the wheel and compare it to the degree stored in the value of the number chosen by the user and use to determine winning logic

grabInput(function())
    - take the users name after they type it in and submit and use it to display when they select a number from the roulette table.

Time frames are also key in the development cycle.  You have limited time to code all phases of the game.  Your estimates can then be used to evalute game possibilities based on time needed and the actual time you have before game must be submitted. 

| Component | Priority | Estimated Time | Time Invetsted | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| Win Logic | H | 2hrs| 1hrs | 1hrs |
| FlexBox Display | H | 2hrs| 3hrs | 3hrs |
| Animations | M | 3hrs| 4hrs | 4hrs |
| CSS page layout | H | 3hrs| 3hrs | 3hrs |
| creating classes | H | 3hrs| 2hrs | 2hrs |
| forms | M | 1hrs| 1hrs | 1hrs |

## Helper Functions
Helper functions should be generic enough that they can be reused in other applications. Use this section to document all helper functions that fall into this category.

| Function | Description | 
| --- | :---: |  
| Capitalize | This will capitalize the first letter in a string | 
I did not use any generic helper functions. 
|throwBall.click(function() | Most methods/functions I used were click events|

## Additional Libraries
 Use this section to list all supporting libraries and their role in the project. 
 I had a lot of help from stack overflow.

## Code Snippet

Use this section to include a brief code snippet of functionality that you are proud of an a brief description.  
"headOne.html(`${this.$value} selected <span id='selected'>${this.val}</span>`)''
I liked this code because both utilized 'this' but under different scopes. The Id needed to be put in a span to be used in a separate method to compare for win logic.

## jQuery Discoveries
 Use this section to list some, but not all, of the jQuery methods and\or functionality discovered while working on this project.
 I discovered that you can use jQuery to call upon an animation created in CSS
 I also discovered that you can create an animation in jQuery, but its not easy.

## Change Log
 Use this section to document what changes were made and the reasoning behind those changes. 
 I changed everything from my first script file that was essentially all free floating to code a second script file that utilzed classes because it is better practice.

 I changed my reset button to refresh the page which I know was frowned upon but made the game functional to repeat since I could not get the animations to reset.

## Issues and Resolutions
 Use this section to list of all major issues encountered and their resolution.
 
 **ERROR**: Animation created to rotate the ball on the wheel would not run more than once.<br/>
 **RESOLUTION**: No resolution. Used code to refresh the page instead of staying on the same page.

**ERROR**: The value of the input form submission was not useable to push into a heading in a separate method.<br/>           
**RESOLUTION**: I needed to bind the method to adjust the scope within the class.

**ERROR**: I was unable to track the position of the ball along its rotation around the spinning wheel to use in my win logic to compare it to the degree of the number the user selects.<br/>
**RESOLUTION**: I had to manually assign each number around the roulette wheel with its own degree.

**ERROR**: My images were not moving positions when I tried to add a media query to the file.<br/>
**RESOLUTION**: I had to add "div." to the beginning of the image in css.

#### SAMPLE.....
**ERROR**: app.js:34 Uncaught SyntaxError: Unexpected identifier                                
**RESOLUTION**: Missing comma after first object in sources {} object
