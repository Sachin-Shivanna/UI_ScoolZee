"use strict";(self.webpackChunkscoolzee=self.webpackChunkscoolzee||[]).push([[1005],{1005:function(e,n,t){t.r(n);var i=t(4165),a=t(5861),o=t(2982),r=t(1413),l=t(885),s=t(2791),c=t(4569),u=t.n(c),d=t(1971),p=t(6513),f=t(8302),h=t(3712),g=t(6869),v=t(7904),m=t(9271),Z=t(6140),x=t(2740),y=t(9823),j=t(1889),C=t(9174),b=t(1747),T=t(1023),D=t(2184),w=t(6135),S=t(9365),I=t(3341),k=t(750),N=t(5048),P=t(7714),E=t(184);n.default=function(e){var n,t,O=s.createRef(),q=(0,v.y)(),B=(0,m.k6)(),W=!1,z=null===(n=JSON.parse(localStorage.getItem("userDetail")))||void 0===n||null===(t=n.profile)||void 0===t?void 0:t.name,M=P.f.find((function(e){return"/events/add-event"===e.route})),A="".concat("http://localhost:8000/web","/add-event"),F={headers:{"content-type":"multipart/form-data"}},R=s.useState([]),L=(0,l.Z)(R,2),U=L[0],V=L[1],_=s.useState([]),J=(0,l.Z)(_,2),H=J[0],G=J[1],K=s.useState(!1),Q=(0,l.Z)(K,2),X=Q[0],Y=Q[1],$=s.useState(!1),ee=(0,l.Z)($,2),ne=ee[0],te=(ee[1],s.useState([])),ie=(0,l.Z)(te,2),ae=ie[0],oe=ie[1],re=s.useState(!1),le=(0,l.Z)(re,2),se=le[0],ce=le[1],ue=s.useState(0),de=(0,l.Z)(ue,2),pe=de[0],fe=de[1],he=s.useState({}),ge=(0,l.Z)(he,2),ve=ge[0],me=ge[1],Ze=s.useState({title:"",description:"",type:"",audianceCategory:"",notificationMode:"",startDate:"",endDate:"",owner:"",attachment:{}}),xe=(0,l.Z)(Ze,2),ye=xe[0],je=xe[1];(0,s.useEffect)((function(){console.log(H),je((0,r.Z)((0,r.Z)({},ye),{},{audiance:H}))}),[H]),(0,s.useEffect)((function(){var n,t;(je((0,r.Z)((0,r.Z)({},ye),{},{startDate:Te("startDate"),endDate:Te("endDate")})),De(),(null===(n=e.selectedUsers)||void 0===n?void 0:n.length)>0)&&(console.log(e.selectedUsers),G((0,o.Z)(null===(t=e.selectedUsers)||void 0===t?void 0:t.map((function(e){return{userId:e._id,userEmail:e.email,userPhone:e.phone1,userProfile:e.profile,userName:e.name}})))))}),[]),(0,s.useEffect)((function(){G([]),"institution"===ye.audianceCategory&&we(ae)}),[ye.audianceCategory]),(0,s.useEffect)((function(){if(e.hideAudienceCategory&&se){var n=e.selectedUsers.map((function(e){return e.caregiver}));be(n)}else we(ae)}),[se]);var Ce,be=function(){var e=(0,a.Z)((0,i.Z)().mark((function e(n){var t;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return W=!1,t=u().CancelToken.source(),e.next=4,u().get("".concat("http://localhost:8000/web","/users-by-ids?").concat(n.map((function(e,n){return"IDs[".concat(n,"]=").concat(e)})).join("&"))).then((function(e){var n;console.log(e.data),G([].concat((0,o.Z)(H),(0,o.Z)(null===(n=e.data)||void 0===n?void 0:n.map((function(e){return{userId:e._id,userEmail:e.email,userPhone:e.phone1,userProfile:e.profile,userName:e.name}})))))})).catch((function(e){W||403===e.request.status&&(localStorage.removeItem("userDetail"),localStorage.removeItem("userToken"),localStorage.removeItem("activeSubscription"),B.replace("/login"),B.go(0))})).finally((function(){return function(){W=!0,t.cancel("Cancelling in cleanup")}}));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),Te=function(e){var n=new Date;return n.setMinutes(n.getMinutes()-n.getTimezoneOffset()),"endDate"===e&&n.setDate(n.getDate()+parseInt(1)),n.toISOString().slice(0,16)},De=function(){var e=(0,a.Z)((0,i.Z)().mark((function e(){var n;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return W=!1,n=u().CancelToken.source(),e.next=4,u().get("".concat("http://localhost:8000/web","/active-users-info")).then((function(e){console.log(e.data),oe(e.data)})).catch((function(e){W||403===e.request.status&&(localStorage.removeItem("userDetail"),localStorage.removeItem("userToken"),localStorage.removeItem("activeSubscription"),B.replace("/login"),B.go(0))})).finally((function(){return function(){W=!0,n.cancel("Cancelling in cleanup")}}));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),we=function(e){var n=[];e.forEach((function(e){var t,i;(se&&"Caregiver"===(null===(t=e.profile)||void 0===t?void 0:t.name)||"Caregiver"!==(null===(i=e.profile)||void 0===i?void 0:i.name))&&n.push({userId:e._id,userEmail:e.email,userPhone:e.phone1})})),G([].concat(n))},Se=function(){var e=(0,a.Z)((0,i.Z)().mark((function e(){var n,t;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:W=!1,Y(!0),(n=new FormData).append("file",ve),n.append("eventDetails",JSON.stringify(ye)),t=u().CancelToken.source(),(0,c.post)(A,n,F).then((function(e){console.log(e),200===e.status?(Z.ZP.success(e.data),B.goBack()):Z.ZP.error(e.data)})).catch((function(e){W||(403===e.request.status?(localStorage.removeItem("userDetail"),localStorage.removeItem("userToken"),localStorage.removeItem("activeSubscription"),B.replace("/login"),B.go(0)):Z.ZP.error(e))})).finally((function(){return Y(!1),function(){W=!0,t.cancel("Cancelling in cleanup")}}));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return ne?(0,E.jsx)(d.Z,{style:{paddingTop:"50%",backgroundColor:"white"},children:(0,E.jsx)(N.Z,{isPageLoading:X})}):X?(0,E.jsx)(d.Z,{style:{top:"50%"},children:(0,E.jsx)(N.Z,{isPageLoading:X})}):(0,E.jsxs)(s.Fragment,{children:[(null===(Ce=M.createAccess)||void 0===Ce?void 0:Ce.includes(z))&&(0,E.jsx)(d.Z,{component:"span",className:q.hideButtons,children:(0,E.jsxs)(j.ZP,{container:!0,spacing:5,children:[(0,E.jsx)(j.ZP,{xs:6,md:6,justifyContent:"flex-end",style:{maxWidth:"46%",paddingTop:10,marginBottom:"1.5%"},className:q.gridElement,children:(0,E.jsx)(p.Z,{variant:"contained",size:"medium",onClick:function(){var n=!0,t=[];null!==ye.title&&""!==ye.title||(t.push.apply(t,t.concat(["title"])),n=!1),""===ye.type&&(t.push.apply(t,t.concat(["type"])),n=!1),""===ye.owner&&(t.push.apply(t,t.concat(["owner"])),n=!1),e.hideAudienceCategory||""!==ye.audianceCategory||(t.push.apply(t,t.concat(["audianceCategory"])),n=!1),""===ye.notificationMode&&(t.push.apply(t,t.concat(["notificationMode"])),n=!1),""!==ye.audianceCategory&&0===H.length&&(t.push.apply(t,t.concat(["selectedUsers"])),n=!1,Z.ZP.error("Please select the Audience")),new Date(ye.startDate+":00.0z")<new Date&&(n=!1,Z.ZP.error("Event must be timed in future")),new Date(ye.startDate+":00.0z")>new Date(ye.endDate+":00.0z")&&(n=!1,Z.ZP.error("Event end time must be greater than start date")),pe>10&&(t.push.apply(t,t.concat(["fileSize"])),n=!1),n?Se():V(t)},children:"Publish"})}),(0,E.jsx)(j.ZP,{xs:6,md:6,justifyContent:"flex-start",style:{maxWidth:"46%",paddingTop:10,marginBottom:"1.5%"},className:q.gridElement,children:(0,E.jsx)(p.Z,{variant:"contained",size:"medium",onClick:function(){e.hasCancel?e.onCancel():B.goBack()},children:"Cancel"})})]})}),(0,E.jsx)(f.Z,{className:q.header,children:"Event :"}),(0,E.jsx)(h.Z,{style:{paddingTop:30,backgroundColor:"white"},children:(0,E.jsxs)(j.ZP,{container:!0,spacing:4,children:[(0,E.jsxs)(j.ZP,{item:!0,xs:6,children:[(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{className:q.label,children:"Title :"}),(0,E.jsx)(g.Z,{style:{flex:1},fullWidth:!0,inputProps:{className:q.inputDesign},placeholder:"Event Title",helperText:U.includes("title")?"Title is required":"",error:U.includes("title"),onFocus:function(){V(U.filter((function(e){return"title"!==e})))},value:ye.title||"",id:"name",onChange:function(e){je((0,r.Z)((0,r.Z)({},ye),{},{title:e.target.value}))},variant:"standard"})]}),(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{className:q.label,children:"Description :"}),(0,E.jsx)(b.Z,{"aria-label":"minimum height",minRows:3,placeholder:"Event Description",onChange:function(e){je((0,r.Z)((0,r.Z)({},ye),{},{description:e.target.value}))},style:{minWidth:"100%",maxWidth:"100%",minHeight:143,height:143},value:ye.description||""})]}),(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{style:{paddingTop:10,paddingRight:10},className:q.label,children:"Type :"}),(0,E.jsx)(x.Z,{style:{minWidth:250},disabled:!1,options:T.u||[],getOptionLabel:function(e){return e.label||""},value:T.u.find((function(e){return e.value===ye.type})),isOptionEqualToValue:function(e,n){return(null===e||void 0===e?void 0:e.value)===n},onChange:function(e){var n,t,i;je((0,r.Z)((0,r.Z)({},ye),{},{type:null===(n=T.u[null===(t=e.target)||void 0===t||null===(i=t.dataset)||void 0===i?void 0:i.optionIndex])||void 0===n?void 0:n.value}))},id:"disable-close-on-select",renderInput:function(e){return(0,E.jsx)(g.Z,(0,r.Z)((0,r.Z)({},e),{},{variant:"outlined",required:!0,helperText:U.includes("type")?"Event Type is required":"",error:U.includes("type"),onFocus:function(){V(U.filter((function(e){return"type"!==e})))},fullWidth:!0,id:"event-type",placeholder:"Type"}))}})]}),!e.hideAudienceCategory&&(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{style:{paddingTop:10,paddingRight:10},className:q.label,children:"Audience Category :"}),(0,E.jsx)(x.Z,{style:{minWidth:250},disabled:!1,options:w.k||[],getOptionLabel:function(e){return e.label||""},value:w.k.find((function(e){return e.value===ye.audianceCategory})),isOptionEqualToValue:function(e,n){return(null===e||void 0===e?void 0:e.value)===n},onChange:function(e){var n,t,i;je((0,r.Z)((0,r.Z)({},ye),{},{audianceCategory:null===(n=w.k[null===(t=e.target)||void 0===t||null===(i=t.dataset)||void 0===i?void 0:i.optionIndex])||void 0===n?void 0:n.value}))},id:"disable-close-on-select",renderInput:function(e){return(0,E.jsx)(g.Z,(0,r.Z)((0,r.Z)({},e),{},{variant:"outlined",required:!0,helperText:U.includes("audianceCategory")?"Audience Category is required":"",error:U.includes("audianceCategory"),onFocus:function(){V(U.filter((function(e){return"audianceCategory"!==e})))},fullWidth:!0,id:"event-type",placeholder:"audience"}))}}),"institution"===ye.audianceCategory&&(0,E.jsx)(d.Z,{children:(0,E.jsxs)(f.Z,{children:[(0,E.jsx)(C.Z,{checked:se,onChange:function(){ce(!se)}}),(0,E.jsx)("span",{children:"Include Caregivers"})]})})]}),e.hideAudienceCategory&&(0,E.jsx)(d.Z,{children:(0,E.jsxs)(f.Z,{children:[(0,E.jsx)(C.Z,{checked:se,onChange:function(){ce(!se)}}),(0,E.jsx)("span",{children:"Include Caregivers"})]})})]}),(0,E.jsxs)(j.ZP,{item:!0,xs:6,children:[(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{style:{paddingTop:10,paddingRight:10},className:q.label,children:"Owner :"}),(0,E.jsx)(x.Z,{style:{minWidth:250},disabled:!1,options:ae.filter((function(e){var n,t;return"Admin"===(null===(n=e.profile)||void 0===n?void 0:n.name)||"Faculty"===(null===(t=e.profile)||void 0===t?void 0:t.name)}))||[],getOptionLabel:function(e){return e.name||""},value:ae.find((function(e){return e._id===ye.owner})),isOptionEqualToValue:function(e,n){return(null===e||void 0===e?void 0:e._id)===n},onChange:function(e){var n,t,i;je((0,r.Z)((0,r.Z)({},ye),{},{owner:null===(n=ae[null===(t=e.target)||void 0===t||null===(i=t.dataset)||void 0===i?void 0:i.optionIndex])||void 0===n?void 0:n._id}))},id:"disable-close-on-select",renderInput:function(e){return(0,E.jsx)(g.Z,(0,r.Z)((0,r.Z)({},e),{},{variant:"outlined",required:!0,helperText:U.includes("owner")?"Owner is required":"",error:U.includes("owner"),onFocus:function(){V(U.filter((function(e){return"owner"!==e})))},fullWidth:!0,id:"event-type",placeholder:"Owner"}))}})]}),(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{style:{paddingRight:10},className:q.label,children:"Notification Mode :"}),(0,E.jsx)(x.Z,{style:{minWidth:250},disabled:!1,options:D.a||[],getOptionLabel:function(e){return e.label||""},value:D.a.find((function(e){return e.value===ye.notificationMode})),isOptionEqualToValue:function(e,n){return(null===e||void 0===e?void 0:e.value)===n},onChange:function(e){var n,t,i;je((0,r.Z)((0,r.Z)({},ye),{},{notificationMode:null===(n=D.a[null===(t=e.target)||void 0===t||null===(i=t.dataset)||void 0===i?void 0:i.optionIndex])||void 0===n?void 0:n.value}))},id:"disable-close-on-select",renderInput:function(e){return(0,E.jsx)(g.Z,(0,r.Z)((0,r.Z)({},e),{},{variant:"outlined",required:!0,helperText:U.includes("notificationMode")?"Notification Mode is required":"",error:U.includes("notificationMode"),onFocus:function(){V(U.filter((function(e){return"notificationMode"!==e})))},fullWidth:!0,id:"event-type",placeholder:"Notification"}))}})]}),(0,E.jsxs)(d.Z,{style:{marginBottom:35},children:[(0,E.jsx)(f.Z,{style:{paddingTop:10,paddingRight:10},className:q.label,children:"Start Date/Time :"}),(0,E.jsx)(g.Z,{id:"datetime-local",type:"datetime-local",defaultValue:"2017-05-24T10:30",value:ye.startDate,onChange:function(e){je((0,r.Z)((0,r.Z)({},ye),{},{startDate:e.target.value}))},sx:{minWidth:250},InputLabelProps:{shrink:!0}})]}),(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{style:{paddingTop:10,paddingRight:10},className:q.label,children:"End Date/Time :"}),(0,E.jsx)(g.Z,{id:"datetime-local",type:"datetime-local",defaultValue:"2017-05-24T10:30",value:ye.endDate,onChange:function(e){je((0,r.Z)((0,r.Z)({},ye),{},{endDate:e.target.value}))},sx:{minWidth:250},InputLabelProps:{shrink:!0}})]}),(0,E.jsxs)(d.Z,{style:{marginBottom:20},children:[(0,E.jsx)(f.Z,{style:{paddingTop:10,paddingRight:10},className:q.label,children:"Attachment :"}),(0,E.jsxs)("span",{children:[(0,E.jsx)("input",{ref:O,id:"fileInput",accept:"application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, image/*",onChange:function(e){return n=e.target.files[0],console.log(n),me(n),void fe(((null===n||void 0===n?void 0:n.size)/1048576).toFixed(2));var n},type:"file",name:"file"}),JSON.stringify(null===ye||void 0===ye?void 0:ye.attachment)!==JSON.stringify({})&&(0,E.jsx)("span",{children:(0,E.jsx)(y.Z,{Button:!0,style:{paddingTop:10,cursor:"pointer"},onClick:function(){O.current.value="",je((0,r.Z)((0,r.Z)({},ye),{},{attachment:{}}))}})}),U.includes("fileSize")&&(0,E.jsx)("div",{style:{color:"#f44336",fontSize:"0.75rem",marginTop:3,textAlign:"left",fontWeight:400},children:"File size can not be more than 10MB"})]})]})]})]})}),!0!==e.hideAudienceCategory&&""!==ye.audianceCategory&&"institution"!==ye.audianceCategory&&(0,E.jsxs)(s.Fragment,{children:[(0,E.jsx)(f.Z,{style:{marginTop:0},className:q.header,children:"Audience Detail :"}),"users"===ye.audianceCategory&&(0,E.jsx)(S.Z,{selectedUsers:function(e){G((0,o.Z)(e))}}),"classes"===ye.audianceCategory&&(0,E.jsx)(I.Z,{selectedUsers:function(e){G((0,o.Z)(e))}}),"profile"===ye.audianceCategory&&(0,E.jsx)(k.Z,{selectedUsers:function(e){G((0,o.Z)(e))}})]}),(0,E.jsx)(Z.x7,{})]})}},9823:function(e,n,t){var i=t(5318);n.Z=void 0;var a=i(t(5649)),o=t(184),r=(0,a.default)((0,o.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close");n.Z=r}}]);
//# sourceMappingURL=1005.5744e8a0.chunk.js.map