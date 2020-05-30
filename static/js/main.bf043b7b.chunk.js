(this.webpackJsonpwebui=this.webpackJsonpwebui||[]).push([[0],{49:function(n,t,e){n.exports=e.p+"static/media/tractor_logo.e6e625d4.svg"},50:function(n,t,e){n.exports=e(93)},60:function(n,t,e){},90:function(n,t){},93:function(n,t,e){"use strict";e.r(t);var r=e(0),i=e.n(r),a=e(15),o=e.n(a),c=e(3),u=(e(60),e(1)),s=e(5),d=e(6),l=e(17),p=e(11),h=e(10),f=e(2),g=e(28),m=function(){function n(t){Object(s.a)(this,n),this.path="/Tractor/cardsSVG/",this.suits=[],this.jokers=[],this.cards=[],this.suitOrder={S:0,D:1,C:2,H:3},this.valueOrder={A:0,K:1,Q:2,J:3,10:4,9:5,8:6,7:7,6:8,5:9,4:10,3:11,2:12},this.suits=new Set(["H","C","S","D"]),this.jokers=new Set(["S","B"]),this.cards=new Set(["A","2","3","4","5","6","7","8","9","10","J","Q","K"])}return Object(d.a)(n,[{key:"isValidCard",value:function(n){if("J"===n[1])return this.jokers.has(n[0]);var t=this.cards.has(n[0]),e=this.suits.has(n[1]);return t&&e}},{key:"getSvg",value:function(n){return this.isValidCard(n)||console.log("Invalid card: ".concat(n)),"".concat(this.path).concat(n[0]).concat(n[1],".svg")}},{key:"isTrump",value:function(n){return n[0]===this.trump}},{key:"insertCard",value:function(n,t,e,r){var i={card:t,isSelected:!1,svg:this.getSvg(t)};if(r&&("D"===r?this.suitOrder.S=4:"C"===r?(this.suitOrder.C=0,this.suitOrder.S=2):"H"===r&&(this.suitOrder.H=-1)),n.length>0){var a=0;if("S"===t[0]||"J"===t[1])for(;a<n.length&&"B"===n[a].card[0]&&"J"===n[a].card[1];)a++;else if(t[0]===e){for(;a<n.length&&"J"===n[a].card[1];)a++;for(;a<n.length&&n[a].card[0]===e&&this.suitOrder[n[a].card[1]]<this.suitOrder[t[1]];)a++}else{for(;a<n.length&&("J"===n[a].card[1]||n[a].card[0]===e);)a++;for(;a<n.length&&this.suitOrder[n[a].card[1]]<this.suitOrder[t[1]];)a++;for(;a<n.length&&this.suitOrder[n[a].card[1]]===this.suitOrder[t[1]]&&this.valueOrder[n[a].card[0]]<this.valueOrder[t[0]];)a++}n.splice(a,0,i)}else n.push(i)}},{key:"sortHand",value:function(n,t,e){arguments.length>3&&void 0!==arguments[3]&&arguments[3];var r=[],i=[],a=[],o=[],c=[],u=[],s=[],d=[],l=[],p=[];return"S"===e||"J"===e?n:(n.forEach((function(n){var e=n.card;"J"===e[1]&&c.push(n),e[0]===t?("S"===e[1]&&s.push(n),"C"===e[1]&&l.push(n),"H"===e[1]&&d.push(n),"D"===e[1]&&u.push(n)):("S"===e[1]&&a.push(n),"C"===e[1]&&i.push(n),"H"===e[1]&&o.push(n),"D"===e[1]&&r.push(n))})),p=p.concat(c),"C"===e&&(p=p.concat(l,d,s,u,i,o,a,r)),"H"===e&&(p=p.concat(d,s,u,l,o,a,r,i)),"D"===e&&(p=p.concat(u,l,d,s,r,i,o,a)),console.log("sortedCards",p),p)}},{key:"newTrump",value:function(n,t,e,r,i){"J"===e[1]?(n[e[0]+"J"]+=1,2===n[e[0]+"J"]&&(!r||"J"!==r[1]||"S"===r[0]&&"B"===e[0])&&t.push(e)):e[0]===i&&(n[e[1]]+=1,(!r||1===r[0]&&2===n[e[1]])&&t.push([n[e[1]],e[1]]))}},{key:"updateBid",value:function(n,t,e){e.splice(0,e.length),1===n[0]&&2===t[n[1]]&&e.push([2,n[1]])}},{key:"receiveBid",value:function(n,t,e){e.splice(0,e.length),g.a.isEqual(n,["B","J"])||(2===t.BJ&&e.push(["B","J"]),g.a.isEqual(n,["S","J"])||(2===t.SJ&&e.push(["S","J"]),2!==n[0]&&(2===t.S&&e.push([2,"S"]),2===t.D&&e.push([2,"D"]),2===t.C&&e.push([2,"C"]),2===t.H&&e.push([2,"H"]))))}}]),n}(),b=e(45),v=e.n(b),S=null;function C(n,t,e,r){S=v()("tractorserver.herokuapp.com"),function(n,t,e){S.on("connectionStatus",(function(r){console.log("connected"),n(r,S.id,t,e)}))}(n,e,r),function(n,t,e){S.emit("setSocketId",n,t,e)}(e,r,t)}var y=function(n){return{appWidth:n.appWidth,appHeight:n.appHeight}},x=function(n){return n.clients},T=function(n){return n.clientIds},E=function(n){return n.numStateUpdated},k=function(n){return n.name},O=function(n){return n.id},B=function(n){return n.cards},j=function(n){return n.validBids},w=function(n){return n.currentBid},H=function(n){return n.trump},I=function(n){return n.trumpTracker},W=function(n){return n.numCardsSelected},_=function(n){return n.existingTricks},N=function(n){return n.currentClientTurn},R=function(n,t){return{type:"UPDATE_MY_HAND",payload:{trumpTracker:t,cards:n}}},D=function(n,t){return{type:"SET_CURRENT_BID",payload:{socketId:n,bid:t}}},U=function(n){return{type:"CAN_SELECT_CARDS",payload:n}},J=function(n){return{type:"UPDATE_NUM_CARDS_SELECTED",payload:n}},M=function(n){return{type:"TOGGLE_BID_BUTTONS",payload:n}},P=function(n){return{type:"SET_CLIENT_TURN",payload:n}},L=function(n){return{type:"SET_ALL_TRICKS",payload:n}},z=function(n){return{type:"TOGGLE_NEW_ROUND",payload:n}};function A(){var n=Object(u.a)(["\n  z-index: ",";\n  display: flex;\n  align-items: flex-end;\n  height: ",";\n\n  &:not(:first-child) {\n    /* margin-left: ","; */\n    margin-left: ",";\n  }\n\n  &:hover "," {\n    z-index: 100;\n    transform: ","\n  }\n"]);return A=function(){return n},n}function V(){var n=Object(u.a)(["\n  flex-shrink: 0;\n  width: 50px;\n  height: 75px;\n"]);return V=function(){return n},n}function F(){var n=Object(u.a)(["\n  z-index: ",";\n  display: flex;\n  align-items: flex-end;\n  \n  &:not(:first-child) {\n    margin-left: -30px;\n  }\n"]);return F=function(){return n},n}function G(){var n=Object(u.a)(["\n  display: flex;\n  flex-direction: row;\n  width: ",";\n  justify-content: ",";\n  overflow: ",";\n"]);return G=function(){return n},n}function Y(){var n=Object(u.a)(["\n  flex-shrink: 0;\n  width: ",";\n  height: ",";\n  transform: ",";\n"]);return Y=function(){return n},n}function K(){var n=Object(u.a)(["\n  position: fixed;\n  display: flex;\n  bottom: 40px;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  /* width: 1800px; */\n  /* height: ","; */\n"]);return K=function(){return n},n}var X=new m("/cardsSVG/"),q=function(n){Object(p.a)(e,n);var t=Object(h.a)(e);function e(n){var r;return Object(s.a)(this,e),(r=t.call(this,n)).state={cardWidth:120,cardHeight:168,cardSelectedHeight:-30,cardHoveredHeight:-50,numCardsForBottom:0},r}return Object(d.a)(e,[{key:"componentDidMount",value:function(){this.setStage1Listeners(),this.setCardSize()}},{key:"setStage1Listeners",value:function(){var n,t,e,r,i,a,o,c;n=this.props.setTrumpValue.bind(this),S.on("setTrumpValue",(function(t){return n(t)})),t=this.setCards.bind(this),S.on("dealCard",t),e=this.updateBidStatus.bind(this),S.on("setNewBid",(function(n,t){return e(n,t)})),r=this.receiveHiddenBottom.bind(this),S.on("hiddenBottom",(function(n){return r(n)})),function(n){S.on("originalBottom",(function(t){return n(t)}))}(this.receiveBottomCards.bind(this)),i=this.sortHand.bind(this),S.on("bidWon",i),a=this.getPoints.bind(this),S.on("opponentPoints",(function(n){return a(n)})),o=this.getCurrentWinner.bind(this),S.on("currentWinner",(function(n){o(n),console.log(n)})),c=this.startNewRound.bind(this),S.on("newRound",c),this.setCardSize()}},{key:"startNewRound",value:function(){var n=this.props,t=n.setCurrentBid,e=n.setClientTurn,r=n.setTricksPlayed,i=n.setPoints,a=n.toggleBidButtons,o=n.setValidBids,c=n.setCurrentTrickWinner,u=n.setCanStartRound,s=n.updateCardsInHand;t("",null),s([],{S:0,D:0,C:0,H:0,SJ:0,BJ:0}),o([]),e(null),r({}),u(!1),c("nobody"),i(0),a(!0),console.log("resetting round")}},{key:"getCurrentWinner",value:function(n){console.log("current trick winner",n),this.props.setCurrentTrickWinner(n)}},{key:"sortHand",value:function(){var n=this.props,t=n.cards,e=n.currentBid,r=n.trumpTracker,i=n.trumpValue;this.props.updateCardsInHand(X.sortHand(t,i,e[1]),r)}},{key:"getPoints",value:function(n){this.props.setPoints(n)}},{key:"setCardSize",value:function(){var n,t,e,r,i=this.props,a=i.appWidth;2560===a&&(n=204,t=286,r=-70,e=-90),1920===a&&(n=120,t=168,r=-30,e=-50),1280===a&&(n=110,t=148,r=-30,e=-50),i.appHeight>a&&(n=80,t=120,r=-20,e=-40),this.setState({cardWidth:n,cardHeight:t,cardHoveredHeight:e,cardSelectedHeight:r})}},{key:"setCards",value:function(n){var t=this.props,e=t.cards,r=t.trumpValue,i=t.trumpTracker,a=t.validBids,o=t.currentBid,c=t.setValidBids,u=t.updateCardsInHand;X.insertCard(e,n,r,o),X.newTrump(i,a,n,o,r),c(a),u(e,i)}},{key:"receiveBottomCards",value:function(n){var t=this;n.forEach((function(n){t.setCards(n)})),this.props.toggleCardSelector(!0),this.props.toggleBidButtons(!1)}},{key:"receiveHiddenBottom",value:function(n){var t=this;n.forEach((function(n){t.setCards(n)})),this.props.toggleCardSelector(!1),this.props.toggleBidButtons(!1),this.props.setCanStartRound(!0)}},{key:"toggleSingleCard",value:function(n){var t=this.props,e=t.cards,r=t.numCardsSelected,i=e[n].isSelected;i?this.props.updateNumCardsSelected(r-1):this.props.updateNumCardsSelected(r+1),e[n].isSelected=!i}},{key:"toggleCards",value:function(n){var t=this.props,e=t.cards,r=t.trumpTracker,i=t.canSelectCards,a=t.numCardsSelected,o=e[n].isSelected;console.log("canToggleCards",i),e.length>25&&!o&&8===a?window.alert("Maximum cards for bottom selected"):(this.toggleSingleCard(n),this.props.updateCardsInHand(e,r))}},{key:"getExistingTrickSvg",value:function(){var n=this.props,t=n.myId,e=n.existingTricks;return e&&e[t]?e[t].map((function(n){return X.getSvg(n)})):[]}},{key:"updateBidStatus",value:function(n,t){var e=this.props,r=e.trumpTracker,i=e.validBids;X.receiveBid(t,r,i),this.props.setCurrentBid(n,t)}},{key:"render",value:function(){var n=this,t=this.props,e=t.cards,r=t.numCards,a=t.appWidth,o=t.appHeight,c=this.state,u=c.cardWidth,s=c.cardHeight,d=c.cardSelectedHeight,l=c.cardHoveredHeight;return i.a.createElement(Q,{height:s},i.a.createElement($,null,this.getExistingTrickSvg().map((function(n,t){return i.a.createElement(nn,{zIndex:t},i.a.createElement(tn,{draggable:!1,width:u,height:s,src:n,key:t}))}))),i.a.createElement($,{isMobile:o>a},e.map((function(t,e){return i.a.createElement(en,{height:s,onClick:function(){n.toggleCards(e)},numCards:r,cardWidth:u,cardHoveredHeight:l,zIndex:e},i.a.createElement(Z,{draggable:!1,width:u,height:s,isSelected:t.isSelected,cardSelectedHeight:d,src:t.svg,key:e}))}))))}}]),e}(r.Component),Q=f.b.div(K(),(function(n){return"".concat(1.8*n.height,"px")})),Z=f.b.img(Y(),(function(n){return"".concat(n.width,"px")}),(function(n){return"".concat(n.height,"px")}),(function(n){return n.isSelected&&"translateY(".concat(n.cardSelectedHeight,"px);")})),$=f.b.div(G(),(function(n){return n.isMobile&&"80vw"}),(function(n){return n.isMobile&&"right"}),(function(n){return n.isMobile&&"scroll"})),nn=f.b.span(F(),(function(n){return n.zIndex})),tn=f.b.img(V()),en=f.b.span(A(),(function(n){return n.zIndex}),(function(n){return"".concat(n.height+Math.abs(n.cardHoveredHeight),"px")}),(function(n){return"-".concat(2.3*n.numCards,"px")}),(function(n){return"-".concat(.7*n.cardWidth,"px")}),Z,(function(n){return"translateY(".concat(n.cardHoveredHeight,"px);")})),rn=Object(c.b)((function(n){var t=O(n),e=B(n),r=x(n),i=_(n),a=w(n),o=H(n),c=I(n),u=j(n),s=function(n){return n.canSelectCards}(n),d=W(n),l=y(n),p=l.appWidth,h=l.appHeight;return{myId:t,cards:e,numCards:e.length,connectedClients:r,existingTricks:i,appWidth:p,appHeight:h,canSelectCards:s,numCardsSelected:d,currentBid:a,trumpValue:o,trumpTracker:c,validBids:u,changeState:E(n)}}),{updateCardsInHand:R,setValidBids:function(n){return{type:"SET_VALID_BIDS",payload:n}},setCurrentTrickWinner:function(n){return{type:"SET_CURRENT_TRICK_WINNER",payload:n}},setTrumpValue:function(n){return{type:"SET_TRUMP_VALUE",payload:n}},updateNumCardsSelected:J,toggleCardSelector:U,setCanStartRound:z,setPoints:function(n){return{type:"SET_POINTS",payload:n}},toggleBidButtons:M,setClientTurn:P,setTricksPlayed:L,setCurrentBid:D})(q);function an(){var n=Object(u.a)(['\n  padding: 0 5px;\n  font-size: 14px;\n  font-weight: 400;\n  text-indent: -2px;\n\n  &::before {\n    content: "\ud83d\ude9c ";\n  }\n']);return an=function(){return n},n}function on(){var n=Object(u.a)(["\n  padding-bottom: 5px;\n  font-weight: 500;\n"]);return on=function(){return n},n}function cn(){var n=Object(u.a)(["\n  position: fixed;\n  transform: ",";\n  top: ",";\n  right: 0;\n  padding: 10px 30px 10px 10px;\n  margin: 5px;\n  width: 150px;\n  border-radius: 5px;\n  background-color: rgba(0,0,0, .20);\n  color: rgba(255, 255, 255, .6);\n  font-size: 18px;\n  list-style: none;\n"]);return cn=function(){return n},n}var un=f.b.ul(cn(),(function(n){return n.isMobile?"":"translateX(-25%)"}),(function(n){return n.isMobile?"145px":"10px"})),sn=f.b.div(on()),dn=f.b.li(an()),ln=Object(c.b)((function(n){var t=O(n),e=k(n),r=x(n),i=T(n),a=function(n){return n.room}(n),o=y(n);return{myId:t,name:e,clients:r,roomName:a,appWidth:o.appWidth,appHeight:o.appHeight,clientTurn:N(n),clientIds:i,numStateChanges:E(n)}}))((function(n){var t=n.myId,e=n.name,a=n.appHeight,o=n.appWidth,c=n.clientIds,u=n.roomName,s=n.clients;Object(r.useEffect)((function(){document.title=e}));return i.a.createElement(un,{isMobile:a>o},i.a.createElement(sn,null,"PLAYERS (",u,")"),c.map((function(e){return i.a.createElement(dn,{key:e},function(e){var r="";return n.clientTurn===e&&(r="Waiting for "),r+=e===t?"you":s[e]}(e))})))}));function pn(){var n=Object(u.a)(["\n  display: inline-block;\n  font-family: 'Roboto';\n  font-weight: 400;\n  margin: ",";\n  outline: none;\n  border: transparent 2px solid;\n  border-radius: 2px;\n  padding: 0 10px;\n  height: 25px; \n  width: auto;\n  background-color: rgba(240,240,240, 1);\n  transition: all .1s linear;\n  cursor: pointer;\n\n  &:hover {\n    background-color: rgba(240,240,240, .8);\n  }\n"]);return pn=function(){return n},n}var hn=f.b.button(pn(),(function(n){return n.margin||"7px"})),fn=function(n){return i.a.createElement(hn,{id:n.id,margin:n.margin,onClick:function(){return n.onClickCb&&n.onClickCb()},disabled:void 0!==n.disabled&&n.disabled},n.label)};function gn(){var n=Object(u.a)(["\n  margin: 0 5px;\n  width: ",";\n  height: ",";\n  \n  &:nth-child(n + 2) {\n    margin: 0 -20px;\n  }\n"]);return gn=function(){return n},n}function mn(){var n=Object(u.a)(['\n  display: flex;\n  align-items: center;\n  margin-bottom: 10px;\n  padding: 0 5px;\n  font-size: 14px;\n  font-weight: 400;\n  text-indent: -2px;\n\n  &::before {\n    content: "\ud83d\ude9c ";\n  }\n']);return mn=function(){return n},n}function bn(){var n=Object(u.a)(["\n  padding-bottom: 5px;\n  font-weight: 500;\n"]);return bn=function(){return n},n}function vn(){var n=Object(u.a)(["\n  position: fixed;\n  box-sizing: border-box;\n  transform: ",";\n  top: ",";\n  left: 0;\n  margin: 5px;\n  padding: 10px 30px 10px 10px;\n  width: ",";\n  border-radius: 5px;\n  background-color: rgba(0,0,0, .20);\n  color: rgba(255, 255, 255, .6);\n  font-size: 18px;\n  list-style: none;\n"]);return vn=function(){return n},n}var Sn=function(n){Object(p.a)(e,n);var t=Object(h.a)(e);function e(n){var r;return Object(s.a)(this,e),(r=t.call(this,n)).state={bidHistory:[],updateComponent:0},r}return Object(d.a)(e,[{key:"componentDidUpdate",value:function(n){var t=this,e=this.props,r=e.currentBid,i=e.currentBottomClient,a=this.state,o=a.bidHistory,c=a.updateComponent,u=n.currentBottomClient,s=n.currentBid;JSON.stringify(s)===JSON.stringify(r)&&JSON.stringify(i)===JSON.stringify(u)||(r&&0!==r.length?(o.push([i,r]),this.setState({bidHistory:o}),u&&setTimeout((function(){o.shift(),t.setState({bidHistory:o,updateComponent:c+1})}),5e3)):this.setState({bidHistory:[]}))}},{key:"getTrumpCardSvgs",value:function(n){var t,e=this.props,r=e.trumpValue,a=e.appWidth,o=e.appHeight,c=new m("/cardsSVG/"),u=[];if(n&&n.length)if("J"===n[1]){t=c.getSvg(n);for(var s=0;s<2;s++)u.push(i.a.createElement(Tn,{isMobile:o>a,src:t}))}else{t=c.getSvg([r,n[1]]);for(var d=0;d<n[0];d++)u.push(i.a.createElement(Tn,{isMobile:o>a,src:t}))}return u}},{key:"render",value:function(){var n=this,t=this.props,e=t.clients,r=t.appHeight,a=t.appWidth,o=t.points,c=t.canStartNewRound,u=t.setCanStartRound,s=this.state.bidHistory;return i.a.createElement(Cn,{isMobile:r>a},c&&i.a.createElement(fn,{margin:"2px 0 7px",label:"Start Round",onClickCb:function(){console.log("STARTING NEW ROUND"),S.emit("startNewRound"),u(!1)}}),i.a.createElement(yn,null,"POINTS: ",o),i.a.createElement(yn,null,"TRUMP"),s.length?s.map((function(t){return i.a.createElement(xn,null,e[t[0]],": ",n.getTrumpCardSvgs(t[1]))})):"Undetermined")}}]),e}(r.Component),Cn=f.b.ul(vn(),(function(n){return n.isMobile?"":"translateX(25%)"}),(function(n){return n.isMobile?"145px":"10px"}),(function(n){return n.isMobile?"150px":"200px"})),yn=f.b.div(bn()),xn=f.b.li(mn()),Tn=f.b.img(gn(),(function(n){return n.isMobile?"30px":"40px"}),(function(n){return n.isMobile?"40px":"60px"})),En=Object(c.b)((function(n){var t=x(n),e=function(n){return n.currentBottomClient}(n),r=w(n),i=function(n){return n.points}(n),a=H(n),o=function(n){return n.canStartNewRound}(n),c=y(n),u=c.appWidth,s=c.appHeight;return{clients:t,myCards:B(n),currentBid:r,appWidth:u,appHeight:s,trumpValue:a,canStartNewRound:o,points:i,currentBottomClient:e,numStateChanges:E(n)}}),{setCanStartRound:z})(Sn);function kn(){var n=Object(u.a)(["\n  padding-left: 5px;\n  font-size: 20px;\n  color: red;\n  filter: ",";\n"]);return kn=function(){return n},n}function On(){var n=Object(u.a)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  margin: 5px;\n  padding: 0;\n  border-radius: 5px;\n  height: 40px;\n  width: 105px;\n"]);return On=function(){return n},n}var Bn=Object(f.b)(hn)(On()),jn=f.b.span(kn(),(function(n){return"black"===n.color&&"grayscale(1)"})),wn=function(n){return i.a.createElement(Bn,{onClick:function(){return n.onClickCb(n.bid)}},i.a.createElement("span",null,n.label),i.a.createElement(jn,{color:n.color,dangerouslySetInnerHTML:{__html:n.icon}}))},Hn={H:"&#9825;",S:"&#9828;",C:"&#9831;",D:"&#9826;",SJ:"&#127183;",BJ:"&#127183;"};function In(){var n=Object(u.a)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: ",";\n  max-width: ",";\n  margin: 10px;\n  height: 40px;\n"]);return In=function(){return n},n}function Wn(){var n=Object(u.a)(["\n  z-index: 100;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n"]);return Wn=function(){return n},n}var _n=new m,Nn=f.b.div(Wn()),Rn=f.b.div(In(),(function(n){return n.isMobile&&"1"}),(function(n){return n.isMobile&&"80%"})),Dn=Object(c.b)((function(n){var t=k(n),e=O(n),r=j(n),i=H(n),a=I(n),o=function(n){return n.canBidForBottom}(n),c=w(n),u=y(n),s=u.appWidth,d=u.appHeight,l=N(n);return{myId:e,name:t,cards:B(n),appWidth:s,appHeight:d,validBids:r,clientTurnId:l,currentBid:c,trumpValue:i,canBidForBottom:o,trumpTracker:a,numCardsSelected:W(n),numUpdateStates:E(n)}}),{toggleBidButtons:M,updateCardsInHand:R,toggleCardSelector:U,setTricksPlayed:L,setClientTurn:P,setCurrentBid:D,updateNumCardsSelected:J})((function(n){var t=function(t){var e=n.myId,r=n.trumpTracker,i=n.validBids;!function(n){S.emit("newBid",n)}(t),n.setCurrentBid(e,t),_n.updateBid(t,r,i)},e=function(){var t,e,i,c=n.cards,u=n.trumpTracker;S.emit("doneBid"),n.toggleBidButtons(!1),t=a,S.on("nextClient",(function(n){t(n)})),e=o,S.on("cardsPlayed",(function(n){console.log("Received current tricks",n),e(n)})),i=r,S.on("generateTrump",(function(n,t){return i(n,t)})),R(c,u)},r=function(t,e){n.setCurrentBid(t,e)},a=function(t){var e=n.myId,r=n.setClientTurn,i=n.toggleCardSelector;r(t),console.log("enableTurnsListener","".concat(t,"'s turn")),i(e===t)},o=function(t){n.setTricksPlayed(t)},c=function(){var t,e=n.cards,r=n.trumpTracker,i=n.updateCardsInHand,a=n.toggleCardSelector,o=n.updateNumCardsSelected,c=[],u=[];e.forEach((function(n){n.isSelected?c.push(n.card):u.push(n)})),console.log("cards sent back for bottom",c),i(u,r),a(!1),o(0),t=c,console.log(S.id,"returning bottom",t),S.emit("newBottom",t)},u=function(t,e){var r=n.cards,i=n.updateCardsInHand,a=n.trumpTracker,o=n.toggleCardSelector,c=n.trumpValue,u=n.currentBid,s=n.updateNumCardsSelected;if("valid"===t)i(e,a),o(!1),s(0);else if("invalid"===t)alert("Invalid Trick"),i(r.map((function(n){return n.isSelected=!1,n})),a);else if("badThrow"===t){var d=[];alert("Bad Throw"),e.forEach((function(n){console.log(n,n.card),_n.insertCard(d,n.card,c,u[1])})),i(d,a)}},s=function(){var t=n.cards,e=[],r=[];t.forEach((function(n){n.isSelected?e.push(n.card):r.push(n)})),function(n,t,e){S.emit("clientPlay",n,t,e)}(e,r,u)};return i.a.createElement(Nn,null,i.a.createElement(Rn,{isMobile:n.appHeight>n.appWidth},n.canBidForBottom&&function(){var t=n.validBids,e=[];return t.forEach((function(n){var t={rawData:n};"J"===n[1]?e.push(Object.assign({},t,{renderData:"S"===n[0]?["No Trump","SJ"]:["No Trump","BJ"],color:"S"===n[0]?"black":"red"})):e.push(Object.assign({},t,{renderData:[n[0],n[1]],color:"S"===n[1]||"C"===n[1]?"black":"red"}))})),e}().map((function(n,e){return i.a.createElement(wn,{bid:n.rawData,label:n.renderData[0],icon:Hn[n.renderData[1]]||"",color:n.color,onClickCb:t,key:e})}))),i.a.createElement("span",null,n.canBidForBottom&&i.a.createElement(fn,{id:"finishBidBtn",label:"Finish Bid",onClickCb:e}),8===n.numCardsSelected&&n.cards.length>25&&i.a.createElement(fn,{id:"finishBottomBtn",label:"Finish Bottom",onClickCb:c}),n.clientTurnId===n.myId&&!!n.numCardsSelected&&i.a.createElement(fn,{id:"finishTrickBtn",label:"Finish Trick",onClickCb:s})))}));function Un(){var n=Object(u.a)(["\n  z-index: 0;\n  position: absolute;\n  display: ",";\n  align-items: center;\n  justify-content: center;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  background-color: transparent;\n  color: rgba(255, 255, 255, .1);\n  font-size: 20rem;\n"]);return Un=function(){return n},n}function Jn(){var n=Object(u.a)(["animation: "," 1s linear infinite"]);return Jn=function(){return n},n}function Mn(){var n=Object(u.a)(["\n  top: 50%;\n  right: 0;\n  transform: translateY(-50%);\n  border: ",";\n  margin-right: 30px;\n  ",";\n"]);return Mn=function(){return n},n}function Pn(){var n=Object(u.a)(["animation: "," 1s linear infinite"]);return Pn=function(){return n},n}function Ln(){var n=Object(u.a)(["\n  top: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  border: ",";\n  margin-top: 30px;\n  ",";\n"]);return Ln=function(){return n},n}function zn(){var n=Object(u.a)(["animation: "," 1s linear infinite"]);return zn=function(){return n},n}function An(){var n=Object(u.a)(["\n  top: 50%;\n  left: 0;\n  transform: translateY(-50%);\n  border: ",";\n  margin-left: 30px;\n  ",";\n"]);return An=function(){return n},n}function Vn(){var n=Object(u.a)(["\n  margin-right: 30px;\n"]);return Vn=function(){return n},n}function Fn(){var n=Object(u.a)(["\n  margin: 0 5px;\n  width: ",";\n  height: ",";\n  \n  &:nth-child(n + 2) {\n    margin: 0 -20px;\n  }\n"]);return Fn=function(){return n},n}function Gn(){var n=Object(u.a)(["\n  position: fixed;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  width: auto;\n  min-width: 200px;\n  height: 90px;\n  padding: 10px 30px 10px 10px;\n  border-radius: 5px;\n  font-size: 24px;\n  background-color: rgba(0,0,0, .20);\n  color: rgba(255, 255, 255, .6);\n"]);return Gn=function(){return n},n}function Yn(){var n=Object(u.a)(["\n  position: fixed;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  top: 0;\n  height: 130px;\n  width: 100%;\n\n  div {\n    position: unset;\n    width: 25%;\n    min-width: auto;\n    height: 120px;\n    transform: none;\n    margin: 5px;\n    font-size: 12px;\n  }\n"]);return Yn=function(){return n},n}function Kn(){var n=Object(u.a)(["\n  0% {\n    background-color: rgba(0,0,0, .30);\n  }\n\n  50% {\n    background-color: rgba(0,0,0, .10);\n  }\n  \n  100% {\n    background-color: rgba(0,0,0, .30);\n  }\n"]);return Kn=function(){return n},n}var Xn=Object(f.c)(Kn()),qn=f.b.div(Yn()),Qn=f.b.div(Gn()),Zn=f.b.img(Fn(),(function(n){return n.isMobile?"30px":"60px"}),(function(n){return n.isMobile?"50px":"90px"})),$n=f.b.span(Vn()),nt=Object(f.b)(Qn)(An(),(function(n){return n.clientTurn&&n.myId===n.clientTurn?"2px solid red":"2px solid transparent"}),(function(n){return n.curWinner===n.myId?Object(f.a)(zn(),Xn):""})),tt=Object(f.b)(Qn)(Ln(),(function(n){return n.clientTurn&&n.myId===n.clientTurn?"2px solid red":"2px solid transparent"}),(function(n){return n.curWinner===n.myId?Object(f.a)(Pn(),Xn):""})),et=Object(f.b)(Qn)(Mn(),(function(n){return n.clientTurn&&n.myId===n.clientTurn?"2px solid red":"2px solid transparent"}),(function(n){return n.curWinner===n.myId?Object(f.a)(Jn(),Xn):""})),rt=f.b.div(Un(),(function(n){return n.myId===n.clientTurn?"flex":"none"})),it=Object(c.b)((function(n){var t=O(n),e=x(n),r=T(n),i=_(n),a=N(n),o=function(n){return n.currentTrickWinner}(n),c=y(n);return{myId:t,clients:e,clientIds:r,currentTrickWinner:o,currentClientTurn:a,existingTricks:i,appWidth:c.appWidth,appHeight:c.appHeight,updateNumState:E(n)}}))((function(n){for(var t=n.myId,e=n.clients,r=n.clientIds,a=n.appWidth,o=n.appHeight,c=n.existingTricks,u=n.currentClientTurn,s=n.currentTrickWinner,d=[],l=r.indexOf(t),p=1;p<4;p++)d.push(r[(l+p)%4]);var h=function(n){var t,r=new m("/cardsSVG/"),l=d[n],p=e[l],h=c[l],f=[];return h&&h.length>0&&h.forEach((function(n){t=r.getSvg(n),f.push(i.a.createElement(Zn,{isMobile:o>a,src:t}))})),0===n?function(n,t,e){return i.a.createElement(nt,{curWinner:s,clientTurn:u,myId:t,appWidth:a},d[0]?i.a.createElement(i.a.Fragment,null,i.a.createElement($n,null,n,":"),e):"Waiting for Player...")}(p,l,f):1===n?function(n,t,e){return i.a.createElement(tt,{curWinner:s,clientTurn:u,myId:t,appWidth:a},d[1]?i.a.createElement(i.a.Fragment,null,i.a.createElement($n,null,n,":"),e):"Waiting for Player...")}(p,l,f):function(n,t,e){return i.a.createElement(et,{curWinner:s,clientTurn:u,myId:t,appWidth:a},d[2]?i.a.createElement(i.a.Fragment,null,i.a.createElement($n,null,n,":"),e):"Waiting for Player...")}(p,l,f)};return i.a.createElement(i.a.Fragment,null,i.a.createElement(rt,{myId:t,clientTurn:u},"Go"),o>a?i.a.createElement(qn,null,h(0),h(1),h(2)):i.a.createElement(i.a.Fragment,null,h(0),h(1),h(2)))})),at=e(49),ot=e.n(at);function ct(){var n=Object(u.a)(["\n  width: ",";\n"]);return ct=function(){return n},n}function ut(){var n=Object(u.a)(["\n  margin: 5px 15px;\n  padding: 7px 10px;\n  outline: none;\n  border: transparent 2px solid;\n  border-radius: 2px 2px 0 0;\n  width: ",";\n  height: 15px;\n  background-color: darkgreen;\n  color: rgba(255, 255, 255, .9);\n  transition: all .3s cubic-bezier(0.65, 0, 0.35, 1);\n\n  &::placeholder {\n    color: rgba(255, 255, 255, .7);\n  }\n\n  &:focus, &:active {\n    border-bottom: rgba(255, 255, 255, .7) 2px solid;\n  }\n"]);return ut=function(){return n},n}function st(){var n=Object(u.a)(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"]);return st=function(){return n},n}function dt(){var n=Object(u.a)(["\n  margin: 5px;\n  padding: 0;\n"]);return dt=function(){return n},n}function lt(){var n=Object(u.a)(["\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: ",";\n  height: ",";\n  background-color: green;\n"]);return lt=function(){return n},n}var pt=function(n){Object(p.a)(e,n);var t=Object(h.a)(e);function e(n){var r;return Object(s.a)(this,e),(r=t.call(this,n)).state={connectionStatus:!1,isConnecting:!1,iconWidth:150,inputWidth:100},window.addEventListener("resize",r.setAppSizes.bind(Object(l.a)(r))),r}return Object(d.a)(e,[{key:"componentDidMount",value:function(){this.setAppSizes()}},{key:"setAppSizes",value:function(){var n,t,e,r,i=window.innerWidth,a=window.innerHeight;i>=2560&&a>=1440?(n=2560,t=1440,e=250,r=200):i>=1920&&a>=1080?(n=1920,t=1080,e=150,r=130):i<a?(n=i,t=a,e=150,r=130):(n=1280,t=720,e=150,r=130),this.props.setScreenSize(n,t),this.setState({iconWidth:e,inputWidth:r})}},{key:"setConnectionStatus",value:function(n,t,e,r){var i;this.setState({connectionStatus:n}),n&&(i=this.setConnectedClients.bind(this),S.on("newClientConnection",i),this.props.setUser(e,t,r))}},{key:"setConnectedClients",value:function(n){this.props.updateClientList(n)}},{key:"joinRoomValidator",value:function(n){n||(alert("Room is full."),this.setState({connectionStatus:!1})),this.setState({isConnecting:!1})}},{key:"connect",value:function(n){n.preventDefault();var t=this.nameRef.value,e=this.roomRef.value;t?e?(t.length>7&&(t=t.slice(0,7)),this.setState({isConnecting:!0}),C(this.setConnectionStatus.bind(this),this.joinRoomValidator.bind(this),t,e.toLowerCase())):alert("enter a room"):alert("enter a name")}},{key:"renderPreConnection",value:function(){var n=this,t=this.props,e=t.appHeight,r=t.appWidth,a=this.state,o=a.iconWidth,c=a.inputWidth,u=a.isConnecting;return i.a.createElement(ht,{width:r,height:e},i.a.createElement(ft,null,i.a.createElement(bt,{iconWidth:o,src:ot.a,draggable:!1})),i.a.createElement(gt,{onSubmit:function(t){n.connect(t)}},i.a.createElement(mt,{autoFocus:!0,placeholder:"Enter a name!",inputWidth:c,ref:function(t){n.nameRef=t}}),i.a.createElement(mt,{placeholder:"Enter a room code!",inputWidth:c,ref:function(t){n.roomRef=t}}),i.a.createElement(fn,{label:"Join",disabled:u})))}},{key:"renderPostConnection",value:function(){var n=this.props,t=n.appHeight,e=n.appWidth;return i.a.createElement(ht,{width:e,height:t},i.a.createElement(it,null),i.a.createElement(En,null),i.a.createElement(ln,null),i.a.createElement(Dn,null),i.a.createElement(rn,null))}},{key:"render",value:function(){return this.state.connectionStatus?this.renderPostConnection():this.renderPreConnection()}}]),e}(r.Component),ht=f.b.div(lt(),(function(n){return"".concat(n.width,"px")}),(function(n){return"".concat(n.height,"px")})),ft=f.b.h1(dt()),gt=f.b.form(st()),mt=f.b.input(ut(),(function(n){return"".concat(n.inputWidth,"px")})),bt=f.b.img(ct(),(function(n){return"".concat(n.iconWidth,"px")})),vt=Object(c.b)((function(n){var t=k(n),e=E(n),r=y(n);return{name:t,appWidth:r.appWidth,appHeight:r.appHeight,numStateChanges:e}}),{updateClientList:function(n){return{type:"UPDATE_CLIENT_LIST",payload:{clients:n,clientIds:Object.keys(n)}}},setScreenSize:function(n,t){return{type:"SET_SCREEN_SIZE",payload:{width:n,height:t}}},setUser:function(n,t,e){return{type:"SET_USER",payload:{name:n,id:t,room:e}}}})(pt);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var St=e(16),Ct={appWidth:1920,appHeight:1080,socket:{connected:!1},clients:{},clientIds:[],name:"",id:"",cards:[],trump:"2",room:"",currentBid:null,currentTrickWinner:"nobody",currentBottomClient:null,currentClientTurn:null,existingTricks:{},trumpTracker:{S:0,D:0,C:0,H:0,SJ:0,BJ:0},validBids:[],points:0,canSelectCards:!1,numCardsSelected:0,canBidForBottom:!1,cardsPlayed:[],canStartNewRound:!1,numStateUpdated:0},yt=Object(St.b)((function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Ct,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SET_SCREEN_SIZE":return Object.assign({},n,{appWidth:t.payload.width,appHeight:t.payload.height});case"UPDATE_CLIENT_LIST":return Object.assign({},n,{clients:t.payload.clients,clientIds:t.payload.clientIds,numStateUpdated:n.numStateUpdated+1});case"SET_USER":return console.log(t.payload),Object.assign({},n,{name:t.payload.name,room:t.payload.room,id:t.payload.id});case"SET_DECLARER":return console.log(t.payload),Object.assign({},n,{currentBottomClient:n.clients[t.payload]});case"UPDATE_MY_HAND":return Object.assign({},n,{cards:t.payload.cards,trumpTracker:t.payload.trumpTracker,numStateUpdated:n.numStateUpdated+1});case"SET_VALID_BIDS":return Object.assign({},n,{validBids:t.payload,numStateUpdated:n.numStateUpdated+1});case"SET_TRUMP_VALUE":return Object.assign({},n,{trump:t.payload});case"SET_CURRENT_BID":return Object.assign({},n,{currentBid:t.payload.bid,currentBottomClient:t.payload.socketId,numStateUpdated:n.numStateUpdated+1});case"CAN_SELECT_CARDS":return Object.assign({},n,{canSelectCards:t.payload});case"UPDATE_NUM_CARDS_SELECTED":return Object.assign({},n,{numCardsSelected:t.payload});case"TOGGLE_BID_BUTTONS":return Object.assign({},n,{canBidForBottom:t.payload});case"SET_CLIENT_TURN":return Object.assign({},n,{currentClientTurn:t.payload});case"SET_ALL_TRICKS":return Object.assign({},n,{existingTricks:t.payload,numStateUpdated:n.numStateUpdated+1});case"SET_POINTS":return Object.assign({},n,{points:t.payload});case"SET_CURRENT_TRICK_WINNER":return Object.assign({},n,{currentTrickWinner:t.payload});case"TOGGLE_NEW_ROUND":return Object.assign({},n,{canStartNewRound:t.payload});default:return n}}));o.a.render(i.a.createElement(c.a,{store:yt},i.a.createElement(vt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(n){n.unregister()})).catch((function(n){console.error(n.message)}))}},[[50,1,2]]]);
//# sourceMappingURL=main.bf043b7b.chunk.js.map