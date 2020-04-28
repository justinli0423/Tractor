# Tractor

## Todos:

### Frontend:
  - make horizontal scroll on vertical scroll wheel (when cards overflow)
  - scroll by touch
  - bid button
  - display the user that calls bottom by referencing ID (avoid overlapping bottom callers)
  - display other hands
  - display leftover card amount when dealing (broadcast) -> card back in the middle
  - organize the socket receivers into stages (function stage1()... function stagen() etc)
  - switch feature to allow user to select how to sort cards in hand
  - 

### Backend:
  - factor socket helpers into different file (e.g. socketUtils.js & listeners.js)
  - factor socket listeners into stages
    - stage 1: setup
    - stage 2: dealing + calling bottom
    - etc
    - **remove listeners from each stage once the stage is completed**