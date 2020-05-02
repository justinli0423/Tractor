# Tractor


## Todos:

### Frontend:
  - make horizontal scroll on vertical scroll wheel (when cards overflow)
  - scroll by touch
  - display other hands
  - organize the socket receivers into stages (function stage1()... function stagen() etc)
  - switch feature to allow user to select how to sort cards in hand
    - allow custom dragndrop ordering of cards in hand?
  - create pre-config file for all the constants that change by device sizes/types (e.g. card sizes)
  - create rooms
  - have a 'ready' button -> only start game when every player has clicked 'ready'
    - or first player is the "master" player -> they can start the rounds
  - allow for choosing teams? (easier for choosing display location)
  - refactor redux actions/selectors/reducer into proper files
  - support for other resolutions

  - custom backgrounds? way way later
  - load svgs before game starts to avoid render delay

  - refresh client when disconnected

  - auto emit done bid 
    - when no cards can be used to bid
    - when no cards can override the current bid

### Backend:
  - seperate bidding and playing
    - create bidding class
      - determine finished bidding ('doneBid')
      - receive winner
      - set play order
      - send bottom cards ('originalBottom')
    - playing round class
      - receive bottom cards ('newBottom')

  - auto generate trump if not called
    - if all 4 "finish bids" have been emitted and trump is undefined, random generate
      - using random generator to between p1 and p4
      - just redeal if no trump has been called? (should be almost no work)
  
  - store player hands
    - after dealing, split into singles and doubles?
      - highest single function
      - highest double function
      - highest tractor of len n function
      
  
  
  
  - factor socket helpers into different file (e.g. socketUtils.js & listeners.js)
  - factor socket listeners into stages
    - stage 1: setup
    - stage 2: dealing + calling bottom
    - etc
    - **remove listeners from each stage once the stage is completed**