"use strict";(self.webpackChunkYugiTournamnet=self.webpackChunkYugiTournamnet||[]).push([[445],{3445:(K,g,l)=>{l.r(g),l.d(g,{AdminModule:()=>H});var u=l(177),p=l(6878),e=l(540),m=l(3665),f=l(9101),y=l(6375),F=l(5312),_=l(1626);let k=(()=>{class r{constructor(t){this.http=t,this.baseUrl=F.c.apiUrl}resetLeague(){return this.http.post(`${this.baseUrl}/league/reset`,{},{responseType:"text"})}static{this.\u0275fac=function(n){return new(n||r)(e.KVO(_.Qq))}}static{this.\u0275prov=e.jDH({token:r,factory:r.\u0275fac,providedIn:"root"})}}return r})();var b=l(5794);function v(r,o){if(1&r){const t=e.RV6();e.j41(0,"div",13)(1,"div",14)(2,"h2",15),e.EFF(3,"\u062a\u0623\u0643\u064a\u062f \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u062a\u0639\u064a\u064a\u0646"),e.k0s(),e.j41(4,"p"),e.EFF(5,"\u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f \u0645\u0646 \u0631\u063a\u0628\u062a\u0643 \u0641\u064a \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u062f\u0648\u0631\u064a\u061f \u0633\u064a\u062a\u0645 \u0645\u0633\u062d \u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0628\u0627\u0631\u064a\u0627\u062a \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644."),e.k0s(),e.j41(6,"div",16)(7,"button",17),e.bIt("click",function(){e.eBV(t);const s=e.XpG();return e.Njj(s.closeResetModal())}),e.EFF(8," \u0625\u0644\u063a\u0627\u0621 "),e.k0s(),e.j41(9,"button",18),e.bIt("click",function(){e.eBV(t);const s=e.XpG();return e.Njj(s.resetTournament())}),e.EFF(10," \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 "),e.k0s()()()()}}let M=(()=>{class r{constructor(t,n,s,i,a){this.playerService=t,this.matchService=n,this.messageService=s,this.leagueService=i,this.toastr=a,this.totalPlayers=0,this.totalMatches=0,this.totalMessages=0,this.showResetModal=!1}ngOnInit(){this.loadStats()}loadStats(){this.playerService.getrank().subscribe({next:t=>{t&&(this.totalPlayers=t.length)},error:t=>{this.toastr.error("\u062d\u0635\u0644 \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062c\u0644\u0628 \u0639\u062f\u062f \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646")}}),this.matchService.getMatches().subscribe({next:t=>{t&&(this.totalMatches=t.length)},error:t=>{this.toastr.error("\u062d\u0635\u0644 \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062c\u0644\u0628 \u0639\u062f\u062f \u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a"),console.error(t)}}),this.messageService.getMessages().subscribe({next:t=>{t?this.totalMessages=t.messages.length:this.toastr.error("\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644")},error:t=>{this.toastr.error("\u062d\u0635\u0644 \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062c\u0644\u0628 \u0639\u062f\u062f \u0627\u0644\u0631\u0633\u0627\u0626\u0644"),console.error(t)}})}openResetModal(){this.showResetModal=!0}closeResetModal(){this.showResetModal=!1}resetTournament(){this.leagueService.resetLeague().subscribe({next:t=>{this.toastr.success(t),this.loadStats(),this.showResetModal=!1},error:t=>{this.toastr.error("\u0641\u0634\u0644 \u0641\u064a \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u062f\u0648\u0631\u064a"),console.error(t)}})}static{this.\u0275fac=function(n){return new(n||r)(e.rXU(m.x),e.rXU(f.T),e.rXU(y.b),e.rXU(k),e.rXU(b.tw))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-admin-dashboard"]],decls:27,vars:4,consts:[[1,"container","mx-auto","p-4"],[1,"text-2xl","font-bold","text-center","mb-6"],[1,"grid","grid-cols-1","md:grid-cols-3","gap-4","mb-8"],[1,"bg-white","shadow-md","rounded","p-6","text-center"],[1,"text-lg","font-semibold","mb-2"],[1,"text-3xl","font-bold","text-blue-600"],[1,"text-3xl","font-bold","text-green-600"],[1,"text-3xl","font-bold","text-red-600"],[1,"flex","justify-center","space-x-4"],["routerLink","/admin/players",1,"bg-blue-500","hover:bg-blue-700","text-white","font-bold","py-2","px-4","rounded"],["routerLink","/admin/inbox",1,"bg-green-500","hover:bg-green-700","text-white","font-bold","py-2","px-4","rounded"],[1,"bg-red-500","hover:bg-red-700","text-white","font-bold","py-2","px-4","rounded",3,"click"],["class","fixed inset-0 flex items-center justify-center bg-black bg-opacity-50",4,"ngIf"],[1,"fixed","inset-0","flex","items-center","justify-center","bg-black","bg-opacity-50"],[1,"bg-white","p-6","rounded-lg"],[1,"text-lg","font-bold","mb-4"],[1,"mt-4","flex","justify-end"],[1,"bg-gray-500","px-4","py-2","text-white","rounded","mr-2",3,"click"],[1,"bg-red-500","px-4","py-2","text-white","rounded",3,"click"]],template:function(n,s){1&n&&(e.j41(0,"div",0)(1,"h2",1),e.EFF(2,"\u0644\u0648\u062d\u0629 \u062a\u062d\u0643\u0645 \u0627\u0644\u0625\u062f\u0627\u0631\u0629"),e.k0s(),e.j41(3,"div",2)(4,"div",3)(5,"h3",4),e.EFF(6,"\u0639\u062f\u062f \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646"),e.k0s(),e.j41(7,"p",5),e.EFF(8),e.k0s()(),e.j41(9,"div",3)(10,"h3",4),e.EFF(11,"\u0639\u062f\u062f \u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a"),e.k0s(),e.j41(12,"p",6),e.EFF(13),e.k0s()(),e.j41(14,"div",3)(15,"h3",4),e.EFF(16,"\u0639\u062f\u062f \u0627\u0644\u0631\u0633\u0627\u0626\u0644"),e.k0s(),e.j41(17,"p",7),e.EFF(18),e.k0s()()(),e.j41(19,"div",8)(20,"a",9),e.EFF(21," \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646 \u0648\u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a "),e.k0s(),e.j41(22,"a",10),e.EFF(23," \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0648\u0627\u0631\u062f "),e.k0s(),e.j41(24,"button",11),e.bIt("click",function(){return s.openResetModal()}),e.EFF(25," \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u062f\u0648\u0631\u064a "),e.k0s()(),e.DNE(26,v,11,0,"div",12),e.k0s()),2&n&&(e.R7$(8),e.JRh(s.totalPlayers),e.R7$(5),e.JRh(s.totalMatches),e.R7$(5),e.JRh(s.totalMessages),e.R7$(8),e.Y8G("ngIf",s.showResetModal))},dependencies:[u.bT,p.Wk]})}}return r})();function x(r,o,t,n,s,i,a){try{var c=r[i](a),d=c.value}catch(W){return void t(W)}c.done?o(d):Promise.resolve(d).then(n,s)}var h=l(4341),C=l(1780);function P(r,o){if(1&r){const t=e.RV6();e.j41(0,"li",11),e.bIt("click",function(){const i=e.eBV(t).$implicit,a=e.XpG(2);return e.Njj(a.selectPlayer(i))}),e.EFF(1),e.j41(2,"button",12),e.bIt("click",function(s){const a=e.eBV(t).$implicit,c=e.XpG(2);return e.Njj(c.confirmDelete(a,s))}),e.EFF(3," X "),e.k0s()()}if(2&r){const t=o.$implicit,n=e.XpG(2);e.AVh("bg-blue-600",(null==n.selectedPlayer?null:n.selectedPlayer.playerId)===t.playerId),e.R7$(1),e.SpI(" ",t.fullName," ")}}function I(r,o){if(1&r&&(e.j41(0,"ul"),e.DNE(1,P,4,3,"li",10),e.k0s()),2&r){const t=e.XpG();e.R7$(1),e.Y8G("ngForOf",t.players)}}function T(r,o){if(1&r){const t=e.RV6();e.j41(0,"button",13),e.bIt("click",function(){e.eBV(t);const s=e.XpG();return e.Njj(s.openModal())}),e.EFF(1," Add Player "),e.k0s()}}function E(r,o){if(1&r){const t=e.RV6();e.j41(0,"tr",20)(1,"td",21),e.EFF(2),e.k0s(),e.j41(3,"td",21),e.EFF(4),e.k0s(),e.j41(5,"td",21),e.EFF(6),e.k0s(),e.j41(7,"td",22)(8,"button",23),e.bIt("click",function(){const i=e.eBV(t).$implicit,a=e.XpG(2);return e.Njj(a.updateMatch(i.matchId,i.player1Id))}),e.EFF(9),e.k0s(),e.j41(10,"button",24),e.bIt("click",function(){const i=e.eBV(t).$implicit,a=e.XpG(2);return e.Njj(a.updateMatch(i.matchId,i.player2Id))}),e.EFF(11),e.k0s(),e.j41(12,"button",25),e.bIt("click",function(){const i=e.eBV(t).$implicit,a=e.XpG(2);return e.Njj(a.updateMatch(i.matchId,null))}),e.EFF(13),e.k0s(),e.j41(14,"button",26),e.bIt("click",function(){const i=e.eBV(t).$implicit,a=e.XpG(2);return e.Njj(a.resetMatch(i.matchId))}),e.EFF(15),e.k0s()()()}if(2&r){const t=o.$implicit,n=o.index,s=e.XpG(2);e.Y8G("ngClass",n%2==0?"bg-white":"bg-gray-100"),e.R7$(2),e.JRh(t.player1Name),e.R7$(2),e.JRh(t.player2Name),e.R7$(2),e.Lme(" ",t.score1," - ",t.score2," "),e.R7$(2),e.Y8G("disabled",s.loadingMatches[t.matchId]),e.R7$(1),e.SpI(" ",s.loadingMatches[t.matchId]?"Load":"Win P1"," "),e.R7$(1),e.Y8G("disabled",s.loadingMatches[t.matchId]),e.R7$(1),e.SpI(" ",s.loadingMatches[t.matchId]?"Load":"Win P2"," "),e.R7$(1),e.Y8G("disabled",s.loadingMatches[t.matchId]),e.R7$(1),e.SpI(" ",s.loadingMatches[t.matchId]?"Load":"Draw"," "),e.R7$(1),e.Y8G("disabled",s.loadingMatches[t.matchId]),e.R7$(1),e.SpI(" ",s.loadingMatches[t.matchId]?"Load":"Undo"," ")}}function w(r,o){if(1&r&&(e.j41(0,"div",14)(1,"h2",15),e.EFF(2),e.k0s(),e.j41(3,"table",16)(4,"thead")(5,"tr",17)(6,"th",18),e.EFF(7,"Player 1"),e.k0s(),e.j41(8,"th",18),e.EFF(9,"Player 2"),e.k0s(),e.j41(10,"th",18),e.EFF(11,"Result"),e.k0s(),e.j41(12,"th",18),e.EFF(13,"Actions"),e.k0s()()(),e.j41(14,"tbody"),e.DNE(15,E,16,13,"tr",19),e.k0s()()()),2&r){const t=e.XpG();e.R7$(2),e.SpI(" Matches for ",t.selectedPlayer.fullName," "),e.R7$(13),e.Y8G("ngForOf",t.playerMatches)}}function R(r,o){if(1&r){const t=e.RV6();e.j41(0,"div",27)(1,"div",28)(2,"h2",29),e.EFF(3,"Confirm Delete"),e.k0s(),e.j41(4,"p"),e.EFF(5," Are you sure you want to delete "),e.j41(6,"strong"),e.EFF(7),e.k0s(),e.EFF(8,"? "),e.k0s(),e.j41(9,"div",30)(10,"button",31),e.bIt("click",function(){e.eBV(t);const s=e.XpG();return e.Njj(s.showDeleteModal=!1)}),e.EFF(11," Cancel "),e.k0s(),e.j41(12,"button",32),e.bIt("click",function(){e.eBV(t);const s=e.XpG();return e.Njj(s.deleteConfirmedPlayer())}),e.EFF(13," Delete "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(7),e.JRh(null==t.selectedPlayerToDelete?null:t.selectedPlayerToDelete.fullName)}}function A(r,o){if(1&r){const t=e.RV6();e.j41(0,"div",27)(1,"div",28)(2,"h2",29),e.EFF(3,"Add New Player"),e.k0s(),e.j41(4,"input",33),e.bIt("ngModelChange",function(s){e.eBV(t);const i=e.XpG();return e.Njj(i.newPlayerName=s)}),e.k0s(),e.j41(5,"div",30)(6,"button",34),e.bIt("click",function(){e.eBV(t);const s=e.XpG();return e.Njj(s.closeModal())}),e.EFF(7," Cancel "),e.k0s(),e.j41(8,"button",35),e.bIt("click",function(){e.eBV(t);const s=e.XpG();return e.Njj(s.addPlayer())}),e.EFF(9," Add "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(4),e.Y8G("ngModel",t.newPlayerName)}}const D=function(r,o){return{"w-64":r,"w-0 p-0":o}};let $=(()=>{class r{constructor(t,n,s){this.playerService=t,this.matchService=n,this.toastr=s,this.players=[],this.selectedPlayer=null,this.playerMatches=[],this.showModal=!1,this.newPlayerName="",this.isSidebarOpen=!1,this.showDeleteModal=!1,this.loadingMatches={},this.requestQueue=[],this.isProcessingQueue=!1,this.updateUITimer=null,this.DEBOUNCE_TIME=500,this.selectedPlayerToDelete=null}ngOnInit(){this.playerService.ranking$.subscribe(t=>{this.players=t})}toggleSidebar(){this.isSidebarOpen=!this.isSidebarOpen}selectPlayer(t){this.selectedPlayer=t,this.loadMatches()}loadMatches(){this.selectedPlayer&&this.matchService.getMatches().subscribe(t=>{this.playerMatches=t.filter(n=>n.player1Id===this.selectedPlayer.playerId||n.player2Id===this.selectedPlayer.playerId),this.playerMatches.forEach(n=>{this.loadingMatches[n.matchId]=!1})})}addToQueue(t){this.requestQueue.push(t),this.processQueue()}processQueue(){var t=this;return function j(r){return function(){var o=this,t=arguments;return new Promise(function(n,s){var i=r.apply(o,t);function a(d){x(i,n,s,a,c,"next",d)}function c(d){x(i,n,s,a,c,"throw",d)}a(void 0)})}}(function*(){if(t.isProcessingQueue||0===t.requestQueue.length)return;t.isProcessingQueue=!0;const n=t.requestQueue.shift();if(n)try{yield n()}catch(s){console.error("Error processing request:",s)}t.isProcessingQueue=!1,t.processQueue()})()}debounceUpdateUI(){this.updateUITimer&&clearTimeout(this.updateUITimer),this.updateUITimer=setTimeout(()=>{this.loadMatches(),this.playerService.refreshRanking()},this.DEBOUNCE_TIME)}updateMatch(t,n){this.loadingMatches[t]=!0,this.addToQueue(()=>new Promise((s,i)=>{this.matchService.updateMatch(t,n).subscribe({next:a=>{a.success?(this.toastr.success(a.message),this.debounceUpdateUI()):this.toastr.error(a.message),this.loadingMatches[t]=!1,s()},error:a=>{this.toastr.error("Error updating match","Error"),this.loadingMatches[t]=!1,i(a)}})}))}resetMatch(t){this.loadingMatches[t]=!0,this.addToQueue(()=>new Promise((n,s)=>{this.matchService.resetMatch(t).subscribe({next:i=>{i.success?(this.toastr.success(i.message),this.debounceUpdateUI()):this.toastr.error(i.message,"Error"),this.loadingMatches[t]=!1,n()},error:i=>{this.toastr.error("Error resetting match","Error"),this.loadingMatches[t]=!1,s(i)}})}))}deletePlayer(t,n){n.stopPropagation(),this.playerService.deletePlayer(t).subscribe(()=>{this.toastr.warning("Player deleted!","Deleted"),this.selectedPlayer?.playerId===t&&(this.selectedPlayer=null,this.playerMatches=[])})}openModal(){this.showModal=!0}closeModal(){this.showModal=!1,this.newPlayerName=""}addPlayer(){this.newPlayerName.trim()&&this.playerService.addPlayer(this.newPlayerName).subscribe(()=>{this.toastr.success("Player added successfully!","Success"),this.closeModal()})}confirmDelete(t,n){n.stopPropagation(),this.selectedPlayerToDelete=t,this.showDeleteModal=!0}deleteConfirmedPlayer(){this.selectedPlayerToDelete&&(this.playerService.deletePlayer(this.selectedPlayerToDelete.playerId).subscribe(t=>{t.success?(this.players=this.players.filter(n=>n.playerId!==this.selectedPlayerToDelete?.playerId),this.toastr.success(t.message)):this.toastr.error(t.message,"Error")}),this.showDeleteModal=!1,this.selectedPlayerToDelete=null)}static{this.\u0275fac=function(n){return new(n||r)(e.rXU(m.x),e.rXU(f.T),e.rXU(b.tw))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-players"]],decls:15,vars:9,consts:[[1,"flex","h-screen","transition-all","duration-300"],[1,"bg-gray-800","text-white","p-4","overflow-hidden","transition-all","duration-300",3,"ngClass"],[1,"text-lg","font-bold","mb-4","flex","justify-between","overflow-hidden"],[1,"text-gray-200","text-3xl",3,"click"],[4,"ngIf"],["class","mt-4 w-full bg-green-500 p-2 rounded",3,"click",4,"ngIf"],[1,"flex-1","p-2","transition-all","duration-300"],[1,"bg-blue-500","text-white","px-3","py-2","rounded","mb-4",3,"click"],["class","w-5/6 mx-auto",4,"ngIf"],["class","fixed inset-0 flex items-center justify-center bg-black bg-opacity-50",4,"ngIf"],["class","flex items-center justify-between p-2 cursor-pointer rounded-md hover:bg-gray-700",3,"bg-blue-600","click",4,"ngFor","ngForOf"],[1,"flex","items-center","justify-between","p-2","cursor-pointer","rounded-md","hover:bg-gray-700",3,"click"],[1,"bg-red-500","px-2","py-1","text-sm","rounded",3,"click"],[1,"mt-4","w-full","bg-green-500","p-2","rounded",3,"click"],[1,"w-5/6","mx-auto"],[1,"text-2xl","font-bold","mb-4","text-center"],[1,"w-full","border-collapse","border","border-gray-300","text-center"],[1,"bg-gray-200"],[1,"border","p-2"],["class","border",3,"ngClass",4,"ngFor","ngForOf"],[1,"border",3,"ngClass"],[1,"p-2","font-bold"],[1,"p-2"],[1,"bg-blue-500","px-2","py-1","rounded","text-white","hover:bg-blue-400","transition-all",3,"disabled","click"],[1,"bg-blue-500","px-2","py-1","rounded","text-white","mx-1","hover:bg-blue-400","transition-all",3,"disabled","click"],[1,"bg-yellow-500","px-2","py-1","rounded","text-white","hover:bg-yellow-400","transition-all",3,"disabled","click"],[1,"bg-gray-500","px-2","py-1","rounded","text-white","ml-2","hover:bg-gray-400","transition-all",3,"disabled","click"],[1,"fixed","inset-0","flex","items-center","justify-center","bg-black","bg-opacity-50"],[1,"bg-white","p-6","rounded-lg"],[1,"text-lg","font-bold","mb-4"],[1,"mt-4","flex","justify-end"],[1,"bg-gray-500","px-4","py-2","text-white","rounded","mr-2",3,"click"],[1,"bg-red-500","px-4","py-2","text-white","rounded",3,"click"],["type","text","placeholder","Enter player name",1,"border","p-2","w-full",3,"ngModel","ngModelChange"],[1,"bg-red-500","px-4","py-2","text-white","rounded","mr-2",3,"click"],[1,"bg-green-500","px-4","py-2","text-white","rounded",3,"click"]],template:function(n,s){1&n&&(e.j41(0,"div",0)(1,"div",1)(2,"h2",2),e.EFF(3," Players "),e.j41(4,"button",3),e.bIt("click",function(){return s.isSidebarOpen=!1}),e.EFF(5," \xd7 "),e.k0s()(),e.DNE(6,I,2,1,"ul",4),e.DNE(7,T,2,0,"button",5),e.k0s(),e.j41(8,"div",6)(9,"button",7),e.bIt("click",function(){return s.isSidebarOpen=!s.isSidebarOpen}),e.EFF(10," \u2630 Players "),e.k0s(),e.DNE(11,w,16,2,"div",8),e.nrm(12,"app-ranking"),e.k0s(),e.DNE(13,R,14,1,"div",9),e.DNE(14,A,10,1,"div",9),e.k0s()),2&n&&(e.R7$(1),e.Y8G("ngClass",e.l_i(6,D,s.isSidebarOpen,!s.isSidebarOpen)),e.R7$(5),e.Y8G("ngIf",s.isSidebarOpen),e.R7$(1),e.Y8G("ngIf",s.isSidebarOpen),e.R7$(4),e.Y8G("ngIf",s.selectedPlayer),e.R7$(2),e.Y8G("ngIf",s.showDeleteModal),e.R7$(1),e.Y8G("ngIf",s.showModal))},dependencies:[u.YU,u.Sq,u.bT,h.me,h.BC,h.vS,C.i],styles:["table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse}th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]{border:1px solid #d1d5db;padding:8px;text-align:center}th[_ngcontent-%COMP%]{background-color:#ef4444;color:#fff}td.bg-gray-200[_ngcontent-%COMP%]{background-color:#e5e7eb}"]})}}return r})(),G=(()=>{class r{transform(t,n=2){if(!t)return"";let s=new Date(t);return s.setHours(s.getHours()+n),s.toLocaleString()}static{this.\u0275fac=function(n){return new(n||r)}}static{this.\u0275pipe=e.EJ8({name:"utcToLocal",type:r,pure:!0})}}return r})();function S(r,o){1&r&&(e.j41(0,"div",6),e.EFF(1," \u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644 \u0647\u0646\u0627 \u{1f4ed} "),e.k0s())}const N=function(r,o){return{"border-green-500":r,"border-red-500":o}},U=function(r,o){return{"bg-red-500":r,"bg-green-500":o}};function X(r,o){if(1&r){const t=e.RV6();e.j41(0,"div",9)(1,"button",10),e.bIt("click",function(){const i=e.eBV(t).$implicit,a=e.XpG(2);return e.Njj(a.toggleMarkMessage(i))}),e.EFF(2),e.k0s(),e.j41(3,"p",11),e.EFF(4),e.k0s(),e.j41(5,"p",12),e.EFF(6),e.k0s(),e.j41(7,"p",13),e.EFF(8),e.nI1(9,"utcToLocal"),e.k0s()()}if(2&r){const t=o.$implicit;e.Y8G("ngClass",e.l_i(9,N,t.isRead,!t.isRead)),e.R7$(1),e.Y8G("ngClass",e.l_i(12,U,!t.isRead,t.isRead)),e.R7$(1),e.SpI(" ",t.isRead?"Mark Unread ":"Mark as Read "," "),e.R7$(2),e.JRh(t.content),e.R7$(2),e.Lme(" \u0645\u0646: ",t.senderFullName," (",t.senderPhoneNumber,") "),e.R7$(2),e.SpI(" ",e.bMT(9,7,t.sentAt)," : \u0628\u062a\u0627\u0631\u064a\u062e ")}}function Y(r,o){if(1&r&&(e.j41(0,"div",7),e.DNE(1,X,10,15,"div",8),e.k0s()),2&r){const t=e.XpG();e.R7$(1),e.Y8G("ngForOf",t.filteredMessages)}}const O=function(r,o){return{"bg-green-500 text-white":r,"bg-gray-200":o}},V=function(r,o){return{"bg-red-500 text-white":r,"bg-gray-200":o}},B=function(r,o){return{"bg-blue-500 text-white":r,"bg-gray-200":o}},Q=[{path:"",component:M},{path:"players",component:$},{path:"inbox",component:(()=>{class r{constructor(t,n){this.messageService=t,this.toastr=n,this.messages=[],this.filteredMessages=[],this.activeTab="all"}ngOnInit(){this.loadMessages()}loadMessages(){this.messageService.getMessages().subscribe({next:t=>{t?(this.messages=t.messages.sort((n,s)=>new Date(s.sentAt).getTime()-new Date(n.sentAt).getTime()),this.filterMessages()):this.toastr.error("\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0622\u0646")},error:t=>{this.toastr.error("\u062d\u0635\u0644 \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062c\u0644\u0628 \u0627\u0644\u0631\u0633\u0627\u0626\u0644"),console.error(t)}})}filterMessages(){this.filteredMessages="all"===this.activeTab?this.messages:this.messages.filter("read"===this.activeTab?t=>t.isRead:t=>!t.isRead)}changeTab(t){this.activeTab=t,this.filterMessages()}toggleMarkMessage(t){this.messageService.toggleMarkMessage(t.id,!t.isRead).subscribe({next:n=>{n.success&&(this.toastr.success("\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u062d\u0627\u0644\u0629 \u0627\u0644\u0631\u0633\u0627\u0644\u0629"),t.isRead=!t.isRead,this.filterMessages())},error:n=>{this.toastr.error("\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u062d\u0627\u0644\u0629"),console.error(n)}})}static{this.\u0275fac=function(n){return new(n||r)(e.rXU(y.b),e.rXU(b.tw))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-inbox"]],decls:12,vars:14,consts:[[1,"container","mx-auto","p-4"],[1,"text-2xl","font-bold","text-center","mb-6"],[1,"flex","justify-center","mb-6"],[1,"px-4","py-2","mx-2","rounded-md","border","border-gray-300",3,"ngClass","click"],["class","text-center text-gray-500",4,"ngIf"],["class","space-y-4",4,"ngIf"],[1,"text-center","text-gray-500"],[1,"space-y-4"],["class","bg-white shadow-md rounded p-4 border-l-4 w-4/5 mx-auto relative",3,"ngClass",4,"ngFor","ngForOf"],[1,"bg-white","shadow-md","rounded","p-4","border-l-4","w-4/5","mx-auto","relative",3,"ngClass"],[1,"absolute","top-3","right-3","px-3","py-1","rounded-md","text-white","text-sm",3,"ngClass","click"],[1,"text-gray-700","mt-6"],[1,"text-sm","text-gray-500","mt-2"],[1,"text-sm","text-gray-500"]],template:function(n,s){1&n&&(e.j41(0,"div",0)(1,"h2",1),e.EFF(2,"\u{1f4e5} \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0648\u0627\u0631\u062f"),e.k0s(),e.j41(3,"div",2)(4,"button",3),e.bIt("click",function(){return s.changeTab("read")}),e.EFF(5," \u0627\u0644\u0645\u0642\u0631\u0648\u0621\u0629 \u2705 "),e.k0s(),e.j41(6,"button",3),e.bIt("click",function(){return s.changeTab("unread")}),e.EFF(7," \u063a\u064a\u0631 \u0627\u0644\u0645\u0642\u0631\u0648\u0621\u0629 \u274c "),e.k0s(),e.j41(8,"button",3),e.bIt("click",function(){return s.changeTab("all")}),e.EFF(9," \u0643\u0644 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 "),e.k0s()(),e.DNE(10,S,2,0,"div",4),e.DNE(11,Y,2,1,"div",5),e.k0s()),2&n&&(e.R7$(4),e.Y8G("ngClass",e.l_i(5,O,"read"===s.activeTab,"read"!==s.activeTab)),e.R7$(2),e.Y8G("ngClass",e.l_i(8,V,"unread"===s.activeTab,"unread"!==s.activeTab)),e.R7$(2),e.Y8G("ngClass",e.l_i(11,B,"all"===s.activeTab,"all"!==s.activeTab)),e.R7$(2),e.Y8G("ngIf",0===s.filteredMessages.length),e.R7$(1),e.Y8G("ngIf",s.filteredMessages.length>0))},dependencies:[u.YU,u.Sq,u.bT,G]})}}return r})()}];let L=(()=>{class r{static{this.\u0275fac=function(n){return new(n||r)}}static{this.\u0275mod=e.$C({type:r})}static{this.\u0275inj=e.G2t({imports:[p.iI.forChild(Q),p.iI]})}}return r})();var J=l(7879);let H=(()=>{class r{static{this.\u0275fac=function(n){return new(n||r)}}static{this.\u0275mod=e.$C({type:r})}static{this.\u0275inj=e.G2t({imports:[u.MD,L,h.YN,_.q1,J.PlayerModule]})}}return r})()}}]);