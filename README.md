# Tractor

## Features:
  


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
  - allow custom dragndrop ordering of cards in hand?
  - create pre-config file for all the constants that change by device sizes/types (e.g. card sizes)

  - bidding stuff:
    - receive bottom ('originalBottom')
    - select return cards for bottom
    - send bottom back to deck ('newBottom')


### Backend:
  - seperate bidding and playing
    - create bidding class
      - determine finished bidding ('doneBid')
      - receive winner
      - set play order
    - playing round class
      - send bottom cards ('originalBottom')
      - receive bottom cards ('newBottom')
  
  - factor socket helpers into different file (e.g. socketUtils.js & listeners.js)
  - factor socket listeners into stages
    - stage 1: setup
    - stage 2: dealing + calling bottom
    - etc
    - **remove listeners from each stage once the stage is completed**