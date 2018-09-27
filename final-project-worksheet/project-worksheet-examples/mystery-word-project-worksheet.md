# Project Overview

## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

You are **responsible** for scheduling time with your squad to seek approval for each deliverable by the end of the corresponding day, excluding `Saturday` and `Sunday`.

|  Day | Deliverable | 
|---|---| 
|Day 1: Wed| Game Idea|
|Day 2: Thur| Wireframes and Priority Matrix|
|Day 3: Fri| Pseudocode\actual code|
|Day 4: Sat| Basic Clickable Model |
|Day 5: Sun| Working Prototype |
|Day 6: Mon| Game Completed / Slides |
|Day 7: Tue| Project Presentations |

## Project Description
My final project is a very basic hangman game. It has only one winning word hard-coded in. The user has 6 chances to guess the correct word, or else they lose. The crux of the javascript is basically one big "if" statement with several "else if" statements. Each "if" or "else if" statement essentially checks what the value of the div that is clicked. There are 26 divs, one for each letter of the alphabet, and depending on what letter it is, a certain action will take place. If it is one of the correct letters, then that letter(s) will appear in the winning word. If it is an incorrect guess, the "if/else if" statements check a counter to see how many wrong guesses have happened already and adds a body part accordingly. The head adds on first, then the body, then the right-arm, then the left-arm, then the right-leg, and finally the left-leg. As each body part is added, the counter goes down one. Once that counter reaches 0, the game is over.

## Priority Matrix

http://res.cloudinary.com/damark726/image/upload/v1513020174/tpm_th4sqg.jpg

## MVP 
 - Have one word working for a hangman game.
 - Have all the event listeners working for each letter.
 - Have body part appear each wrong guess.
 - Have win logic completed when the guesses match the winning word.
 - Have lose event happen when chances run out.

## POST MVP
 - Make multiple winning words and have a function to randomize which word is the winning word.
 - Animate the hanged body to swing slowly back and forth.
 - Add more details to the hanged body, such as clothes or blood.
 - Create a timer and a score count. The less turns the user uses to solve the word, the higher the score.
 
## Wireframes
 - http://res.cloudinary.com/damark726/image/upload/v1512706736/whiteboard_kaxc0m.jpg
 - http://res.cloudinary.com/damark726/image/upload/v1512706735/startPage_nvfu9z.jpg
 - http://res.cloudinary.com/damark726/image/upload/v1512706734/duringGame_g25rgm.jpg
 - http://res.cloudinary.com/damark726/image/upload/v1512706735/winPage_eztf5f.jpg

## Game Components

### Landing Page
When the page loads, there will be a box in the middle of the screen asking for the user to enter their name. Another thing that will be present will be a big box at the bottom with the winning word. The letters will obviously be hidden, but the underlines of each letter will be there letting the user know how many letters the winning word has. There will also be a box at the top of the screen, which is where the rope and the person will eventually be placed. The rope and person body will be hidden initially, but will reveal itself piece by piece as each incorrect letter is guessed. There will also be 2 boxes on the top-left and top-right corners. The box on the the top-left will just be a banner saying something like "Hangman", while the box on the top-right will show the user how many chances they have left. There will be a total of 6 chances at the start of the game. Lastly, there will be a restart button on the top left corner, above the box saying "Hangman".

### Game Initialization
After the user enters their name, that form will disappear and the value they entered will be stored and be used for later on. The only new thing that will appear after the form goes away will be 26 clickable boxes with each letter of the alphabet, which will be what what the users use to make their guesses. All the other things that were present on the landing page will stil be present here as well.

### Playing The Game
As stated above, the user will be able to click a box containing a letter. If they clicked a correct letter, then that letter will become visible in the winning word, which is "narwhal". If they clicked on an incorrect letter, then a body part will then be revealed. The user has 6 chances since there are 6 body parts that are missing (head, body, right-arm, left-arm, right-leg, and left-leg.

### Winning The Game
Winning the game entails that the user clicked all the correct letters without guessing wrong 6 times. If the user wins, then a box in the middle of the screen will become visible with a message saying "Congrats, you have survived, (name entered in the form)!" or something along those lines. If the user loses, there will also be a box in the middle of the screen that will become visible, but insetad with a message saying something like "R.I.P. (name entered in the form)".

### Game Reset
There will be a restart button in the top left corner that will just refresh the page, essentially "restarting" the game.

## Functional Components

| Component | Priority | Estimated Time | Time Invetsted | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| Defining variables & setting click events | A | 6hrs| 8hrs | 8hrs |
| Setting all functions (win/lose events) | A | 10hrs| 13hrs | 13hrs |
| Rafactoring my javascript to use classes | A | 6hrs| 8hrs | 8hrs |
| Setting up the form | B | 2hrs| 1hrs | 1hrs |
| HTML & CSS | C | 4hrs| 6hrs | 6hrs |
| Total Time | / | 28hrs| 36hrs | 36hrs |

## Additional Libraries
The only additional library used in this project was jQuery, which its main purpose was DOM manipulation.

## Code Snippet
http://res.cloudinary.com/damark726/image/upload/v1513059967/Screen_Shot_2017-12-12_at_1.24.59_AM_myzzfa.png

In this picture, I have essentially the heart of my javascript. It is one "if" statement with eleven "else if" statements. In this snippet of code, I am checking the letter that was clicked and running it through all the possible conditions it could have. I has to fall in one of those 12 statements, and depending on which one it falls in, something will happen. For example, if it is a correct guess, then the mathcing letter will become visible on the winning word, or if it is an incorrect guess, then depending on how many incorrect guesses has happened, it determines which body part should be displayed next.

## jQuery Discoveries
 Some of the minor jQuery methods I discovered while working on this project, were the location.reload(), .submit(), and event.preventDefault() methods. The location.reload() method basically refreshes the page, so I used that for my restart button. The other two methods I used for my form. The .submit() method allowed me to capture the value of the input box, while the event.preventDefault() method allowed me to prevent the page from refreshing after the form was submitted, allowing for a cleaner looking project/game. However the one major method I discovered was the .bind() method. This was a crucial component in making my game work using classes. This method allowed me to call other methods inside another method.

## Change Log
 - I originally planned on having a div at the top and add the letters the user has chosen into that div, as to allow the user to see what letters they have already chosen. However, I decided later on that just graying out the actual buttons themselves and turning off their click events was visiually more pleasing and also just made more sense. Other than that, I adhered to pretty much everything else I had planned.

## Issues and Resolutions
My project/game for the most part went great. HTML was obviously not a problem, and the CSS I actually had no problem at all. I have a really good grasp of CSS and I also really enjoy using CSS. The javascript portion of my project was great except for one major drawback. My only major issue during this project was figuring out how to implement classes into my javascript and to get it working. I had coded all my javascript without the use of classes, and trying to take what I had & convert that into something that used classes was a real challenge. However, towards the very end of the deadline, I was finally able to refactor all of my code using classes; only one class to be exact. The .bind() method I mentioned above was an important pice of the puzzle. Without knowing about that method, it felt almost impossible to change my free-floating fucntions into methods within a class.
