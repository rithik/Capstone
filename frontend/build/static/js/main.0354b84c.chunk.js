(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{113:function(e,t,n){},285:function(e,t,n){e.exports=n(442)},290:function(e,t,n){},296:function(e,t){},298:function(e,t){},310:function(e,t){},312:function(e,t){},338:function(e,t){},340:function(e,t){},341:function(e,t){},347:function(e,t){},349:function(e,t){},367:function(e,t){},369:function(e,t){},381:function(e,t){},384:function(e,t){},442:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(25),o=n.n(c),i=(n(290),n(18)),u=(n(113),n(19)),s=n(30),l=n(46),p=n.n(l),m=n(79),b=n(123),d=n.n(b);function g(e){return String.fromCharCode.apply(null,Array.from(new Uint8Array(e)))}function f(e){return y.apply(this,arguments)}function y(){return(y=Object(m.a)(p.a.mark((function e(t){var n,a,r,c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.exportKey("spki",t);case 2:return n=e.sent,a=g(n),r=window.btoa(a),c="-----BEGIN PUBLIC KEY-----\n".concat(r,"\n-----END PUBLIC KEY-----"),e.abrupt("return",c);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function v(e){return h.apply(this,arguments)}function h(){return(h=Object(m.a)(p.a.mark((function e(t){var n,a,r,c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.exportKey("pkcs8",t);case 2:return n=e.sent,a=g(n),r=window.btoa(a),c="-----BEGIN PRIVATE KEY-----\n".concat(r,"\n-----END PRIVATE KEY-----"),e.abrupt("return",c);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function O(){return(O=Object(m.a)(p.a.mark((function e(t){var n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"RSA-OAEP",modulusLength:8192,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["encrypt","decrypt"]).then(function(){var e=Object(m.a)(p.a.mark((function e(n){var a,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f(n.publicKey);case 2:return a=e.sent,e.next=5,v(n.privateKey);case 5:return r=e.sent,e.abrupt("return",{privateKey:r,username:t,publicKey:a});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function j(){return(j=Object(m.a)(p.a.mark((function e(t){var n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"RSA-OAEP",modulusLength:256,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["encrypt","decrypt"]).then(function(){var e=Object(m.a)(p.a.mark((function e(n){var a,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f(n.publicKey);case 2:return a=e.sent,e.next=5,v(n.privateKey);case 5:return r=e.sent,e.abrupt("return",{privateKey:r,username:t,publicKey:a});case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function E(e){return d.a.pbkdf2Sync(e,"salt",1,32,"sha512").toString("hex")}var w=n(475),S=n(478),k=n(15),K=n(479),x=n(477),$=n(476),I=n(176),C=n.n(I),T=n(275),M=n(175),G=n(68),B=n.n(G);function A(){var e=JSON.stringify(localStorage),t=localStorage.getItem("password")||"";return B.a.AES.encrypt(e,t).toString()}function N(){var e=Object(s.a)(["\n    mutation updateKeys($username: String!, $keys: String!){\n        updateKeys(username:$username, keys:$keys){\n            success\n        }\n    }\n"]);return N=function(){return e},e}function P(){var e=Object(s.a)(["\n\tquery User($username: String!){\n\t\tuser(username:$username){\n\t\t\tusername\n\t\t\tid\n\t\t\tkeys\n\t\t}\n\t}\n"]);return P=function(){return e},e}function q(){var e=Object(s.a)(["\n\tmutation CreateToken($username: String!, $publicKey: String!){\n\t\t  createToken(username:$username, publicKey:$publicKey){\n\t\t    token\n\t\t    username\n\t\t}\n\t}\n"]);return q=function(){return e},e}function U(){var e=Object(s.a)(["\n\tmutation CreateUser($username: String!, $publicKey: String!){\n\t  createUser(username:$username, publicKey:$publicKey){\n\t    id\n\t    username\n\t    publicKey\n\t  }\n\t}\n"]);return U=function(){return e},e}var F=Object(k.gql)(U()),L=Object(k.gql)(q()),R=Object(k.gql)(P()),z=Object(k.gql)(N());var D=function(){var e=Object(k.useMutation)(z),t=Object(u.a)(e,1)[0],n=Object(k.useMutation)(F),c=Object(u.a)(n,1)[0],o=Object(k.useMutation)(L,{onCompleted:function(e){var n=e.createToken,a="login"===ee?q:y;localStorage.setItem("token",n.token),localStorage.setItem("username",n.username),localStorage.setItem("password",E(a)),t({variables:{username:n.username,keys:A()}}),window.location.href=window.location.href+"main"}}),i=Object(u.a)(o,1)[0],s=Object(k.useMutation)(L,{onCompleted:function(e){var t=e.createToken;localStorage.setItem("token",t.token),window.location.href=window.location.href+"main"}}),l=Object(u.a)(s,1)[0],p=Object(a.useState)(""),m=Object(u.a)(p,2),b=m[0],d=m[1],g=Object(a.useState)(""),f=Object(u.a)(g,2),y=f[0],v=f[1],h=Object(a.useState)(""),j=Object(u.a)(h,2),I=j[0],G=j[1],N=Object(a.useState)(""),P=Object(u.a)(N,2),q=P[0],U=P[1],D=Object(a.useState)(!1),W=Object(u.a)(D,2),H=W[0],J=W[1],Q=Object(a.useState)(!1),Y=Object(u.a)(Q,2),V=Y[0],X=Y[1],Z=Object(a.useState)("login"),_=Object(u.a)(Z,2),ee=_[0],te=_[1],ne=Object(k.useQuery)(R,{variables:{username:"login"===ee?I:b}}),ae=(ne.loading,ne.error),re=ne.data;function ce(e){var t="login"===ee?I:b;Promise.resolve(function(e){return O.apply(this,arguments)}(e)).then((function(e){var n=e.publicKey,a=e.privateKey;c({variables:{username:t,publicKey:n}}),localStorage.setItem("user-publicKey",n),localStorage.setItem("user-privateKey",a),i({variables:{username:t,publicKey:n}})}))}var oe=function(){if(ae)console.error(ae),X(!0);else if(null===re.user)X(!0);else{var e=E(q);if(function(e,t){var n=B.a.AES.decrypt(e,t);try{for(var a=JSON.parse(n.toString(B.a.enc.Utf8)),r=0,c=Object.entries(a);r<c.length;r++){var o=Object(u.a)(c[r],2),i=o[0],s=o[1];localStorage.setItem(i,s)}}catch(l){return console.error(l),!1}return!0}(re.user.keys,e)){var t=localStorage.getItem("username"),n=localStorage.getItem("user-publicKey");l({variables:{username:t,publicKey:n}})}else X(!0)}};return r.a.createElement(T.a,{fill:!0,id:"controlled-tab-example",className:"tabHeadings",activeKey:ee,onSelect:function(e){return te(e)}},r.a.createElement(M.a,{eventKey:"login",title:"Login"},r.a.createElement("div",{className:"register"},r.a.createElement(S.a,{InputProps:{style:{color:"black"}},id:"outlined-basic",label:"Username",variant:"outlined",value:I,color:"secondary",fullWidth:!0,onChange:function(e){return G(e.target.value)}}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(S.a,{InputProps:{style:{color:"black"}},id:"outlined-basic",label:"Password",variant:"outlined",value:q,type:"password",color:"secondary",fullWidth:!0,onChange:function(e){return U(e.target.value)}}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(w.a,{onClick:function(e){e.preventDefault(),oe()},variant:"contained",color:"secondary"},"Login"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement($.a,{in:V},r.a.createElement(K.a,{action:r.a.createElement(x.a,{"aria-label":"close",color:"inherit",size:"small",onClick:function(){X(!1)}},r.a.createElement(C.a,{fontSize:"inherit"})),variant:"filled",severity:"error"},"Invalid Login")))),r.a.createElement(M.a,{eventKey:"register",title:"Register"},r.a.createElement("div",{className:"register"},r.a.createElement(S.a,{InputProps:{style:{color:"black"}},id:"outlined-basic",label:"Username",variant:"outlined",value:b,color:"secondary",fullWidth:!0,onChange:function(e){return d(e.target.value)}}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(S.a,{InputProps:{style:{color:"black"}},id:"outlined-basic",label:"Password",variant:"outlined",value:y,type:"password",color:"secondary",fullWidth:!0,onChange:function(e){return v(e.target.value)}}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(w.a,{onClick:function(e){e.preventDefault(),ae?ce(b):null===re.user?(J(!1),ce(b)):J(!0)},variant:"contained",color:"secondary"},"Register"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement($.a,{in:H},r.a.createElement(K.a,{action:r.a.createElement(x.a,{"aria-label":"close",color:"inherit",size:"small",onClick:function(){J(!1)}},r.a.createElement(C.a,{fontSize:"inherit"})),variant:"filled",severity:"error"},"Invalid username - choose a unique username")))))},W=n(274),H=n(29),J=n(95),Q=n(26);function Y(){var e=Object(s.a)(["\n    subscription getNewGroups($username: String!){\n        newGroup(username: $username){\n          id\n          users{\n            username\n          }\n          name\n          publicKey\n        }\n    }\n"]);return Y=function(){return e},e}function V(){var e=Object(s.a)(["\n  query getGroupsWithUser($username: String!) {\n    groupsByUser(username: $username){\n      id\n      name\n      users {\n        username\n      }\n    }\n  }\n"]);return V=function(){return e},e}var X=Object(k.gql)(V()),Z=Object(k.gql)(Y());var _=function(e){var t=e.selectedGroup,n=e.setSelectedGroup,c=e.setDoneFetching,o=localStorage.getItem("username"),i=Object(a.useState)(!1),s=Object(u.a)(i,2),l=s[0],p=s[1],m=Object(k.useQuery)(X,{variables:{username:o}}),b=m.subscribeToMore,d=m.loading,g=m.error,f=m.data;if(Object(a.useEffect)((function(){l||(p(!0),b({document:Z,variables:{username:o},updateQuery:function(e,t){var n=t.subscriptionData;if(!n.data)return e;var a=n.data.newGroup;return Object.assign({},e,{groupsByUser:[a].concat(Object(J.a)(e.groupsByUser))})}}))}),[l]),d)return"Loading...";if(g)return"Error! ".concat(g.message);var y=f.groupsByUser.map((function(e){var a=e.users.map((function(e){return"@".concat(e.username)}));return r.a.createElement("div",{key:e.id,onClick:function(){n(e.id),c(!1)}},r.a.createElement(Q.c,{active:e.id===t},r.a.createElement(Q.a,{letter:e.name.charAt(0).toUpperCase()}),r.a.createElement(Q.d,{fill:"true"},r.a.createElement(Q.e,{justify:!0},r.a.createElement(Q.h,{ellipsis:!0},e.name)),r.a.createElement(Q.e,{justify:!0},r.a.createElement(Q.f,{ellipsis:!0},a.join(", "))))))}));return r.a.createElement(Q.b,{style:{maxWidth:"100%"}},y)},ee=n(106),te=n(141),ne=n.n(te),ae=n(69),re=n(179),ce=(n(254),n(180)),oe=n.n(ce);function ie(e,t,n){var a={message:e,type:t},r=JSON.stringify(a),c=localStorage.getItem("".concat(n,"-privateKey"));return B.a.AES.encrypt(r,c).toString()}function ue(e,t){var n=localStorage.getItem("".concat(t,"-privateKey")),a=B.a.AES.decrypt(e,n);return JSON.parse(a.toString(B.a.enc.Utf8))}function se(){var e=Object(s.a)(["\n    mutation updateKeys($username: String!, $keys: String!){\n        updateKeys(username:$username, keys:$keys){\n            success\n        }\n    }\n"]);return se=function(){return e},e}function le(){var e=Object(s.a)(["\n    mutation SendMessage($username: String!, $content: String!, $gid: Int!, $cType: String!){\n        createMessage(sender:$username, group:$gid, content:$content, cType:$cType){\n            id\n            content\n            ts\n        }\n    }\n"]);return le=function(){return e},e}function pe(){var e=Object(s.a)(["\n  display: block;\n  margin: 0 auto;\n  border-color: red;\n"]);return pe=function(){return e},e}var me=Object(ee.css)(pe()),be=Object(k.gql)(le()),de=Object(k.gql)(se());var ge=function(e){var t=e.entries,n=e.onLoadMore,c=e.doneFetching,o=e.subscribeToNewMessages,i=e.selectedGroup,s=Object(a.useState)(!0),l=Object(u.a)(s,2),p=l[0],m=l[1],b=Object(a.useState)(""),d=Object(u.a)(b,2),g=d[0],f=d[1],y=Object(k.useMutation)(be),v=Object(u.a)(y,1)[0],h=Object(k.useMutation)(de),O=Object(u.a)(h,1)[0],j=r.a.createRef(),E=r.a.createRef();window.lm=n;var w=[].concat(t.messagesByGroup).reverse(),S=localStorage.getItem("username"),K=w.map((function(e){if(e.cType.includes("group-private-key")){if(e.cType.includes(S)&&(null==localStorage.getItem("".concat(i,"-privateKey"))||"undefined"===localStorage.getItem("".concat(i,"-privateKey")))){var t=function(e){var t=new oe.a;return t.setPrivateKey(localStorage.getItem("user-privateKey")),t.decrypt(e)}(e.content);localStorage.setItem("".concat(i,"-privateKey"),t),O({variables:{username:S,keys:A()}})}return null}return new re.Message({id:e.sender===S?0:e.sender,message:ue(e.content,i).message,senderName:"@".concat(e.sender)})})).filter(Boolean);return Object(a.useEffect)((function(){p&&(j.scrollIntoView({behavior:"smooth"}),o(),m(!1)),setInterval((function(){if(!E)return!1;var e=E.getBoundingClientRect().top;e+0>=0&&e-0<=window.innerHeight&&!c&&n()}),1e3)}),[p,m,n,E,j]),r.a.createElement("div",{style:{marginLeft:"10px",marginRight:"10px",marginBottom:"50px"}},r.a.createElement("div",{style:{height:"30px"},ref:function(e){E=e}},!c&&r.a.createElement(ne.a,{css:me,size:30,color:"#123abc",loading:!0})),r.a.createElement(re.ChatFeed,{messages:K,showSenderName:!0,bubblesCentered:!1,bubbleStyles:{text:{fontSize:14},chatbubble:{borderRadius:30,padding:15}}}),r.a.createElement("div",{style:{float:"left",clear:"both"},ref:function(e){j=e}}),r.a.createElement(ae.a,{style:{width:"68%",bottom:"20px",position:"fixed"}},r.a.createElement(ae.a.Group,null,r.a.createElement(ae.a.Control,{type:"text",placeholder:"Enter message",value:g,onChange:function(e){return f(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&(e.preventDefault(),v({variables:{username:S,gid:i,content:ie(g,"text",i),cType:"text"}}))}}))))};function fe(){var e=Object(s.a)(["\n  display: block;\n  margin: 0 auto;\n  border-color: red;\n"]);return fe=function(){return e},e}function ye(){var e=Object(s.a)(["\n    subscription getNewMessages($gid: Int!){\n        newMessage(gid: $gid){\n            id\n            content\n            ts\n            sender\n            cType\n        }\n    }\n"]);return ye=function(){return e},e}function ve(){var e=Object(s.a)(["\n    query getMessagesForGroup($gid: Int!, $offset: Int, $limit: Int) {\n        messagesByGroup(gid: $gid, count: $limit, offset: $offset){\n            id\n            content\n            ts\n            sender\n            cType\n        }\n    }\n"]);return ve=function(){return e},e}var he=Object(k.gql)(ve()),Oe=Object(k.gql)(ye()),je=Object(ee.css)(fe());var Ee=function(e){var t=e.selectedGroup,n=e.doneFetching,a=e.setDoneFetching,c=Object(k.useQuery)(he,{variables:{gid:t,offset:0,limit:50},fetchPolicy:"cache-and-network"}),o=c.subscribeToMore,i=c.loading,u=c.error,s=c.data,l=c.fetchMore;return i?r.a.createElement("div",{style:{marginLeft:"10px",marginRight:"10px",marginBottom:"50px"}},r.a.createElement("div",{style:{height:"30px"}},!n&&r.a.createElement(ne.a,{css:je,size:30,color:"#123abc",loading:!0}))):u?"Error! ".concat(u.message):r.a.createElement(ge,{entries:s,selectedGroup:t,doneFetching:n,onLoadMore:function(){if(!n)return l({variables:{offset:s.messagesByGroup.length},updateQuery:function(e,t){var n=t.fetchMoreResult;return 0===n.messagesByGroup.length&&a(!0),Object.assign({},e,{messagesByGroup:[].concat(Object(J.a)(e.messagesByGroup),Object(J.a)(n.messagesByGroup))})}})},subscribeToNewMessages:function(){return o({document:Oe,variables:{gid:t},updateQuery:function(e,t){var n=t.subscriptionData;if(!n.data)return e;var a=n.data.newMessage;return Object.assign({},e,{messagesByGroup:[a].concat(Object(J.a)(e.messagesByGroup))})}})}})},we=n(94),Se=n(270),ke=n.n(Se),Ke=(n(430),n(96));function xe(){var e=Object(s.a)(["\n    mutation updateKeys($username: String!, $keys: String!){\n        updateKeys(username:$username, keys:$keys){\n            success\n        }\n    }\n"]);return xe=function(){return e},e}function $e(){var e=Object(s.a)(["\n    mutation SendMessage($username: String!, $content: String!, $gid: Int!, $cType: String!){\n        createMessage(sender:$username, group:$gid, content:$content, cType: $cType){\n            id\n            content\n            ts\n            cType\n        }\n    }\n"]);return $e=function(){return e},e}function Ie(){var e=Object(s.a)(["\nmutation createGroup($name: String!, $publicKey: String!, $users: [String!]){\n    createGroup(name:$name, publicKey:$publicKey, users:$users){\n      id\n      name\n      publicKey\n      users{\n          username\n          publicKey\n      }\n    }\n  }\n"]);return Ie=function(){return e},e}var Ce=Object(k.gql)(Ie()),Te=Object(k.gql)($e()),Me=Object(k.gql)(xe());var Ge=function(e){var t=e.show,n=e.setShow,c=Object(a.useState)([]),o=Object(u.a)(c,2),i=o[0],s=o[1],l=function(){return n(!1)},p=Object(a.useState)(""),m=Object(u.a)(p,2),b=m[0],d=m[1],g=Object(k.useMutation)(Me),f=Object(u.a)(g,1)[0],y=Object(k.useMutation)(Te),v=Object(u.a)(y,1)[0],h=Object(k.useMutation)(Ce,{onCompleted:function(e){var t=e.createGroup,n=localStorage.getItem("username"),a=localStorage.getItem("temp-group-privatekey");localStorage.setItem("".concat(t.id,"-privateKey"),a),localStorage.removeItem("temp-group-privatekey"),t.users.map((function(e){var r=function(e,t){var n=new oe.a;return n.setPublicKey(t.publicKey),n.encrypt(e)}(a,e);return v({variables:{username:n,gid:t.id,content:r,cType:"group-private-key-".concat(e.username)}}),!0})),f({variables:{username:n,keys:A()}}),l()}}),O=Object(u.a)(h,1)[0],E=function(e,t){e.push(localStorage.getItem("username"));var n=e.filter((function(e,t,n){return n.indexOf(e)===t}));if(n&&n.length>0)Promise.resolve(function(e){return j.apply(this,arguments)}(t)).then((function(e){var a=e.publicKey,r=e.privateKey;localStorage.setItem("temp-group-privatekey",r),O({variables:{users:n,publicKey:a,name:t}})}));else console.log("Error, you have no individuals to add to the group")};return r.a.createElement("div",null,r.a.createElement(Ke.a,{show:t,transparent:"true",onHide:l},r.a.createElement(Ke.a.Header,{closeButton:!0},r.a.createElement(Ke.a.Title,null,"Input the individuals to add to your new Group Chat!")),r.a.createElement(Ke.a.Body,null,r.a.createElement(ke.a,{value:i,onChange:function(e){return s(e)},inputProps:{className:"react-tagsinput-input",placeholder:"Add people!"},onlyUnique:!0}),r.a.createElement(ae.a,{style:{marginTop:"20px"}},r.a.createElement(ae.a.Group,null,r.a.createElement(ae.a.Control,{type:"text",placeholder:"GroupName",value:b,onChange:function(e){return d(e.target.value)}})))),r.a.createElement(Ke.a.Footer,null,r.a.createElement(we.a,{variant:"secondary",onClick:l},"Close"),r.a.createElement(we.a,{variant:"primary",onClick:function(){return E(i,b)}},"Create Group!"))))},Be={defaultTheme:{FixedWrapperMaximized:{css:{boxShadow:"0 0 1em rgba(0, 0, 0, 0.1)"}},OwnMessage:Object(i.a)(Object(i.a)({},Q.j.OwnMessage),{},{backgroundColor:"#456456",secondaryTextColor:"#456456"})},purpleTheme:Object(i.a)(Object(i.a)({},Q.l),{},{TextComposer:Object(i.a)(Object(i.a)({},Q.l.TextComposer),{},{css:Object(i.a)(Object(i.a)({},Q.l.TextComposer.css),{},{marginTop:"1em"})}),OwnMessage:Object(i.a)(Object(i.a)({},Q.l.OwnMessage),{},{secondaryTextColor:"#fff"})}),elegantTheme:Object(i.a)(Object(i.a)({},Q.k),{},{Message:Object(i.a)(Object(i.a)({},Q.i.Message),{},{secondaryTextColor:"#fff"}),OwnMessage:Object(i.a)(Object(i.a)({},Q.i.OwnMessage),{},{secondaryTextColor:"#fff"})}),darkTheme:Object(i.a)(Object(i.a)({},Q.i),{},{Message:Object(i.a)(Object(i.a)({},Q.i.Message),{},{css:Object(i.a)(Object(i.a)({},Q.i.Message.css),{},{color:"#fff"})}),OwnMessage:Object(i.a)(Object(i.a)({},Q.i.OwnMessage),{},{secondaryTextColor:"#fff"}),TitleBar:Object(i.a)(Object(i.a)({},Q.i.TitleBar),{},{css:Object(i.a)(Object(i.a)({},Q.i.TitleBar.css),{},{padding:"1em"})})})};var Ae=function(){var e=Object(a.useState)(null),t=Object(u.a)(e,2),n=t[0],c=t[1],o=Object(a.useState)(!1),i=Object(u.a)(o,2),s=i[0],l=i[1],p=Object(a.useState)(!1),m=Object(u.a)(p,2),b=m[0],d=m[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement(Ge,{show:b,setShow:d}),r.a.createElement(Q.g,{theme:Be.defaultTheme},r.a.createElement("div",{style:{height:"100%",width:"30%",position:"fixed",zIndex:1,top:0,overflowX:"hidden",paddingTop:"20px",left:0}},r.a.createElement("div",{className:"App"},r.a.createElement(we.a,{variant:"primary",style:{marginRight:"10px"},onClick:function(){return d(!b)}},"Create Group Chat"),r.a.createElement(we.a,{variant:"secondary",onClick:function(){localStorage.clear();var e=window.location.href.split("/");e.pop();var t=e.join("/");window.location.href=t}},"Logout")),r.a.createElement(_,{selectedGroup:n,setSelectedGroup:c,setDoneFetching:l})),r.a.createElement("div",{style:{height:"100%",width:"70%",position:"fixed",zIndex:1,top:0,overflowX:"hidden",paddingTop:"20px",right:0,border:"1px solid rgba(0,0,0,0.1)"}},n&&r.a.createElement(Ee,{selectedGroup:n,doneFetching:s,setDoneFetching:l}))))},Ne=n(271),Pe=n(4),qe=n(272);var Ue=function(){var e=window.location.href.includes("https://rithik.me/"),t=e?"https://e2-chat.herokuapp.com":"http://localhost:4000",n=e?"wss://e2-chat.herokuapp.com":"ws://localhost:4000",a=localStorage.getItem("token"),c=Object(k.createHttpLink)({uri:"".concat(t,"/graphql")}),o=Object(Ne.a)((function(e,t){var n=t.headers;return{headers:Object(i.a)(Object(i.a)({},n),{},{authorization:a?"".concat(a):""})}})),u=new qe.a({uri:"".concat(n,"/graphql"),options:{reconnect:!0,connectionParams:{Authorization:a}}}),s=Object(k.split)((function(e){var t=e.query,n=Object(Pe.p)(t);return"OperationDefinition"===n.kind&&"subscription"===n.operation}),u,o.concat(c)),l=new k.ApolloClient({link:s,cache:new k.InMemoryCache});return r.a.createElement(W.a,{basename:"/"},r.a.createElement(H.c,null,r.a.createElement(H.a,{path:"/main"},r.a.createElement(k.ApolloProvider,{client:l},r.a.createElement("div",null,r.a.createElement(Ae,null)))),r.a.createElement(H.a,{path:"/"},r.a.createElement(k.ApolloProvider,{client:l},r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement(D,null)))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.Fragment,null,r.a.createElement(Ue,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[285,1,2]]]);
//# sourceMappingURL=main.0354b84c.chunk.js.map