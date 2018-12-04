# Project Overview
## Link To Project
https://pages.git.generalassemb.ly/aaculp/My-First-Project/
https://aaculp.github.io/Rick-Morty-Space-Invaders/
## Project Schedule
---
This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

You are **responsible** for scheduling time with your squad to seek approval for each deliverable by the end of the corresponding day, excluding `Saturday` and `Sunday`.

| Day | Deliverable | Status
| --- | :---: |  :---:
|Day 1: Wed| Game Init / B1 / B2| Complete
|Day 2: Thu| Game Init / B4 / B3| B3 Complete B4 Incomplete
|Day 3: Fri| Game Init / C | Complete
|Day 4: Sat| Win Logic | Complete
|Day 5: Sun| Landing Page / Game Reset / Post MVP | Incomplete
|Day 6: Mon| Present | Incomplete


## Project Description
---
My project will be a Space Invaders replica but themed with Rick and Morty. The object of the game is to use Rick to shoot and eliminate all the Morty’s before they reach Rick. If you shoot a Morty, that single Morty will be eliminated. If a Morty reaches Rick then the game will end. If all Morty’s are eliminated the players Wins!

## Wireframes
---
[Wireframe Outline] "https://res.cloudinary.com/aaronculp/image/upload/v1537901773/Project%201%20Wireframes/IMG_4261.jpg"

[Wireframe Layout] "https://res.cloudinary.com/aaronculp/image/upload/v1537901773/Project%201%20Wireframes/IMG_4265.jpg"

[Wireframe MVP] "https://res.cloudinary.com/aaronculp/image/upload/v1537901773/Project%201%20Wireframes/IMG_4262.jpg"

[Wireframe Post MVP] "https://res.cloudinary.com/aaronculp/image/upload/v1537901773/Project%201%20Wireframes/IMG_4263.jpg"

[Wireframe Logic] "https://res.cloudinary.com/aaronculp/image/upload/v1537901773/Project%201%20Wireframes/IMG_4266.jpg"

## Priority Matrix
---
[Wireframe Priority Matrix] "https://res.cloudinary.com/aaronculp/image/upload/v1537901773/Project%201%20Wireframes/IMG_4264.jpg" 

### MVP/PostMVP - 5min
---
The functionality will then be divided into two separate lists: MPV and PostMVP.  Carefully decided what is placed into your MVP as the client will expect this functionality to be implemented upon project completion.  

#### MVP 
---
- Game Init
- Move Rick left and Right
- Create Random Morty At Bottom of Page
- Create Missle Shooting From Rick
- Eliminate Morty When Shot
- Win Game Logic

#### PostMVP 
---
- Landing Page
- Eliminate All Mortys
- Add More than One Character to Eliminate
- Game Reset

## Game Componets 
---
Rick img, Morty img, Background img, Transitions / Animations, Collusion Detection Logic, Game Logic, Possible Bonus Page.

#### Landing Page
---
The Landing Page is on the backburner for now and is in the Post MVP list. I would like to have the Landing Page have a nice .gif or video that plays a snippet of Rick and Morty TV Show to introduce the theme of the game.

#### Game Initialization
---
The game is loaded with a static Rick character and hopefully a moving background to imitate you are soaring through space.

#### Playing The Game
---
The goal of the game is to eliminate the Morty characters that are moving towards you by firing missiles to destory Morty via the computer keyboard. You will have the capability to move Rick
(You) left and right via the arrow keys to target and fire at the Morty characters. Hopefully I will have enough time to implement other characters into the game after all Morty's are eliminated to make the game harder. 

#### Winning The Game 
---
To win the game, all Morty's must be eliminated.

#### Game Reset
---
Game Reset is also on Post MVP so it will not be a main priority because the user can just refresh the page to restart the game. Will be complete if I have extra time.

## Functional Components
---
Based on the initial logic defined in the previous  phases section try and breakdown the logic further into functional components, and by that we mean functions.  Does your logic indicate that code could be encapsulated for the purpose of reusablility.  Once a function has been defined it can then be incorporated into a class as a method. 

