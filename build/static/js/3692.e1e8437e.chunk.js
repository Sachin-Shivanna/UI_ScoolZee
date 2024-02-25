"use strict";(self.webpackChunkscoolzee=self.webpackChunkscoolzee||[]).push([[3692],{2184:function(e,n,t){t.d(n,{a:function(){return i}});var i=[{value:"inApp",label:"In App"},{value:"email",label:"Email"},{value:"whatsapp",label:"Whatsapp"}]},669:function(e,n,t){t.d(n,{Yk:function(){return d},nm:function(){return c},yK:function(){return s},zl:function(){return u}});var i=t(4942),o=t(8596),a=t(7630),r=t(8745),l=t(618),s=(0,o.Z)((function(e){return{gridElement:(0,i.Z)({margin:"20px 10px",display:"flex",width:"100%"},e.breakpoints.down("sm"),{padding:"0px 0px 15px 0px !important",margin:0}),header:{backgroundColor:"#101F33",padding:"5px",color:e.palette.common.white,marginTop:"10px",marginBottom:"10px"}}})),c=(0,a.ZP)(r.Z)((function(e){var n,t=e.theme;return n={},(0,i.Z)(n,"&.".concat(l.Z.head),{backgroundColor:"#E5E4E2",color:t.palette.common.black,borderBottom:".05px solid #101F33"}),(0,i.Z)(n,"&.".concat(l.Z.body),{fontSize:14}),n})),u=(0,a.ZP)(r.Z)((function(e){var n,t=e.theme;return n={position:"sticky",top:0},(0,i.Z)(n,"&.".concat(l.Z.head),{backgroundColor:"#E5E4E2",color:t.palette.common.black}),(0,i.Z)(n,"&.".concat(l.Z.body),{fontSize:14}),n})),d=(0,a.ZP)(r.Z)((function(e){var n,t=e.theme;return n={},(0,i.Z)(n,"&.".concat(l.Z.head),{backgroundColor:"#101F33",color:t.palette.common.white}),(0,i.Z)(n,"&.".concat(l.Z.body),{fontSize:14}),n}))},3692:function(e,n,t){t.r(n);var i=t(1413),o=t(4165),a=t(2982),r=t(5861),l=t(885),s=t(2791),c=t(4267),u=t(1971),d=t(6513),f=t(3712),h=t(4280),p=t(1889),m=t(3925),v=t(6571),g=t(703),x=t(9836),Z=t(3382),j=t(2740),y=t(8745),b=t(9281),S=t(6890),w=t(9184),I=t(5855),k=t(1747),T=t(4569),C=t.n(T),N=t(8302),E=t(669),P=t(9271),W=t(6140),O=t(5048),_=t(2184),M=t(7714),F=t(3974),q=t(184);n.default=function(){var e,n,t=(0,E.yK)(),T=(0,P.k6)(),B=!1,z=null===(e=JSON.parse(localStorage.getItem("userDetail")))||void 0===e||null===(n=e.profile)||void 0===n?void 0:n.name,D=M.f.find((function(e){return e.route===window.location.pathname}));(0,s.useEffect)((function(){_e(),Me()}),[]);var H=s.useState([]),J=(0,l.Z)(H,2),A=J[0],R=J[1],L=s.useState([]),V=(0,l.Z)(L,2),K=V[0],Y=V[1],$=s.useState([]),G=(0,l.Z)($,2),Q=G[0],U=G[1],X=s.useState(""),ee=(0,l.Z)(X,2),ne=ee[0],te=ee[1],ie=s.useState(!1),oe=(0,l.Z)(ie,2),ae=oe[0],re=oe[1],le=s.useState([]),se=(0,l.Z)(le,2),ce=se[0],ue=se[1],de=s.useState({}),fe=(0,l.Z)(de,2),he=fe[0],pe=fe[1],me=s.useState({}),ve=(0,l.Z)(me,2),ge=ve[0],xe=ve[1],Ze=s.useState({}),je=(0,l.Z)(Ze,2),ye=je[0],be=je[1],Se=s.useState({}),we=(0,l.Z)(Se,2),Ie=we[0],ke=we[1],Te=s.useState([]),Ce=(0,l.Z)(Te,2),Ne=Ce[0],Ee=Ce[1],Pe=(0,s.useContext)(F.v),We=(0,l.Z)(Pe,2),Oe=(We[0],We[1]);(0,s.useEffect)((function(){console.log(ne)}),[ne]);var _e=function(){var e=(0,r.Z)((0,o.Z)().mark((function e(){var n,t,i;return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return re(!0),B=!1,n=[],t=[],i=C().CancelToken.source(),e.next=7,C().get("".concat("http://localhost:8000/web","/current-year-classes-info")).then((function(e){if(200===e.status)if(0===e.data.length)(0,W.ZP)((0,q.jsx)("span",{style:{color:"#FF9900"},children:"No classes are found. Please add!!"}),{icon:(0,q.jsx)(c.Z,{style:{color:"#FF9900"}})});else{e.data.forEach((function(e){var i,o,r;n.push.apply(n,(0,a.Z)(null===(i=e.divisions)||void 0===i?void 0:i.map((function(e){var n;return null===(n=e.courses)||void 0===n?void 0:n.map((function(e){return e.subject}))})))),t.push({id:e._id,name:e.name,subjects:(0,a.Z)(null===(o=e.divisions[0])||void 0===o||null===(r=o.courses)||void 0===r?void 0:r.map((function(e){var n;return null===(n=e.subject)||void 0===n?void 0:n._id})))})}));var i=[].concat.apply([],Object.values(n)).reduce((function(e,n){return e.some((function(e){return e._id===n._id}))||e.push(n),e}),[]);Y(i),U(t)}})).catch((function(e){var n;(console.log(e),B)||403===(null===(n=e.request)||void 0===n?void 0:n.status)&&(localStorage.removeItem("userDetail"),localStorage.removeItem("userToken"),localStorage.removeItem("activeSubscription"),T.replace("/login"),T.go(0))})).finally((function(){return re(!1),function(){B=!0,i.cancel("Cancelling in cleanup")}}));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Me=function(){var e=(0,r.Z)((0,o.Z)().mark((function e(){var n;return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Ee([]),re(!0),B=!1,n=C().CancelToken.source(),e.next=6,C().get("".concat("http://localhost:8000/web","/faculty-info")).then((function(e){console.log(e.data),Ee(e.data)})).catch((function(e){B||403===e.request.status&&(Oe(!1),localStorage.removeItem("userDetail"),localStorage.removeItem("userToken"),localStorage.removeItem("activeSubscription"),T.replace("/login"),T.go(0))})).finally((function(){return re(!1),function(){B=!0,n.cancel("Cancelling in cleanup")}}));case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Fe=function(){var e,n=[];ce.forEach((function(e){n.findIndex((function(n){return n.class===e.classId}))>=0?n.find((function(n){return n.class===e.classId})).details.push({subject:e.subjectId,dateTime:e.dateTime}):n.push({class:e.classId,details:[{subject:e.subjectId,dateTime:e.dateTime}]})})),e={title:he.title,duration:ne,instruction:Ie.instruction,notificationMode:ge.notificationMode,owner:ye,exams:n},console.log(e),qe(e)},qe=function(){var e=(0,r.Z)((0,o.Z)().mark((function e(n){var t;return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return B=!1,re(!0),t=C().CancelToken.source(),e.next=5,C().post("".concat("http://localhost:8000/web","/add-assessment"),{assessmentDetails:n}).then((function(e){200===e.status&&(re(!1),console.log("Returned"),W.ZP.success("Published"),T.replace("/assessments"))})).catch((function(e){B||(403===e.request.status?(localStorage.removeItem("userDetail"),localStorage.removeItem("userToken"),localStorage.removeItem("activeSubscription"),T.replace("/login"),T.go(0)):W.ZP.error(e.response.data))})).finally((function(){return re(!1),function(){B=!0,t.cancel("Cancelling in cleanup")}}));case 5:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();return ae?(0,q.jsx)(u.Z,{style:{top:"50%"},children:(0,q.jsx)(O.Z,{isPageLoading:ae})}):(0,q.jsxs)(s.Fragment,{children:[D.createAccess.includes(z)&&(0,q.jsx)(u.Z,{component:"span",className:t.hideButtons,children:(0,q.jsxs)(p.ZP,{container:!0,spacing:5,children:[(0,q.jsx)(p.ZP,{xs:6,md:6,justifyContent:"flex-end",style:{maxWidth:"46%",paddingTop:10,marginBottom:"1.5%"},className:t.gridElement,children:(0,q.jsx)(d.Z,{variant:"contained",size:"medium",style:{marginRight:3},color:"inherit",onClick:function(){var e=[],n=!0;JSON.stringify(he)===JSON.stringify({})&&(e.push("title"),n=!1),console.log(ne),""!==ne&&5!==(null===ne||void 0===ne?void 0:ne.length)&&(e.push("duration"),n=!1),JSON.stringify(ge)===JSON.stringify({})&&(e.push("notificationMode"),n=!1),JSON.stringify(ye)===JSON.stringify({})&&(e.push("owner"),n=!1),0===ce.length&&(W.ZP.error("No assessment scheduled."),n=!1),n?Fe():R([].concat(e))},children:"Publish"})}),(0,q.jsx)(p.ZP,{xs:6,md:6,justifyContent:"flex-start",style:{maxWidth:"46%",paddingTop:10,marginBottom:"1.5%"},className:t.gridElement,children:(0,q.jsx)(d.Z,{variant:"contained",size:"medium",color:"error",style:{marginRight:3},onClick:function(){},children:"Cancel"})})]})}),(0,q.jsx)(N.Z,{className:t.header,children:"Assessment :"}),(0,q.jsxs)(f.Z,{style:{paddingTop:30,backgroundColor:"white"},children:[(0,q.jsxs)(p.ZP,{container:!0,spacing:4,children:[(0,q.jsxs)(p.ZP,{item:!0,xs:6,children:[(0,q.jsxs)(u.Z,{style:{marginBottom:20},children:[(0,q.jsx)(N.Z,{className:t.label,children:"Title :"}),(0,q.jsx)(h.Z,{style:{flex:1},fullWidth:!0,placeholder:"Assessment Title",helperText:A.includes("title")?"Title is required":"",error:A.includes("title"),onFocus:function(){R(A.filter((function(e){return"title"!==e})))},value:he.title||"",id:"title",onChange:function(e){pe({title:e.target.value})},variant:"standard"})]}),(0,q.jsxs)(u.Z,{style:{marginBottom:20},children:[(0,q.jsx)(N.Z,{className:t.label,children:"Instructions :"}),(0,q.jsx)(k.Z,{"aria-label":"minimum height",minRows:3,placeholder:"Enter Instructions...",onChange:function(e){ke({instruction:e.target.value})},style:{minWidth:"100%",maxWidth:"100%",minHeight:143,height:143},value:Ie.instruction||""})]})]}),(0,q.jsxs)(p.ZP,{item:!0,xs:6,children:[(0,q.jsxs)(u.Z,{style:{marginBottom:20},children:[(0,q.jsx)(N.Z,{className:t.label,children:"Duration :"}),(0,q.jsx)(h.Z,{style:{flex:1},fullWidth:!0,type:"text",placeholder:"HH:MM",onkeypress:"formatTime(this)",MaxLength:"8",helperText:A.includes("duration")?"Invalid duration":"",error:A.includes("duration"),onFocus:function(){R(A.filter((function(e){return"duration"!==e})))},inputProps:{inputMode:"numeric",pattern:"[0-9]*"},id:"title",onChange:function(e){!function(e){var n,t=e.target.value;if(te(t),console.log(t),t<24&&2==t.length)return e.target.value=e.target.value+":",!1;if(24==t&&2==t.length)return e.target.value=e.target.value.length-2+"0:",!1;if(t>24&&2===t.length)return e.target.value="",!1;t.length>5&&(e.target.value=null===(n=e.target.value)||void 0===n?void 0:n.slice(0,-1))}(e)},variant:"standard"})]}),(0,q.jsxs)(u.Z,{style:{marginBottom:20},children:[(0,q.jsx)(N.Z,{style:{paddingRight:10},className:t.label,children:"Notification Mode :"}),(0,q.jsx)(j.Z,{style:{minWidth:250},disabled:!1,options:_.a||[],getOptionLabel:function(e){return e.label||""},value:_.a.find((function(e){return e.value===ge.notificationMode}))||"",isOptionEqualToValue:function(e,n){return(null===e||void 0===e?void 0:e.value)===n},onChange:function(e){var n,t,i;xe({notificationMode:null===(n=_.a[null===(t=e.target)||void 0===t||null===(i=t.dataset)||void 0===i?void 0:i.optionIndex])||void 0===n?void 0:n.value})},id:"disable-close-on-select",renderInput:function(e){return(0,q.jsx)(h.Z,(0,i.Z)((0,i.Z)({},e),{},{variant:"standard",required:!0,helperText:A.includes("notificationMode")?"Notification Mode is required":"",error:A.includes("notificationMode"),onFocus:function(){R(A.filter((function(e){return"notificationMode"!==e})))},fullWidth:!0,id:"event-type",placeholder:"Notification"}))}})]}),(0,q.jsxs)(u.Z,{style:{marginBottom:20},children:[(0,q.jsx)(N.Z,{style:{paddingRight:10},className:t.label,children:"Owner :"}),(0,q.jsx)(j.Z,{style:{minWidth:250},disabled:!1,options:Ne||[],getOptionLabel:function(e){return e.name||""},value:Ne.find((function(e){return e._id===ye.ownerId}))||"",isOptionEqualToValue:function(e,n){return(null===e||void 0===e?void 0:e._id)===(null===n||void 0===n?void 0:n._id)},onChange:function(e){var n,t,i;be({ownerId:null===(n=Ne[null===(t=e.target)||void 0===t||null===(i=t.dataset)||void 0===i?void 0:i.optionIndex])||void 0===n?void 0:n._id})},id:"disable-close-on-select",renderInput:function(e){return(0,q.jsx)(h.Z,(0,i.Z)((0,i.Z)({},e),{},{variant:"standard",required:!0,helperText:A.includes("owner")?"Owner is required":"",error:A.includes("owner"),onFocus:function(){R(A.filter((function(e){return"owner"!==e})))},fullWidth:!0,id:"owner",placeholder:"Owner"}))}})]})]})]}),(0,q.jsx)(u.Z,{children:(0,q.jsx)(g.Z,{sx:{width:"100%",overflow:"hidden",marginTop:"10px"},children:(0,q.jsx)(b.Z,{sx:{maxHeight:"100vh"},children:(0,q.jsxs)(x.Z,{stickyHeader:!0,"aria-label":"sticky table",children:[(0,q.jsx)(S.Z,{children:(0,q.jsxs)(I.Z,{children:[(0,q.jsx)(E.nm,{align:"center",style:{minWidth:170},stickyHeader:!0,children:"Subjects"}),Q.map((function(e){return(0,q.jsx)(E.Yk,{align:"center",style:{minWidth:100},children:e.name},e._id)}))]})}),(0,q.jsx)(Z.Z,{children:K.map((function(e,n){return(0,q.jsxs)(I.Z,{tabIndex:-1,style:{position:"relative"},children:[(0,q.jsx)(E.zl,{stickyHeader:!0,variant:"head",align:"center",style:{minWidth:100},children:e.name},e._id),Q.map((function(n){var t,o;return(0,q.jsx)(y.Z,{style:{minWidth:223},children:(0,q.jsx)(v._,{dateAdapter:m.Z,children:(0,q.jsx)(w.x,{disabled:!(null!==(t=n.subjects)&&void 0!==t&&t.includes(e._id)),value:(null===ce||void 0===ce||null===(o=ce.find((function(t){return t.classId===n.id&&t.subjectId===e._id})))||void 0===o?void 0:o.dateTime)||null,fullWidth:!0,onChange:function(t){!function(e,n,t){e=isNaN(e)?null:e;var i=[];ce.forEach((function(e){e.classId===n&&e.subjectId===t||i.push(e)})),ue([].concat(i,[{dateTime:e,classId:n,subjectId:t}]))}(new Date(null===t||void 0===t?void 0:t.$d),n.id,e._id)},renderInput:function(e){return(0,q.jsx)(h.Z,(0,i.Z)((0,i.Z)({},e),{},{defaultValue:""}))}})})})}))]},e._id)}))})]})})})})]}),(0,q.jsx)(W.x7,{})]})}}}]);
//# sourceMappingURL=3692.e1e8437e.chunk.js.map