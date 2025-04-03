"use strict";(self.webpackChunkYugiTournamnet=self.webpackChunkYugiTournamnet||[]).push([[445],{3445:(re,m,o)=>{o.r(m),o.d(m,{AdminModule:()=>te});var l=o(177),h=o(6878),e=o(540),f=o(3665),_=o(9101),y=o(6375),p=o(5794);function k(r,i){if(1&r&&(e.j41(0,"div",12)(1,"h2",13),e.EFF(2),e.k0s()()),2&r){const t=e.XpG();e.R7$(2),e.JRh(t.totalMessagesLeft)}}let v=(()=>{class r{constructor(t,s,n,a){this.playerService=t,this.matchService=s,this.messageService=n,this.toastr=a,this.totalPlayers=0,this.totalMatches=0,this.totalMatchesLeft=0,this.totalMessages=0,this.totalMessagesLeft=0}ngOnInit(){this.loadStats()}loadStats(){this.playerService.getrank().subscribe({next:t=>{t&&(this.totalPlayers=t.length)},error:t=>{this.toastr.error(t.message)}}),this.matchService.getMatches().subscribe({next:t=>{t&&(this.totalMatches=t.length,this.totalMatchesLeft=t.filter(s=>0==s.isCompleted).length)},error:t=>{this.toastr.error(t.message)}}),this.messageService.getMessages().subscribe({next:t=>{t?(this.totalMessages=t.messages.length,this.totalMessagesLeft=t.messages.filter(s=>0==s.isRead).length):this.toastr.error("\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644")},error:t=>{this.toastr.error(t.message)}})}static{this.\u0275fac=function(s){return new(s||r)(e.rXU(f.x),e.rXU(_.T),e.rXU(y.b),e.rXU(p.tw))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-admin-dashboard"]],decls:30,vars:5,consts:[[1,"container","mx-auto","p-4"],[1,"text-2xl","font-bold","text-center","mb-6"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4","mb-8"],[1,"bg-white","shadow-md","rounded","p-6","text-center"],[1,"text-lg","font-semibold","mb-2"],[1,"text-3xl","font-bold","text-red-600"],[1,"text-3xl","font-bold","text-green-600"],[1,"text-3xl","font-bold","text-blue-600"],[1,"flex","justify-center","space-x-4","p-4"],["routerLink","/admin/players",1,"bg-blue-500","hover:bg-blue-700","text-white","font-bold","py-2","px-4","rounded","transition-all"],["routerLink","/admin/inbox",1,"bg-orange-400","hover:bg-orange-500","text-white","font-bold","py-2","px-4","rounded","transition-all","relative"],["class","absolute -top-2 -right-2 w-[30px] h-[30px] rounded-full bg-green-500 flex justify-center items-center",4,"ngIf"],[1,"absolute","-top-2","-right-2","w-[30px]","h-[30px]","rounded-full","bg-green-500","flex","justify-center","items-center"],[1,"text-white","font-bold"]],template:function(s,n){1&s&&(e.j41(0,"div",0)(1,"h2",1),e.EFF(2,"\u0644\u0648\u062d\u0629 \u062a\u062d\u0643\u0645 \u0627\u0644\u0625\u062f\u0627\u0631\u0629"),e.k0s(),e.j41(3,"div",2)(4,"div",3)(5,"h3",4),e.EFF(6,"\u0639\u062f\u062f \u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a \u0627\u0644\u0645\u062a\u0628\u0642\u064a\u0629"),e.k0s(),e.j41(7,"p",5),e.EFF(8),e.k0s()(),e.j41(9,"div",3)(10,"h3",4),e.EFF(11,"\u0639\u062f\u062f \u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a"),e.k0s(),e.j41(12,"p",6),e.EFF(13),e.k0s()(),e.j41(14,"div",3)(15,"h3",4),e.EFF(16,"\u0639\u062f\u062f \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646"),e.k0s(),e.j41(17,"p",7),e.EFF(18),e.k0s()(),e.j41(19,"div",3)(20,"h3",4),e.EFF(21,"\u0639\u062f\u062f \u0627\u0644\u0631\u0633\u0627\u0626\u0644"),e.k0s(),e.j41(22,"p",5),e.EFF(23),e.k0s()()(),e.j41(24,"div",8)(25,"a",9),e.EFF(26," \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646 \u0648\u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a "),e.k0s(),e.j41(27,"a",10),e.EFF(28," \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0648\u0627\u0631\u062f "),e.DNE(29,k,3,1,"div",11),e.k0s()()()),2&s&&(e.R7$(8),e.JRh(n.totalMatchesLeft),e.R7$(5),e.JRh(n.totalMatches),e.R7$(5),e.JRh(n.totalPlayers),e.R7$(5),e.JRh(n.totalMessages),e.R7$(6),e.Y8G("ngIf",n.totalMessagesLeft>0))},dependencies:[l.bT,h.Wk]})}}return r})();function F(r,i,t,s,n,a,u){try{var d=r[a](u),g=d.value}catch(se){return void t(se)}d.done?i(g):Promise.resolve(g).then(s,n)}var C=o(5312),x=o(1626);let j=(()=>{class r{constructor(t){this.http=t,this.baseUrl=C.c.apiUrl}resetLeague(t){return this.http.post(`${this.baseUrl}/league/reset/${t}`,{})}startLeague(t){return this.http.post(`${this.baseUrl}/league/start`,t)}GetCurrentLeague(){return this.http.get(`${this.baseUrl}/league/getCurrentLeague`)}static{this.\u0275fac=function(s){return new(s||r)(e.KVO(x.Qq))}}static{this.\u0275prov=e.jDH({token:r,factory:r.\u0275fac,providedIn:"root"})}}return r})();var c=o(4341);function E(r,i){if(1&r){const t=e.RV6();e.j41(0,"li",15),e.bIt("click",function(){const a=e.eBV(t).$implicit,u=e.XpG(2);return e.Njj(u.selectPlayer(a))}),e.EFF(1),e.j41(2,"button",16),e.bIt("click",function(n){const u=e.eBV(t).$implicit,d=e.XpG(2);return e.Njj(d.confirmDelete(u,n))}),e.EFF(3," X "),e.k0s()()}if(2&r){const t=i.$implicit,s=e.XpG(2);e.AVh("bg-blue-600",(null==s.selectedPlayer?null:s.selectedPlayer.playerId)===t.playerId),e.R7$(1),e.SpI(" ",t.fullName," ")}}function P(r,i){if(1&r&&(e.j41(0,"ul"),e.DNE(1,E,4,3,"li",14),e.k0s()),2&r){const t=e.XpG();e.R7$(1),e.Y8G("ngForOf",t.players)}}function w(r,i){if(1&r){const t=e.RV6();e.j41(0,"button",17),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.openModal())}),e.EFF(1," Add Player "),e.k0s()}}function I(r,i){if(1&r){const t=e.RV6();e.j41(0,"button",18),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.openStartLeagueModal())}),e.EFF(1," \u0628\u062f\u0623 \u062f\u0648\u0631\u064a \u062c\u062f\u064a\u062f "),e.k0s()}}function T(r,i){if(1&r){const t=e.RV6();e.j41(0,"button",19),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.showEndLeagueModal=!0)}),e.EFF(1," \u0627\u0646\u0647\u0627\u0621 \u0627\u0644\u062f\u0648\u0631\u064a "),e.k0s()}}function R(r,i){1&r&&(e.j41(0,"p",23),e.EFF(1," \u0641\u0631\u062f\u064a\u0629 "),e.k0s())}function D(r,i){1&r&&(e.j41(0,"p",26),e.EFF(1," \u0628\u0637\u0648\u0644\u0629 \u0641\u0631\u0642 "),e.k0s())}function G(r,i){if(1&r&&(e.j41(0,"div",20)(1,"div",21)(2,"h3",22),e.EFF(3,"\u0648\u0635\u0641 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(4,"pre",23),e.EFF(5),e.k0s()(),e.j41(6,"div",21)(7,"h3",22),e.EFF(8,"\u0646\u0638\u0627\u0645 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.DNE(9,R,2,0,"p",24),e.DNE(10,D,2,0,"p",25),e.k0s(),e.j41(11,"div",21)(12,"h3",22),e.EFF(13,"\u062a\u0627\u0631\u064a\u062e \u0628\u062f\u0623 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(14,"p",23),e.EFF(15),e.nI1(16,"date"),e.k0s()(),e.j41(17,"div",21)(18,"h3",22),e.EFF(19,"\u0627\u0633\u0645 \u0627\u0644\u0628\u0637\u0648\u0644\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629"),e.k0s(),e.j41(20,"p",23),e.EFF(21),e.k0s()()()),2&r){const t=e.XpG();e.R7$(5),e.JRh(t.leagueData.description),e.R7$(4),e.Y8G("ngIf",0===t.leagueData.typeOfLeague),e.R7$(1),e.Y8G("ngIf",1===t.leagueData.typeOfLeague),e.R7$(5),e.SpI(" ",e.i5U(16,5,t.leagueData.createdOn,"fullDate")," "),e.R7$(6),e.JRh(t.leagueData.name)}}const b=function(r){return{"opacity-50 cursor-not-allowed":r}};function $(r,i){if(1&r){const t=e.RV6();e.j41(0,"tr",33)(1,"td",34),e.EFF(2),e.k0s(),e.j41(3,"td",34),e.EFF(4),e.k0s(),e.j41(5,"td",34),e.EFF(6),e.k0s(),e.j41(7,"td",35)(8,"button",36),e.bIt("click",function(){const a=e.eBV(t).$implicit,u=e.XpG(2);return e.Njj(u.updateMatch(a.matchId,a.player1Id))}),e.EFF(9),e.k0s(),e.j41(10,"button",37),e.bIt("click",function(){const a=e.eBV(t).$implicit,u=e.XpG(2);return e.Njj(u.updateMatch(a.matchId,a.player2Id))}),e.EFF(11),e.k0s(),e.j41(12,"button",38),e.bIt("click",function(){const a=e.eBV(t).$implicit,u=e.XpG(2);return e.Njj(u.updateMatch(a.matchId,null))}),e.EFF(13),e.k0s(),e.j41(14,"button",39),e.bIt("click",function(){const a=e.eBV(t).$implicit,u=e.XpG(2);return e.Njj(u.resetMatch(a.matchId))}),e.EFF(15),e.k0s()()()}if(2&r){const t=i.$implicit,s=i.index,n=e.XpG(2);e.Y8G("ngClass",s%2==0?"bg-white":"bg-gray-100"),e.R7$(2),e.JRh(t.player1Name),e.R7$(2),e.JRh(t.player2Name),e.R7$(2),e.Lme(" ",t.score1," - ",t.score2," "),e.R7$(2),e.Y8G("disabled",t.isCompleted)("ngClass",e.eq3(15,b,t.isCompleted)),e.R7$(1),e.SpI(" ",n.loadingMatches[t.matchId]?"Load..":"Win P1"," "),e.R7$(1),e.Y8G("disabled",t.isCompleted)("ngClass",e.eq3(17,b,t.isCompleted)),e.R7$(1),e.SpI(" ",n.loadingMatches[t.matchId]?"Load..":"Win P2"," "),e.R7$(1),e.Y8G("disabled",t.isCompleted)("ngClass",e.eq3(19,b,t.isCompleted)),e.R7$(1),e.SpI(" ",n.loadingMatches[t.matchId]?"Load..":"Draw"," "),e.R7$(2),e.SpI(" ",n.loadingMatches[t.matchId]?"Load..":"Undo"," ")}}function N(r,i){if(1&r&&(e.j41(0,"div",27)(1,"h2",28),e.EFF(2),e.k0s(),e.j41(3,"table",29)(4,"thead")(5,"tr",30)(6,"th",31),e.EFF(7,"Player 1"),e.k0s(),e.j41(8,"th",31),e.EFF(9,"Player 2"),e.k0s(),e.j41(10,"th",31),e.EFF(11,"Result"),e.k0s(),e.j41(12,"th",31),e.EFF(13,"Actions"),e.k0s()()(),e.j41(14,"tbody"),e.DNE(15,$,16,21,"tr",32),e.k0s()()()),2&r){const t=e.XpG();e.R7$(2),e.SpI(" Matches for ",t.selectedPlayer.fullName," "),e.R7$(13),e.Y8G("ngForOf",t.displayMatches)}}function L(r,i){if(1&r){const t=e.RV6();e.j41(0,"div",40)(1,"div",41)(2,"h2",42),e.EFF(3,"Confirm Delete"),e.k0s(),e.j41(4,"p"),e.EFF(5," Are you sure you want to delete "),e.j41(6,"strong"),e.EFF(7),e.k0s(),e.EFF(8,"? "),e.k0s(),e.j41(9,"div",43)(10,"button",44),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.showDeleteModal=!1)}),e.EFF(11," Cancel "),e.k0s(),e.j41(12,"button",45),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.deleteConfirmedPlayer())}),e.EFF(13," Delete "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(7),e.JRh(null==t.selectedPlayerToDelete?null:t.selectedPlayerToDelete.fullName)}}function S(r,i){if(1&r){const t=e.RV6();e.j41(0,"div",40)(1,"div",41)(2,"h2",42),e.EFF(3,"Add New Player"),e.k0s(),e.j41(4,"input",46),e.bIt("ngModelChange",function(n){e.eBV(t);const a=e.XpG();return e.Njj(a.newPlayerName=n)}),e.k0s(),e.j41(5,"div",43)(6,"button",47),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.closeModal())}),e.EFF(7," Cancel "),e.k0s(),e.j41(8,"button",48),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.addPlayer())}),e.EFF(9," Add "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(4),e.Y8G("ngModel",t.newPlayerName)}}function A(r,i){if(1&r){const t=e.RV6();e.j41(0,"div",40)(1,"div",49)(2,"h2",42),e.EFF(3,"\u0628\u062f\u0623 \u062f\u0648\u0631\u064a \u062c\u062f\u064a\u062f"),e.k0s(),e.j41(4,"div",50)(5,"label",51),e.EFF(6,"\u0627\u0633\u0645 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(7,"input",52),e.bIt("ngModelChange",function(n){e.eBV(t);const a=e.XpG();return e.Njj(a.newLeague.Name=n)}),e.k0s()(),e.j41(8,"div",50)(9,"label",51),e.EFF(10,"\u0648\u0635\u0641 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(11,"textarea",53),e.bIt("ngModelChange",function(n){e.eBV(t);const a=e.XpG();return e.Njj(a.newLeague.Description=n)}),e.k0s()(),e.j41(12,"div",50)(13,"label",51),e.EFF(14,"\u0646\u0648\u0639 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(15,"select",54),e.bIt("ngModelChange",function(n){e.eBV(t);const a=e.XpG();return e.Njj(a.newLeague.TypeOfLeague=n)}),e.j41(16,"option",55),e.EFF(17,"Single"),e.k0s(),e.j41(18,"option",55),e.EFF(19,"Multi"),e.k0s()()(),e.j41(20,"div",43)(21,"button",44),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.closeStartLeagueModal())}),e.EFF(22," \u0627\u0644\u0641\u0627\u0621 "),e.k0s(),e.j41(23,"button",48),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.startLeague())}),e.EFF(24," \u0628\u062f\u0623 \u0627\u0644\u062f\u0648\u0631\u064a "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(7),e.Y8G("ngModel",t.newLeague.Name),e.R7$(4),e.Y8G("ngModel",t.newLeague.Description),e.R7$(4),e.Y8G("ngModel",t.newLeague.TypeOfLeague),e.R7$(1),e.Y8G("ngValue",0),e.R7$(2),e.Y8G("ngValue",1)}}function X(r,i){if(1&r){const t=e.RV6();e.j41(0,"div",40)(1,"div",41)(2,"h2",42),e.EFF(3,"\u062a\u0623\u0643\u064a\u062f \u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u062f\u0648\u0631\u064a"),e.k0s(),e.j41(4,"p"),e.EFF(5," \u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f \u0623\u0646\u0643 \u062a\u0631\u064a\u062f \u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0628\u0637\u0648\u0644\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629\u061f \u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062c\u0631\u0627\u0621. "),e.k0s(),e.j41(6,"div",43)(7,"button",44),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.showEndLeagueModal=!1)}),e.EFF(8," \u0625\u0644\u063a\u0627\u0621 "),e.k0s(),e.j41(9,"button",45),e.bIt("click",function(){e.eBV(t);const n=e.XpG();return e.Njj(n.resetTournament(n.leagueData.id))}),e.EFF(10," \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0625\u0646\u0647\u0627\u0621 "),e.k0s()()()()}}const V=function(r,i){return{"w-64 p-4 min-h-screen":r,"w-0 p-0":i}};let Y=(()=>{class r{constructor(t,s,n,a){this.playerService=t,this.matchService=s,this.toastr=n,this.leagueService=a,this.players=[],this.selectedPlayer=null,this.playerMatches=[],this.displayMatches=[],this.showModal=!1,this.newPlayerName="",this.isSidebarOpen=!1,this.showDeleteModal=!1,this.showEndLeagueModal=!1,this.loadingMatches={},this.requestQueue=[],this.isProcessingQueue=!1,this.showResetModal=!1,this.showStartLeagueModal=!1,this.newLeague={Name:"",Description:"",TypeOfLeague:0},this.selectedPlayerToDelete=null}ngOnInit(){this.getPlayers(),this.getCurrentLeague()}toggleSidebar(){this.isSidebarOpen=!this.isSidebarOpen}selectPlayer(t){this.selectedPlayer=t,this.loadMatches()}loadMatches(){this.selectedPlayer&&this.matchService.getMatches().subscribe(t=>{this.playerMatches=t.filter(s=>s.player1Id===this.selectedPlayer.playerId||s.player2Id===this.selectedPlayer.playerId),this.displayMatches=this.playerMatches.map(s=>s.player2Id===this.selectedPlayer.playerId?{...s,player1Name:s.player2Name,player2Name:s.player1Name,score1:s.score2,score2:s.score1,player1Id:s.player2Id,player2Id:s.player1Id}:{...s}),this.playerMatches.forEach(s=>{this.loadingMatches[s.matchId]=!1})})}addToQueue(t){this.requestQueue.push(t),this.processQueue()}processQueue(){var t=this;return function M(r){return function(){var i=this,t=arguments;return new Promise(function(s,n){var a=r.apply(i,t);function u(g){F(a,s,n,u,d,"next",g)}function d(g){F(a,s,n,u,d,"throw",g)}u(void 0)})}}(function*(){if(t.isProcessingQueue||0===t.requestQueue.length)return;t.isProcessingQueue=!0;const s=t.requestQueue.shift();if(s)try{yield s()}catch(n){console.error("Error processing request:",n)}t.isProcessingQueue=!1,t.processQueue()})()}updateMatch(t,s){this.loadingMatches[t]=!0,this.addToQueue(()=>new Promise((n,a)=>{this.matchService.updateMatch(t,s).subscribe({next:u=>{u.success?(this.toastr.success(u.message),this.loadMatches()):this.toastr.error(u.message),this.loadingMatches[t]=!1,n()},error:u=>{this.toastr.error("Error updating match","Error"),this.loadingMatches[t]=!1,a(u)}})}))}resetMatch(t){this.loadingMatches[t]=!0,this.addToQueue(()=>new Promise((s,n)=>{this.matchService.resetMatch(t).subscribe({next:a=>{a.success?(this.toastr.success(a.message),this.loadMatches()):this.toastr.error(a.message,"Error"),this.loadingMatches[t]=!1,s()},error:a=>{this.toastr.error("Error resetting match","Error"),this.loadingMatches[t]=!1,n(a)}})}))}deletePlayer(t,s){s.stopPropagation(),this.playerService.deletePlayer(t).subscribe(()=>{this.toastr.warning("Player deleted!","Deleted"),this.getPlayers(),this.selectedPlayer?.playerId===t&&(this.selectedPlayer=null,this.playerMatches=[],this.displayMatches=[])})}openModal(){this.showModal=!0}closeModal(){this.showModal=!1,this.newPlayerName=""}addPlayer(){this.newPlayerName.trim()&&this.playerService.addPlayer(this.newPlayerName).subscribe(t=>{t.success?(this.toastr.success(t.message),this.getPlayers(),this.loadMatches(),this.closeModal()):this.toastr.warning(t.message)})}confirmDelete(t,s){s.stopPropagation(),this.selectedPlayerToDelete=t,this.showDeleteModal=!0}deleteConfirmedPlayer(){this.selectedPlayerToDelete&&(this.playerService.deletePlayer(this.selectedPlayerToDelete.playerId).subscribe(t=>{t.success?(this.players=this.players.filter(s=>s.playerId!==this.selectedPlayerToDelete?.playerId),this.toastr.success(t.message),this.getPlayers()):this.toastr.error(t.message,"Error")}),this.showDeleteModal=!1,this.selectedPlayerToDelete=null)}getPlayers(){this.playerService.getPlayers().subscribe({next:t=>{this.players=t},error:t=>{this.toastr.error(t.message)}})}resetTournament(t){this.leagueService.resetLeague(t).subscribe({next:s=>{s.success?(this.toastr.success(s.message),this.showResetModal=!1,this.getCurrentLeague(),this.loadMatches(),this.getPlayers(),this.showEndLeagueModal=!1):this.toastr.error(s.message)},error:s=>{this.toastr.error("\u0641\u0634\u0644 \u0641\u064a \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u062f\u0648\u0631\u064a"),console.error(s)}})}openStartLeagueModal(){this.showStartLeagueModal=!0,this.newLeague={Name:"",Description:"",TypeOfLeague:0}}closeStartLeagueModal(){this.showStartLeagueModal=!1}startLeague(){this.newLeague.Name.trim()?this.leagueService.startLeague(this.newLeague).subscribe({next:t=>{t.success?(this.toastr.success(t.message),this.closeStartLeagueModal(),this.getCurrentLeague()):this.toastr.error(t.message,"Error")},error:t=>{this.toastr.error("Failed to start league"),console.error(t)}}):this.toastr.error("League name is required","Error")}getCurrentLeague(){this.leagueService.GetCurrentLeague().subscribe({next:t=>{this.leagueData=t.league,console.log(t)},error:t=>{this.toastr.error(t.message)}})}static{this.\u0275fac=function(s){return new(s||r)(e.rXU(f.x),e.rXU(_.T),e.rXU(p.tw),e.rXU(j))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-players"]],decls:21,vars:14,consts:[[1,"flex","transition-all","duration-300"],[1,"bg-gray-800","text-white","overflow-hidden","transition-all","duration-300",3,"ngClass"],[1,"text-lg","font-bold","mb-4","flex","justify-between","overflow-hidden"],[1,"text-gray-200","text-3xl",3,"click"],[4,"ngIf"],["class","mt-4 w-full bg-green-500 p-2 rounded",3,"click",4,"ngIf"],[1,"flex-1","p-2","transition-all","duration-300"],[1,"flex","justify-evenly","pt-5"],[1,"bg-blue-500","text-white","px-3","py-2","rounded","mb-4",3,"click"],["class","bg-green-500 text-white px-3 py-2 rounded mb-4",3,"click",4,"ngIf"],["class","bg-red-500 text-white px-3 py-2 rounded mb-4",3,"click",4,"ngIf"],["class","grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 container mx-auto",4,"ngIf"],["class","w-5/6 mx-auto",4,"ngIf"],["class","fixed inset-0 flex items-center justify-center bg-black bg-opacity-50",4,"ngIf"],["class","flex items-center justify-between p-2 cursor-pointer rounded-md hover:bg-gray-700",3,"bg-blue-600","click",4,"ngFor","ngForOf"],[1,"flex","items-center","justify-between","p-2","cursor-pointer","rounded-md","hover:bg-gray-700",3,"click"],[1,"bg-red-500","px-2","py-1","text-sm","rounded",3,"click"],[1,"mt-4","w-full","bg-green-500","p-2","rounded",3,"click"],[1,"bg-green-500","text-white","px-3","py-2","rounded","mb-4",3,"click"],[1,"bg-red-500","text-white","px-3","py-2","rounded","mb-4",3,"click"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4","mb-8","container","mx-auto"],[1,"bg-white","shadow-md","rounded","p-6","text-center"],[1,"text-lg","font-semibold","mb-2"],[1,"font-bold","text-gray-800"],["class","font-bold text-gray-800",4,"ngIf"],["lass","font-bold text-gray-800",4,"ngIf"],["lass","font-bold text-gray-800"],[1,"w-5/6","mx-auto"],[1,"text-2xl","font-bold","mb-4","text-center"],[1,"w-full","border-collapse","border","border-gray-300","text-center"],[1,"bg-gray-200"],[1,"border","p-2"],["class","border",3,"ngClass",4,"ngFor","ngForOf"],[1,"border",3,"ngClass"],[1,"p-2","font-bold"],[1,"p-2"],[1,"bg-blue-500","px-2","py-1","rounded","text-white","hover:bg-blue-400","transition-all",3,"disabled","ngClass","click"],[1,"bg-blue-500","px-2","py-1","rounded","text-white","mx-1","hover:bg-blue-400","transition-all",3,"disabled","ngClass","click"],[1,"bg-yellow-500","px-2","py-1","rounded","text-white","hover:bg-yellow-400","transition-all",3,"disabled","ngClass","click"],[1,"bg-gray-500","px-2","py-1","rounded","text-white","ml-2","hover:bg-gray-400","transition-all",3,"click"],[1,"fixed","inset-0","flex","items-center","justify-center","bg-black","bg-opacity-50"],[1,"bg-white","p-6","rounded-lg"],[1,"text-lg","font-bold","mb-4"],[1,"mt-4","flex","justify-end"],[1,"bg-gray-500","px-4","py-2","text-white","rounded","mr-2",3,"click"],[1,"bg-red-500","px-4","py-2","text-white","rounded",3,"click"],["type","text","placeholder","Enter player name",1,"border","p-2","w-full",3,"ngModel","ngModelChange"],[1,"bg-red-500","px-4","py-2","text-white","rounded","mr-2",3,"click"],[1,"bg-green-500","px-4","py-2","text-white","rounded",3,"click"],[1,"bg-white","p-6","rounded-lg","w-96"],[1,"mb-4"],[1,"block","text-sm","font-medium","mb-1"],["type","text","placeholder","Enter league name",1,"border","p-2","w-full","rounded",3,"ngModel","ngModelChange"],["placeholder","Enter league description","rows","3",1,"border","p-2","w-full","rounded",3,"ngModel","ngModelChange"],[1,"border","p-2","w-full","rounded",3,"ngModel","ngModelChange"],[3,"ngValue"]],template:function(s,n){1&s&&(e.j41(0,"div",0)(1,"div",1)(2,"h2",2),e.EFF(3," Players "),e.j41(4,"button",3),e.bIt("click",function(){return n.isSidebarOpen=!1}),e.EFF(5," \xd7 "),e.k0s()(),e.DNE(6,P,2,1,"ul",4),e.DNE(7,w,2,0,"button",5),e.k0s(),e.j41(8,"div",6)(9,"div")(10,"div",7)(11,"button",8),e.bIt("click",function(){return n.isSidebarOpen=!n.isSidebarOpen}),e.EFF(12," \u2630 Players "),e.k0s(),e.DNE(13,I,2,0,"button",9),e.DNE(14,T,2,0,"button",10),e.k0s(),e.DNE(15,G,22,8,"div",11),e.k0s(),e.DNE(16,N,16,2,"div",12),e.k0s(),e.DNE(17,L,14,1,"div",13),e.DNE(18,S,10,1,"div",13),e.DNE(19,A,25,5,"div",13),e.DNE(20,X,11,0,"div",13),e.k0s()),2&s&&(e.R7$(1),e.Y8G("ngClass",e.l_i(11,V,n.isSidebarOpen,!n.isSidebarOpen)),e.R7$(5),e.Y8G("ngIf",n.isSidebarOpen),e.R7$(1),e.Y8G("ngIf",n.isSidebarOpen),e.R7$(6),e.Y8G("ngIf",null==n.leagueData),e.R7$(1),e.Y8G("ngIf",null!=n.leagueData),e.R7$(1),e.Y8G("ngIf",n.leagueData),e.R7$(1),e.Y8G("ngIf",n.selectedPlayer),e.R7$(1),e.Y8G("ngIf",n.showDeleteModal),e.R7$(1),e.Y8G("ngIf",n.showModal),e.R7$(1),e.Y8G("ngIf",n.showStartLeagueModal),e.R7$(1),e.Y8G("ngIf",n.showEndLeagueModal))},dependencies:[l.YU,l.Sq,l.bT,c.xH,c.y7,c.me,c.wz,c.BC,c.vS,l.vh],styles:["table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse}th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]{border:1px solid #d1d5db;padding:8px;text-align:center}th[_ngcontent-%COMP%]{background-color:#ef4444;color:#fff}td.bg-gray-200[_ngcontent-%COMP%]{background-color:#e5e7eb}"]})}}return r})(),O=(()=>{class r{transform(t,s=2){if(!t)return"";let n=new Date(t);return n.setHours(n.getHours()+s),n.toLocaleString()}static{this.\u0275fac=function(s){return new(s||r)}}static{this.\u0275pipe=e.EJ8({name:"utcToLocal",type:r,pure:!0})}}return r})();function B(r,i){1&r&&(e.j41(0,"div",6),e.EFF(1," \u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644 \u0647\u0646\u0627 \u{1f4ed} "),e.k0s())}const U=function(r,i){return{"border-green-500":r,"border-red-500":i}},Q=function(r,i){return{"bg-red-500":r,"bg-green-500":i}};function J(r,i){if(1&r){const t=e.RV6();e.j41(0,"div",9)(1,"button",10),e.bIt("click",function(){const a=e.eBV(t).$implicit,u=e.XpG(2);return e.Njj(u.toggleMarkMessage(a))}),e.EFF(2),e.k0s(),e.j41(3,"button",11),e.bIt("click",function(){const a=e.eBV(t).$implicit,u=e.XpG(2);return e.Njj(u.toggleDeleteMessage(a))}),e.EFF(4," Delete "),e.k0s(),e.j41(5,"p",12),e.EFF(6),e.k0s(),e.j41(7,"p",13),e.EFF(8),e.k0s(),e.j41(9,"p",14),e.EFF(10),e.nI1(11,"utcToLocal"),e.k0s()()}if(2&r){const t=i.$implicit;e.Y8G("ngClass",e.l_i(9,U,t.isRead,!t.isRead)),e.R7$(1),e.Y8G("ngClass",e.l_i(12,Q,!t.isRead,t.isRead)),e.R7$(1),e.SpI(" ",t.isRead?"Mark Unread ":"Mark as Read "," "),e.R7$(4),e.JRh(t.content),e.R7$(2),e.Lme(" \u0645\u0646: ",t.senderFullName," (",t.senderPhoneNumber,") "),e.R7$(2),e.SpI(" ",e.bMT(11,7,t.sentAt)," : \u0628\u062a\u0627\u0631\u064a\u062e ")}}function H(r,i){if(1&r&&(e.j41(0,"div",7),e.DNE(1,J,12,15,"div",8),e.k0s()),2&r){const t=e.XpG();e.R7$(1),e.Y8G("ngForOf",t.filteredMessages)}}const W=function(r,i){return{"bg-green-500 text-white":r,"bg-gray-200":i}},q=function(r,i){return{"bg-red-500 text-white":r,"bg-gray-200":i}},z=function(r,i){return{"bg-blue-500 text-white":r,"bg-gray-200":i}},K=[{path:"",component:v},{path:"players",component:Y},{path:"inbox",component:(()=>{class r{constructor(t,s){this.messageService=t,this.toastr=s,this.messages=[],this.filteredMessages=[],this.activeTab="all"}ngOnInit(){this.loadMessages()}loadMessages(){this.messageService.getMessages().subscribe({next:t=>{t?(this.messages=t.messages.filter(s=>0==s.isDeleted).sort((s,n)=>new Date(n.sentAt).getTime()-new Date(s.sentAt).getTime()),console.log(t),this.filterMessages()):this.toastr.error("\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0622\u0646")},error:t=>{this.toastr.error("\u062d\u0635\u0644 \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062c\u0644\u0628 \u0627\u0644\u0631\u0633\u0627\u0626\u0644"),console.error(t)}})}filterMessages(){this.filteredMessages="all"===this.activeTab?this.messages:this.messages.filter("read"===this.activeTab?t=>t.isRead:t=>!t.isRead)}changeTab(t){this.activeTab=t,this.filterMessages()}toggleMarkMessage(t){this.messageService.toggleMarkMessage(t.id,!t.isRead).subscribe({next:s=>{s.success&&(this.toastr.success("\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u062d\u0627\u0644\u0629 \u0627\u0644\u0631\u0633\u0627\u0644\u0629"),t.isRead=!t.isRead,this.filterMessages(),this.loadMessages())},error:s=>{this.toastr.error("\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u062d\u0627\u0644\u0629"),console.error(s)}})}toggleDeleteMessage(t){this.messageService.toggleDeleteMessage(t.id,!t.isDeleted).subscribe({next:s=>{s.success&&(this.toastr.success(s.message),t.isDeleted=!t.isDeleted,this.filterMessages(),this.loadMessages())},error:s=>{this.toastr.error("\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062d\u0630\u0641 "),console.error(s)}})}static{this.\u0275fac=function(s){return new(s||r)(e.rXU(y.b),e.rXU(p.tw))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-inbox"]],decls:12,vars:14,consts:[[1,"container","mx-auto","p-4"],[1,"text-2xl","font-bold","text-center","mb-6"],[1,"flex","justify-center","mb-6"],[1,"px-4","py-2","mx-2","rounded-md","border","border-gray-300",3,"ngClass","click"],["class","text-center text-gray-500",4,"ngIf"],["class","space-y-4",4,"ngIf"],[1,"text-center","text-gray-500"],[1,"space-y-4"],["class","bg-white shadow-md rounded p-4 border-l-4 w-4/5 mx-auto relative",3,"ngClass",4,"ngFor","ngForOf"],[1,"bg-white","shadow-md","rounded","p-4","border-l-4","w-4/5","mx-auto","relative",3,"ngClass"],[1,"absolute","top-3","right-3","px-3","py-1","rounded-md","text-white","text-sm",3,"ngClass","click"],[1,"absolute","top-3","ledt-3","px-3","py-1","rounded-md","text-white","text-sm","bg-red-700",3,"click"],[1,"text-gray-700","mt-6"],[1,"text-sm","text-gray-500","mt-2"],[1,"text-sm","text-gray-500"]],template:function(s,n){1&s&&(e.j41(0,"div",0)(1,"h2",1),e.EFF(2,"\u{1f4e5} \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0648\u0627\u0631\u062f"),e.k0s(),e.j41(3,"div",2)(4,"button",3),e.bIt("click",function(){return n.changeTab("read")}),e.EFF(5," \u0627\u0644\u0645\u0642\u0631\u0648\u0621\u0629 \u2705 "),e.k0s(),e.j41(6,"button",3),e.bIt("click",function(){return n.changeTab("unread")}),e.EFF(7," \u063a\u064a\u0631 \u0627\u0644\u0645\u0642\u0631\u0648\u0621\u0629 \u274c "),e.k0s(),e.j41(8,"button",3),e.bIt("click",function(){return n.changeTab("all")}),e.EFF(9," \u0643\u0644 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 "),e.k0s()(),e.DNE(10,B,2,0,"div",4),e.DNE(11,H,2,1,"div",5),e.k0s()),2&s&&(e.R7$(4),e.Y8G("ngClass",e.l_i(5,W,"read"===n.activeTab,"read"!==n.activeTab)),e.R7$(2),e.Y8G("ngClass",e.l_i(8,q,"unread"===n.activeTab,"unread"!==n.activeTab)),e.R7$(2),e.Y8G("ngClass",e.l_i(11,z,"all"===n.activeTab,"all"!==n.activeTab)),e.R7$(2),e.Y8G("ngIf",0===n.filteredMessages.length),e.R7$(1),e.Y8G("ngIf",n.filteredMessages.length>0))},dependencies:[l.YU,l.Sq,l.bT,O]})}}return r})()}];let Z=(()=>{class r{static{this.\u0275fac=function(s){return new(s||r)}}static{this.\u0275mod=e.$C({type:r})}static{this.\u0275inj=e.G2t({imports:[h.iI.forChild(K),h.iI]})}}return r})();var ee=o(4665);let te=(()=>{class r{static{this.\u0275fac=function(s){return new(s||r)}}static{this.\u0275mod=e.$C({type:r})}static{this.\u0275inj=e.G2t({imports:[l.MD,Z,c.YN,x.q1,ee.PlayerModule]})}}return r})()}}]);