Time frames are also key in the development cycle.  You have limited time to code all phases of the game.  Your estimates can then be used to evalute game possibilities based on time needed and the actual time you have before game must be submitted. 

| Component | Priority | Estimated Time MVP | Estimated Time Post MVP | Time Invetsted | Actual Time |
| --- | :---: |  :---: | :---: | :---: | :---:|
| Landing Page | L |  | 2.5hrs |  |  |
| Moving Rick L/R | H | 4hrs|  | 3hrs | 3hrs |
| Creating Random Morty | H | 3hrs |  | 1hr | 1hr |
| Move Morty Towards Rick | M |  | 4hrs | 1hr | 1hr |
| Create Missles from Rick | H | 5hrs |  | 5hrs | 5hrs |
| Elminate Morty | H | 4hrs |  | 10hrs | 6hrs |
| Win Game Logic | H | 3hrs |  | 3hrs | 3hrs |
| Game Reset | L |  | 2hrs |  |  |
| Total |  |  19hrs | 9.5hrs | 23hrs |  |


## Helper Functions
---
Helper functions should be generic enought that they can be reused in other applications. Use this section to document all helper functions that fall into this category.

| Function | Description | 
| --- | :---: |  
| Reference for DOM | This project will be a good reference for a lot of DOM |
| KeyDown (DOM) | Using the AddEvent 'Keydown' |
| Creating Random Elements (Loop) (DOM) | Anytime I need to random populate |
| Transitions Vs DOM | Which is better, reference to both |
| Collusion Detection | Game Logic | 

## Additional Libraries
---
 No Other Libraries. HTML / CSS / JS / DOM / Collusion Detection

## Code Snippet
---
Use this section to include a brief code snippet of functionality that you are proud of an a brief description  

```
function firstCollision(rocket, morty) {
 let rocketTop = window.getComputedStyle(rocket, null).getPropertyValue("top");
 let rocketLeft = window.getComputedStyle(rocket, null).getPropertyValue("left");
 let rocketHeight = window.getComputedStyle(rocket, null).getPropertyValue("height");
 let rocketWidth = window.getComputedStyle(rocket, null).getPropertyValue("width");
 let rocketBottom = window.getComputedStyle(rocket, null).getPropertyValue("bottom");
 rocketTop = parseInt(rocketTop.split('px')[0])
 rocketLeft = parseInt(rocketLeft.split('px')[0])
 rocketHeight = parseInt(rocketHeight.split('px')[0])
 rocketWidth = parseInt(rocketWidth.split('px')[0])
 rocketBottom = parseInt(rocketBottom.split('px')[0])

 let mortyTop = window.getComputedStyle(morty, null).getPropertyValue("top");
 let mortyLeft = window.getComputedStyle(morty, null).getPropertyValue("left");
 let mortyHeight = window.getComputedStyle(morty, null).getPropertyValue("height");
 let mortyWidth = window.getComputedStyle(morty, null).getPropertyValue("width");
 let mortyBottom = window.getComputedStyle(morty, null).getPropertyValue("bottom");
 mortyTop = parseInt(mortyTop.split('px')[0])
 mortyLeft = parseInt(mortyLeft.split('px')[0])
 mortyHeight = parseInt(mortyHeight.split('px')[0])
 mortyWidth = parseInt(mortyWidth.split('px')[0])
 mortyBottom = parseInt(mortyBottom.split('px')[0])

  if (mortyTop < rocketTop + rocketHeight && mortyTop + mortyHeight > rocketTop &&
    mortyLeft < rocketLeft + rocketWidth && mortyLeft + mortyWidth > rocketLeft) {
  morty.remove()
  rocket.style.top = 10 + 'px'
  rocket.style.transition = 'none'
  setTimeout(function(){
  rocket.style.transition = 'top 1s linear'
  },0)
  }
}
```

## Change Log
---
I never made it to my post MVP so the changes that were made were the planning details to only finish the MVP solutions

## Issues and Resolutions
---
 The big issue I had was getting the missle to elimiate the Morty. Once I figured that out my MVP was complete. I then tried to move to my Post MVP but couldn't eliminate the rest of the Mortys so that resolution was never solved.
