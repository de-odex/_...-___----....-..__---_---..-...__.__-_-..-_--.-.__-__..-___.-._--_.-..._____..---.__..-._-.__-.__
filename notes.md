# random notes
not necessarily how we did it

## design
- infinite tasks: every time we close or finish a task, we add more tasks
- infinite zoom? would be hard to implement
- absurd tasks we cannot finish alone or in a lifetime
  - have timer set to some absurd date like 1000 years later
- text that scrolls forever when one interacts with it
- todo list that makes you procrastinate more?
- italian brainrot corner
- doomscrolling

## implementation
- wenyan "backend"/core, using the browser implementation
- svelte frontend cuz im an idiot
- other webassembly stuff cuz why not



## programmer's life
use this in the presentation
- forth was an annoying language to learn; we almost chose brainfuck though so thank god we didn't
  - it took a lot of effort getting the forth code to work without using variables
  - AI gen does not help with esoteric or old languages like forth lol
- forth was getting difficult to do, so I pivoted to wenyan and entropy.js
- Quoc implemented most of the frontend logic and the initial todo app logic, while I made the forth version of the backend
- 