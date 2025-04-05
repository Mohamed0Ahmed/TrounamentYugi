"use strict";(self.webpackChunkYugiTournamnet=self.webpackChunkYugiTournamnet||[]).push([[858],{8858:(re,m,l)=>{l.r(m),l.d(m,{AdminModule:()=>te});var o=l(177),h=l(6878);function b(r,a,t,s,u,n,i){try{var d=r[n](i),g=d.value}catch(se){return void t(se)}d.done?a(g):Promise.resolve(g).then(s,u)}var e=l(540),k=l(3665),v=l(9101),f=l(5794),j=l(5312),_=l(1626);let M=(()=>{class r{constructor(t){this.http=t,this.baseUrl=j.c.apiUrl}resetLeague(t){return this.http.post(`${this.baseUrl}/league/reset/${t}`,{})}startLeague(t){return this.http.post(`${this.baseUrl}/league/start`,t)}GetCurrentLeague(){return this.http.get(`${this.baseUrl}/league/getCurrentLeague`)}GetAllLeaguesMatches(){return this.http.get(`${this.baseUrl}/match/matches/all`)}GetAllLeaguesRank(){return this.http.get(`${this.baseUrl}/player/players/all`)}static{this.\u0275fac=function(s){return new(s||r)(e.KVO(_.Qq))}}static{this.\u0275prov=e.jDH({token:r,factory:r.\u0275fac,providedIn:"root"})}}return r})();var y=l(6375),c=l(4341);function C(r,a){if(1&r){const t=e.RV6();e.j41(0,"li",33),e.bIt("click",function(){const n=e.eBV(t).$implicit,i=e.XpG(2);return e.Njj(i.selectPlayer(n))}),e.EFF(1),e.j41(2,"button",34),e.bIt("click",function(u){const i=e.eBV(t).$implicit,d=e.XpG(2);return e.Njj(d.confirmDelete(i,u))}),e.EFF(3," X "),e.k0s()()}if(2&r){const t=a.$implicit,s=e.XpG(2);e.AVh("bg-blue-600",(null==s.selectedPlayer?null:s.selectedPlayer.playerId)===t.playerId),e.R7$(1),e.SpI(" ",t.fullName," ")}}function E(r,a){if(1&r&&(e.j41(0,"ul"),e.DNE(1,C,4,3,"li",32),e.k0s()),2&r){const t=e.XpG();e.R7$(1),e.Y8G("ngForOf",t.players)}}function w(r,a){if(1&r){const t=e.RV6();e.j41(0,"button",35),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.openModal())}),e.EFF(1," Add Player "),e.k0s()}}const p=function(r){return{"opacity-50 cursor-not-allowed":r}};function P(r,a){if(1&r){const t=e.RV6();e.j41(0,"tr",42)(1,"td",43),e.EFF(2),e.k0s(),e.j41(3,"td",43),e.EFF(4),e.k0s(),e.j41(5,"td",43),e.EFF(6),e.k0s(),e.j41(7,"td",44)(8,"button",45),e.bIt("click",function(){const n=e.eBV(t).$implicit,i=e.XpG(2);return e.Njj(i.updateMatch(n.matchId,n.player1Id))}),e.EFF(9),e.k0s(),e.j41(10,"button",46),e.bIt("click",function(){const n=e.eBV(t).$implicit,i=e.XpG(2);return e.Njj(i.updateMatch(n.matchId,n.player2Id))}),e.EFF(11),e.k0s(),e.j41(12,"button",47),e.bIt("click",function(){const n=e.eBV(t).$implicit,i=e.XpG(2);return e.Njj(i.updateMatch(n.matchId,null))}),e.EFF(13),e.k0s(),e.j41(14,"button",48),e.bIt("click",function(){const n=e.eBV(t).$implicit,i=e.XpG(2);return e.Njj(i.resetMatch(n.matchId))}),e.EFF(15),e.k0s()()()}if(2&r){const t=a.$implicit,s=a.index,u=e.XpG(2);e.Y8G("ngClass",s%2==0?"bg-white":"bg-gray-100"),e.R7$(2),e.JRh(t.player1Name),e.R7$(2),e.JRh(t.player2Name),e.R7$(2),e.Lme(" ",t.score1," - ",t.score2," "),e.R7$(2),e.Y8G("disabled",t.isCompleted)("ngClass",e.eq3(15,p,t.isCompleted)),e.R7$(1),e.SpI(" ",u.loadingMatches[t.matchId]?"Load..":"Win P1"," "),e.R7$(1),e.Y8G("disabled",t.isCompleted)("ngClass",e.eq3(17,p,t.isCompleted)),e.R7$(1),e.SpI(" ",u.loadingMatches[t.matchId]?"Load..":"Win P2"," "),e.R7$(1),e.Y8G("disabled",t.isCompleted)("ngClass",e.eq3(19,p,t.isCompleted)),e.R7$(1),e.SpI(" ",u.loadingMatches[t.matchId]?"Load..":"Draw"," "),e.R7$(2),e.SpI(" ",u.loadingMatches[t.matchId]?"Load..":"Undo"," ")}}function I(r,a){if(1&r&&(e.j41(0,"div",36)(1,"h2",37),e.EFF(2),e.k0s(),e.j41(3,"table",38)(4,"thead")(5,"tr",39)(6,"th",40),e.EFF(7,"Player 1"),e.k0s(),e.j41(8,"th",40),e.EFF(9,"Player 2"),e.k0s(),e.j41(10,"th",40),e.EFF(11,"Result"),e.k0s(),e.j41(12,"th",40),e.EFF(13,"Actions"),e.k0s()()(),e.j41(14,"tbody"),e.DNE(15,P,16,21,"tr",41),e.k0s()()()),2&r){const t=e.XpG();e.R7$(2),e.SpI(" Matches for ",t.selectedPlayer.fullName," "),e.R7$(13),e.Y8G("ngForOf",t.displayMatches)}}function R(r,a){if(1&r&&(e.j41(0,"div",49)(1,"h2",50),e.EFF(2),e.k0s()()),2&r){const t=e.XpG();e.R7$(2),e.JRh(t.totalMessagesLeft)}}function T(r,a){if(1&r){const t=e.RV6();e.j41(0,"button",51),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.openStartLeagueModal())}),e.EFF(1," \u0628\u062f\u0623 \u062f\u0648\u0631\u064a \u062c\u062f\u064a\u062f "),e.k0s()}}function $(r,a){if(1&r){const t=e.RV6();e.j41(0,"button",52),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.showEndLeagueModal=!0)}),e.EFF(1," \u0627\u0646\u0647\u0627\u0621 \u0627\u0644\u062f\u0648\u0631\u064a "),e.k0s()}}function G(r,a){1&r&&(e.j41(0,"p",57),e.EFF(1," \u0641\u0631\u062f\u064a\u0629 "),e.k0s())}function D(r,a){1&r&&(e.j41(0,"p",58),e.EFF(1," \u0628\u0637\u0648\u0644\u0629 \u0641\u0631\u0642 "),e.k0s())}function N(r,a){if(1&r&&(e.j41(0,"div",53)(1,"div",17)(2,"h3",18),e.EFF(3,"\u0648\u0635\u0641 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(4,"pre",54),e.EFF(5),e.k0s()(),e.j41(6,"div",17)(7,"h3",18),e.EFF(8,"\u0646\u0638\u0627\u0645 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.DNE(9,G,2,0,"p",55),e.DNE(10,D,2,0,"p",56),e.k0s(),e.j41(11,"div",17)(12,"h3",18),e.EFF(13,"\u062a\u0627\u0631\u064a\u062e \u0628\u062f\u0623 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(14,"p",57),e.EFF(15),e.nI1(16,"date"),e.k0s()(),e.j41(17,"div",17)(18,"h3",18),e.EFF(19,"\u0627\u0633\u0645 \u0627\u0644\u0628\u0637\u0648\u0644\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629"),e.k0s(),e.j41(20,"p",57),e.EFF(21),e.k0s()()()),2&r){const t=e.XpG();e.R7$(5),e.JRh(t.leagueData.description),e.R7$(4),e.Y8G("ngIf",0===t.leagueData.typeOfLeague),e.R7$(1),e.Y8G("ngIf",1===t.leagueData.typeOfLeague),e.R7$(5),e.SpI(" ",e.i5U(16,5,t.leagueData.createdOn,"fullDate")," "),e.R7$(6),e.JRh(t.leagueData.name)}}function L(r,a){if(1&r&&(e.j41(0,"tr",59)(1,"td",28),e.EFF(2),e.k0s(),e.j41(3,"td",28),e.EFF(4),e.k0s(),e.j41(5,"td",28),e.EFF(6),e.k0s(),e.j41(7,"td",28),e.EFF(8),e.nI1(9,"date"),e.k0s(),e.j41(10,"td",28),e.EFF(11),e.k0s(),e.j41(12,"td",28)(13,"button",60),e.EFF(14," \u062d\u0630\u0641 \u0627\u0644\u0628\u0637\u0648\u0644\u0629 "),e.k0s()()()),2&r){const t=a.$implicit;e.R7$(2),e.SpI(" ",t.leagueName," "),e.R7$(1),e.AVh("text-green-500",!t.isFinished)("text-red-500",t.isFinished),e.R7$(1),e.SpI(" ",t.isFinished?"\u0627\u0646\u062a\u0647\u062a":"\u0645\u0633\u062a\u0645\u0631\u0629"," "),e.R7$(2),e.SpI(" ",0===t.leagueType?"\u0641\u0631\u062f\u064a\u0629":"\u062c\u0645\u0627\u0639\u064a\u0629"," "),e.R7$(2),e.SpI(" ",e.i5U(9,9,t.createdOn,"yyyy/MM/dd - HH:mm")," "),e.R7$(3),e.SpI(" ",t.players[0].fullName," ")}}function A(r,a){if(1&r){const t=e.RV6();e.j41(0,"div",61)(1,"div",62)(2,"h2",63),e.EFF(3,"Confirm Delete"),e.k0s(),e.j41(4,"p"),e.EFF(5," Are you sure you want to delete "),e.j41(6,"strong"),e.EFF(7),e.k0s(),e.EFF(8,"? "),e.k0s(),e.j41(9,"div",64)(10,"button",65),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.showDeleteModal=!1)}),e.EFF(11," Cancel "),e.k0s(),e.j41(12,"button",66),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.deleteConfirmedPlayer())}),e.EFF(13," Delete "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(7),e.JRh(null==t.selectedPlayerToDelete?null:t.selectedPlayerToDelete.fullName)}}function S(r,a){if(1&r){const t=e.RV6();e.j41(0,"div",61)(1,"div",62)(2,"h2",63),e.EFF(3,"Add New Player"),e.k0s(),e.j41(4,"input",67),e.bIt("ngModelChange",function(u){e.eBV(t);const n=e.XpG();return e.Njj(n.newPlayerName=u)}),e.k0s(),e.j41(5,"div",64)(6,"button",68),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.closeModal())}),e.EFF(7," Cancel "),e.k0s(),e.j41(8,"button",69),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.addPlayer())}),e.EFF(9," Add "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(4),e.Y8G("ngModel",t.newPlayerName)}}function V(r,a){if(1&r){const t=e.RV6();e.j41(0,"div",61)(1,"div",70)(2,"h2",63),e.EFF(3,"\u0628\u062f\u0623 \u062f\u0648\u0631\u064a \u062c\u062f\u064a\u062f"),e.k0s(),e.j41(4,"div",71)(5,"label",72),e.EFF(6,"\u0627\u0633\u0645 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(7,"input",73),e.bIt("ngModelChange",function(u){e.eBV(t);const n=e.XpG();return e.Njj(n.newLeague.Name=u)}),e.k0s()(),e.j41(8,"div",71)(9,"label",72),e.EFF(10,"\u0648\u0635\u0641 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(11,"textarea",74),e.bIt("ngModelChange",function(u){e.eBV(t);const n=e.XpG();return e.Njj(n.newLeague.Description=u)}),e.k0s()(),e.j41(12,"div",71)(13,"label",72),e.EFF(14,"\u0646\u0648\u0639 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(15,"select",75),e.bIt("ngModelChange",function(u){e.eBV(t);const n=e.XpG();return e.Njj(n.newLeague.TypeOfLeague=u)}),e.j41(16,"option",76),e.EFF(17,"Single"),e.k0s(),e.j41(18,"option",76),e.EFF(19,"Multi"),e.k0s()()(),e.j41(20,"div",64)(21,"button",65),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.closeStartLeagueModal())}),e.EFF(22," \u0627\u0644\u0641\u0627\u0621 "),e.k0s(),e.j41(23,"button",69),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.startLeague())}),e.EFF(24," \u0628\u062f\u0623 \u0627\u0644\u062f\u0648\u0631\u064a "),e.k0s()()()()}if(2&r){const t=e.XpG();e.R7$(7),e.Y8G("ngModel",t.newLeague.Name),e.R7$(4),e.Y8G("ngModel",t.newLeague.Description),e.R7$(4),e.Y8G("ngModel",t.newLeague.TypeOfLeague),e.R7$(1),e.Y8G("ngValue",0),e.R7$(2),e.Y8G("ngValue",1)}}function X(r,a){if(1&r){const t=e.RV6();e.j41(0,"div",61)(1,"div",62)(2,"h2",63),e.EFF(3,"\u062a\u0623\u0643\u064a\u062f \u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u062f\u0648\u0631\u064a"),e.k0s(),e.j41(4,"p"),e.EFF(5," \u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f \u0623\u0646\u0643 \u062a\u0631\u064a\u062f \u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0628\u0637\u0648\u0644\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629\u061f \u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u062a\u0631\u0627\u062c\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062c\u0631\u0627\u0621. "),e.k0s(),e.j41(6,"div",64)(7,"button",65),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.showEndLeagueModal=!1)}),e.EFF(8," \u0625\u0644\u063a\u0627\u0621 "),e.k0s(),e.j41(9,"button",66),e.bIt("click",function(){e.eBV(t);const u=e.XpG();return e.Njj(u.resetTournament(u.leagueData.id))}),e.EFF(10," \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0625\u0646\u0647\u0627\u0621 "),e.k0s()()()()}}const Y=function(r,a){return{"w-64 p-4 min-h-screen":r,"w-0 p-0":a}};let F=(()=>{class r{constructor(t,s,u,n,i){this.playerService=t,this.matchService=s,this.toastr=u,this.leagueService=n,this.messageService=i,this.players=[],this.selectedPlayer=null,this.playerMatches=[],this.displayMatches=[],this.showModal=!1,this.newPlayerName="",this.isSidebarOpen=!1,this.showDeleteModal=!1,this.showEndLeagueModal=!1,this.loadingMatches={},this.requestQueue=[],this.isProcessingQueue=!1,this.showResetModal=!1,this.showStartLeagueModal=!1,this.newLeague={Name:"",Description:"",TypeOfLeague:0},this.totalMessagesLeft=0,this.totalPlayers=0,this.totalMatches=0,this.totalMatchesLeft=0,this.totalMessages=0,this.leagues=[],this.selectedPlayerToDelete=null}ngOnInit(){this.getPlayers(),this.getCurrentLeague(),this.getMatches(),this.getMessages(),this.GetAllLeagyes()}toggleSidebar(){this.isSidebarOpen=!this.isSidebarOpen,this.selectedPlayer=null}selectPlayer(t){this.selectedPlayer=t,this.loadMatches()}loadMatches(){this.selectedPlayer&&this.matchService.getMatches().subscribe(t=>{this.playerMatches=t.filter(s=>s.player1Id===this.selectedPlayer.playerId||s.player2Id===this.selectedPlayer.playerId),this.displayMatches=this.playerMatches.map(s=>s.player2Id===this.selectedPlayer.playerId?{...s,player1Name:s.player2Name,player2Name:s.player1Name,score1:s.score2,score2:s.score1,player1Id:s.player2Id,player2Id:s.player1Id}:{...s}),this.playerMatches.forEach(s=>{this.loadingMatches[s.matchId]=!1})})}addToQueue(t){this.requestQueue.push(t),this.processQueue()}processQueue(){var t=this;return function x(r){return function(){var a=this,t=arguments;return new Promise(function(s,u){var n=r.apply(a,t);function i(g){b(n,s,u,i,d,"next",g)}function d(g){b(n,s,u,i,d,"throw",g)}i(void 0)})}}(function*(){if(t.isProcessingQueue||0===t.requestQueue.length)return;t.isProcessingQueue=!0;const s=t.requestQueue.shift();if(s)try{yield s()}catch(u){console.error("Error processing request:",u)}t.isProcessingQueue=!1,t.processQueue()})()}updateMatch(t,s){this.loadingMatches[t]=!0,this.addToQueue(()=>new Promise((u,n)=>{this.matchService.updateMatch(t,s).subscribe({next:i=>{i.success?(this.toastr.success(i.message),this.loadMatches(),this.getMatches()):this.toastr.error(i.message),this.loadingMatches[t]=!1,u()},error:i=>{this.toastr.error("Error updating match","Error"),this.loadingMatches[t]=!1,n(i)}})}))}resetMatch(t){this.loadingMatches[t]=!0,this.addToQueue(()=>new Promise((s,u)=>{this.matchService.resetMatch(t).subscribe({next:n=>{n.success?(this.toastr.success(n.message),this.loadMatches()):this.toastr.error(n.message,"Error"),this.loadingMatches[t]=!1,s()},error:n=>{this.toastr.error("Error resetting match","Error"),this.loadingMatches[t]=!1,u(n)}})}))}deletePlayer(t,s){s.stopPropagation(),this.playerService.deletePlayer(t).subscribe(()=>{this.toastr.warning("Player deleted!","Deleted"),this.getPlayers(),this.selectedPlayer?.playerId===t&&(this.selectedPlayer=null,this.playerMatches=[],this.displayMatches=[])})}openModal(){this.showModal=!0}closeModal(){this.showModal=!1,this.newPlayerName=""}addPlayer(){this.newPlayerName.trim()&&this.playerService.addPlayer(this.newPlayerName).subscribe(t=>{t.success?(this.toastr.success(t.message),this.getPlayers(),this.loadMatches(),this.closeModal()):this.toastr.warning(t.message)})}confirmDelete(t,s){s.stopPropagation(),this.selectedPlayerToDelete=t,this.showDeleteModal=!0}deleteConfirmedPlayer(){this.selectedPlayerToDelete&&(this.playerService.deletePlayer(this.selectedPlayerToDelete.playerId).subscribe(t=>{t.success?(this.players=this.players.filter(s=>s.playerId!==this.selectedPlayerToDelete?.playerId),this.toastr.success(t.message),this.getPlayers()):this.toastr.error(t.message,"Error")}),this.showDeleteModal=!1,this.selectedPlayerToDelete=null)}getPlayers(){this.playerService.getPlayers().subscribe({next:t=>{this.players=t,this.totalPlayers=t.length},error:t=>{this.toastr.error(t.message)}})}getMatches(){this.matchService.getMatches().subscribe({next:t=>{t&&(this.totalMatches=t.length,this.totalMatchesLeft=t.filter(s=>0==s.isCompleted).length)},error:t=>{this.toastr.error(t.message)}})}resetTournament(t){this.leagueService.resetLeague(t).subscribe({next:s=>{s.success?(this.toastr.success(s.message),this.showResetModal=!1,this.getCurrentLeague(),this.loadMatches(),this.getPlayers(),this.showEndLeagueModal=!1):this.toastr.error(s.message)},error:s=>{this.toastr.error("\u0641\u0634\u0644 \u0641\u064a \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u062f\u0648\u0631\u064a"),console.error(s)}})}openStartLeagueModal(){this.showStartLeagueModal=!0,this.newLeague={Name:"",Description:"",TypeOfLeague:0}}closeStartLeagueModal(){this.showStartLeagueModal=!1}startLeague(){this.newLeague.Name.trim()?this.leagueService.startLeague(this.newLeague).subscribe({next:t=>{t.success?(this.toastr.success(t.message),this.closeStartLeagueModal(),this.getCurrentLeague()):this.toastr.error(t.message,"Error")},error:t=>{this.toastr.error("Failed to start league"),console.error(t)}}):this.toastr.error("League name is required","Error")}getCurrentLeague(){this.leagueService.GetCurrentLeague().subscribe({next:t=>{this.leagueData=t.league},error:t=>{this.toastr.error(t.message)}})}getMessages(){this.messageService.getMessages().subscribe({next:t=>{t?this.totalMessagesLeft=t.messages.filter(s=>0==s.isRead).length:this.toastr.error("\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644")},error:t=>{this.toastr.error(t.message)}})}GetAllLeagyes(){this.leagueService.GetAllLeaguesRank().subscribe({next:t=>{t?(console.log(t),this.leagues=t.reverse()):this.toastr.error(t)},error:t=>{this.toastr.error(t.message)}})}static{this.\u0275fac=function(s){return new(s||r)(e.rXU(k.x),e.rXU(v.T),e.rXU(f.tw),e.rXU(M),e.rXU(y.b))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-players"]],decls:62,vars:19,consts:[[1,"flex","transition-all","duration-600"],[1,"bg-gray-800","text-white","overflow-hidden","transition-all","duration-600",3,"ngClass"],[1,"text-lg","font-bold","mb-4","flex","justify-between","overflow-hidden"],[1,"text-gray-200","text-3xl",3,"click"],[4,"ngIf"],["class","mt-4 w-full bg-green-500 p-2 rounded",3,"click",4,"ngIf"],[1,"flex-1","p-2","transition-all","duration-600","container","mx-auto"],["class","w-4/6 mx-auto",4,"ngIf"],[1,"my-3"],[1,"flex","justify-evenly","pt-5"],[1,"bg-blue-500","text-white","px-3","py-2","rounded","mb-4",3,"click"],["routerLink","/admin/inbox",1,"bg-orange-400","hover:bg-orange-500","text-white","mb-4","px-3","py-2","rounded","transition-all","relative"],["class","absolute -top-2 -right-2 w-[30px] h-[30px] rounded-full bg-green-500 flex justify-center items-center",4,"ngIf"],["class","bg-green-500 text-white px-3 py-2 rounded mb-4",3,"click",4,"ngIf"],["class","bg-red-500 text-white px-3 py-2 rounded mb-4",3,"click",4,"ngIf"],["class","grid grid-cols-1 md:grid-cols-4 gap-4 mb-8",4,"ngIf"],[1,"grid","grid-cols-1","md:grid-cols-3","gap-4","mb-8","container","mx-auto"],[1,"bg-white","shadow-md","rounded","p-6","text-center"],[1,"text-lg","font-semibold","mb-2"],[1,"text-3xl","font-bold","text-red-600"],[1,"text-3xl","font-bold","text-green-600"],[1,"text-3xl","font-bold","text-blue-600"],[1,"text-center"],[1,"bg-green-500","text-white","px-3","py-2","rounded","mb-4"],[1,"max-h-[350px]","overflow-x-auto"],[1,"min-w-full","divide-y-2","divide-gray-200"],[1,"sticky","top-0","bg-white","ltr:text-left","rtl:text-right"],[1,"*:font-medium","*:text-gray-900"],[1,"px-3","py-2","whitespace-nowrap"],[1,"divide-y","divide-gray-200"],["class","*:font-bold *:first:font-medium",4,"ngFor","ngForOf"],["class","fixed inset-0 flex items-center justify-center bg-black bg-opacity-50",4,"ngIf"],["class","flex items-center justify-between p-2 cursor-pointer rounded-md hover:bg-gray-700",3,"bg-blue-600","click",4,"ngFor","ngForOf"],[1,"flex","items-center","justify-between","p-2","cursor-pointer","rounded-md","hover:bg-gray-700",3,"click"],[1,"bg-red-500","px-2","py-1","text-sm","rounded",3,"click"],[1,"mt-4","w-full","bg-green-500","p-2","rounded",3,"click"],[1,"w-4/6","mx-auto"],[1,"text-2xl","font-bold","mb-4","text-center"],[1,"w-full","border-collapse","border","border-gray-300","text-center"],[1,"bg-gray-200"],[1,"border","p-2"],["class","border",3,"ngClass",4,"ngFor","ngForOf"],[1,"border",3,"ngClass"],[1,"p-2","font-bold"],[1,"p-2"],[1,"bg-blue-500","px-2","py-1","rounded","text-white","hover:bg-blue-400","transition-all",3,"disabled","ngClass","click"],[1,"bg-blue-500","px-2","py-1","rounded","text-white","mx-1","hover:bg-blue-400","transition-all",3,"disabled","ngClass","click"],[1,"bg-yellow-500","px-2","py-1","rounded","text-white","hover:bg-yellow-400","transition-all",3,"disabled","ngClass","click"],[1,"bg-gray-500","px-2","py-1","rounded","text-white","ml-2","hover:bg-gray-400","transition-all",3,"click"],[1,"absolute","-top-2","-right-2","w-[30px]","h-[30px]","rounded-full","bg-green-500","flex","justify-center","items-center"],[1,"text-white","font-bold"],[1,"bg-green-500","text-white","px-3","py-2","rounded","mb-4",3,"click"],[1,"bg-red-500","text-white","px-3","py-2","rounded","mb-4",3,"click"],[1,"grid","grid-cols-1","md:grid-cols-4","gap-4","mb-8"],[1,"font-bold","text-sm","text-gray-800"],["class","font-bold text-gray-800",4,"ngIf"],["lass","font-bold text-gray-800",4,"ngIf"],[1,"font-bold","text-gray-800"],["lass","font-bold text-gray-800"],[1,"*:font-bold","*:first:font-medium"],[1,"bg-red-500","text-white","px-3","py-2","rounded","hover:bg-red-600","transition"],[1,"fixed","inset-0","flex","items-center","justify-center","bg-black","bg-opacity-50"],[1,"bg-white","p-6","rounded-lg"],[1,"text-lg","font-bold","mb-4"],[1,"mt-4","flex","justify-end"],[1,"bg-gray-500","px-4","py-2","text-white","rounded","mr-2",3,"click"],[1,"bg-red-500","px-4","py-2","text-white","rounded",3,"click"],["type","text","placeholder","Enter player name",1,"border","p-2","w-full",3,"ngModel","ngModelChange"],[1,"bg-red-500","px-4","py-2","text-white","rounded","mr-2",3,"click"],[1,"bg-green-500","px-4","py-2","text-white","rounded",3,"click"],[1,"bg-white","p-6","rounded-lg","w-96"],[1,"mb-4"],[1,"block","text-sm","font-medium","mb-1"],["type","text","placeholder","Enter league name",1,"border","p-2","w-full","rounded",3,"ngModel","ngModelChange"],["placeholder","Enter league description","rows","3",1,"border","p-2","w-full","rounded",3,"ngModel","ngModelChange"],[1,"border","p-2","w-full","rounded",3,"ngModel","ngModelChange"],[3,"ngValue"]],template:function(s,u){1&s&&(e.j41(0,"div",0)(1,"div",1)(2,"h2",2),e.EFF(3," Players "),e.j41(4,"button",3),e.bIt("click",function(){return u.toggleSidebar()}),e.EFF(5," \xd7 "),e.k0s()(),e.DNE(6,E,2,1,"ul",4),e.DNE(7,w,2,0,"button",5),e.k0s(),e.j41(8,"div",6),e.DNE(9,I,16,2,"div",7),e.nrm(10,"hr",8),e.j41(11,"div")(12,"div",9)(13,"button",10),e.bIt("click",function(){return u.toggleSidebar()}),e.EFF(14," \u2630 Players "),e.k0s(),e.j41(15,"button",11),e.EFF(16," \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0648\u0627\u0631\u062f "),e.DNE(17,R,3,1,"div",12),e.k0s(),e.DNE(18,T,2,0,"button",13),e.DNE(19,$,2,0,"button",14),e.k0s(),e.DNE(20,N,22,8,"div",15),e.j41(21,"div",16)(22,"div",17)(23,"h3",18),e.EFF(24,"\u0639\u062f\u062f \u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a \u0627\u0644\u0645\u062a\u0628\u0642\u064a\u0629"),e.k0s(),e.j41(25,"p",19),e.EFF(26),e.k0s()(),e.j41(27,"div",17)(28,"h3",18),e.EFF(29,"\u0639\u062f\u062f \u0627\u0644\u0645\u0627\u062a\u0634\u0627\u062a"),e.k0s(),e.j41(30,"p",20),e.EFF(31),e.k0s()(),e.j41(32,"div",17)(33,"h3",18),e.EFF(34,"\u0639\u062f\u062f \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646"),e.k0s(),e.j41(35,"p",21),e.EFF(36),e.k0s()()()(),e.j41(37,"div",22)(38,"button",23),e.EFF(39," \u0639\u0631\u0636 \u0643\u0644 \u0627\u0644\u0628\u0637\u0648\u0644\u0627\u062a "),e.k0s(),e.j41(40,"div",24)(41,"table",25)(42,"thead",26)(43,"tr",27)(44,"th",28),e.EFF(45,"\u0627\u0633\u0645 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(46,"th",28),e.EFF(47,"\u062d\u0627\u0644\u0629 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(48,"th",28),e.EFF(49,"\u0646\u0648\u0639 \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(50,"th",28),e.EFF(51,"\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0628\u0637\u0648\u0644\u0629"),e.k0s(),e.j41(52,"th",28),e.EFF(53,"\u0627\u0644\u0641\u0627\u0626\u0632"),e.k0s(),e.j41(54,"th",28),e.EFF(55,"\u062d\u0630\u0641"),e.k0s()()(),e.j41(56,"tbody",29),e.DNE(57,L,15,12,"tr",30),e.k0s()()()()(),e.DNE(58,A,14,1,"div",31),e.DNE(59,S,10,1,"div",31),e.DNE(60,V,25,5,"div",31),e.DNE(61,X,11,0,"div",31),e.k0s()),2&s&&(e.R7$(1),e.Y8G("ngClass",e.l_i(16,Y,u.isSidebarOpen,!u.isSidebarOpen)),e.R7$(5),e.Y8G("ngIf",u.isSidebarOpen),e.R7$(1),e.Y8G("ngIf",u.isSidebarOpen),e.R7$(2),e.Y8G("ngIf",u.selectedPlayer),e.R7$(8),e.Y8G("ngIf",u.totalMessagesLeft>0),e.R7$(1),e.Y8G("ngIf",null==u.leagueData),e.R7$(1),e.Y8G("ngIf",null!=u.leagueData),e.R7$(1),e.Y8G("ngIf",u.leagueData),e.R7$(6),e.JRh(u.totalMatchesLeft),e.R7$(5),e.JRh(u.totalMatches),e.R7$(5),e.JRh(u.totalPlayers),e.R7$(21),e.Y8G("ngForOf",u.leagues),e.R7$(1),e.Y8G("ngIf",u.showDeleteModal),e.R7$(1),e.Y8G("ngIf",u.showModal),e.R7$(1),e.Y8G("ngIf",u.showStartLeagueModal),e.R7$(1),e.Y8G("ngIf",u.showEndLeagueModal))},dependencies:[o.YU,o.Sq,o.bT,h.Wk,c.xH,c.y7,c.me,c.wz,c.BC,c.vS,o.vh]})}}return r})(),B=(()=>{class r{transform(t,s=2){if(!t)return"";let u=new Date(t);return u.setHours(u.getHours()+s),u.toLocaleString()}static{this.\u0275fac=function(s){return new(s||r)}}static{this.\u0275pipe=e.EJ8({name:"utcToLocal",type:r,pure:!0})}}return r})();function O(r,a){1&r&&(e.j41(0,"div",6),e.EFF(1," \u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644 \u0647\u0646\u0627 \u{1f4ed} "),e.k0s())}const U=function(r,a){return{"border-green-500":r,"border-red-500":a}},Q=function(r,a){return{"bg-red-500":r,"bg-green-500":a}};function J(r,a){if(1&r){const t=e.RV6();e.j41(0,"div",9)(1,"button",10),e.bIt("click",function(){const n=e.eBV(t).$implicit,i=e.XpG(2);return e.Njj(i.toggleMarkMessage(n))}),e.EFF(2),e.k0s(),e.j41(3,"button",11),e.bIt("click",function(){const n=e.eBV(t).$implicit,i=e.XpG(2);return e.Njj(i.toggleDeleteMessage(n))}),e.EFF(4," Delete "),e.k0s(),e.j41(5,"p",12),e.EFF(6),e.k0s(),e.j41(7,"p",13),e.EFF(8),e.k0s(),e.j41(9,"p",14),e.EFF(10),e.nI1(11,"utcToLocal"),e.k0s()()}if(2&r){const t=a.$implicit;e.Y8G("ngClass",e.l_i(9,U,t.isRead,!t.isRead)),e.R7$(1),e.Y8G("ngClass",e.l_i(12,Q,!t.isRead,t.isRead)),e.R7$(1),e.SpI(" ",t.isRead?"Mark Unread ":"Mark as Read "," "),e.R7$(4),e.JRh(t.content),e.R7$(2),e.Lme(" \u0645\u0646: ",t.senderFullName," (",t.senderPhoneNumber,") "),e.R7$(2),e.SpI(" ",e.bMT(11,7,t.sentAt)," : \u0628\u062a\u0627\u0631\u064a\u062e ")}}function H(r,a){if(1&r&&(e.j41(0,"div",7),e.DNE(1,J,12,15,"div",8),e.k0s()),2&r){const t=e.XpG();e.R7$(1),e.Y8G("ngForOf",t.filteredMessages)}}const W=function(r,a){return{"bg-green-500 text-white":r,"bg-gray-200":a}},q=function(r,a){return{"bg-red-500 text-white":r,"bg-gray-200":a}},z=function(r,a){return{"bg-blue-500 text-white":r,"bg-gray-200":a}},K=[{path:"",component:F},{path:"players",component:F},{path:"inbox",component:(()=>{class r{constructor(t,s){this.messageService=t,this.toastr=s,this.messages=[],this.filteredMessages=[],this.activeTab="unread"}ngOnInit(){this.loadMessages()}loadMessages(){this.messageService.getMessages().subscribe({next:t=>{t?(this.messages=t.messages.filter(s=>0==s.isDeleted).sort((s,u)=>new Date(u.sentAt).getTime()-new Date(s.sentAt).getTime()),this.filterMessages()):this.toastr.error("\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0622\u0646")},error:t=>{this.toastr.error("\u062d\u0635\u0644 \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062c\u0644\u0628 \u0627\u0644\u0631\u0633\u0627\u0626\u0644")}})}filterMessages(){this.filteredMessages="all"===this.activeTab?this.messages:this.messages.filter("read"===this.activeTab?t=>t.isRead:t=>!t.isRead)}changeTab(t){this.activeTab=t,this.filterMessages()}toggleMarkMessage(t){this.messageService.toggleMarkMessage(t.id,!t.isRead).subscribe({next:s=>{s.success&&(this.toastr.success("\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u062d\u0627\u0644\u0629 \u0627\u0644\u0631\u0633\u0627\u0644\u0629"),t.isRead=!t.isRead,this.filterMessages(),this.loadMessages())},error:s=>{this.toastr.error("\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u062d\u0627\u0644\u0629"),console.error(s)}})}toggleDeleteMessage(t){this.messageService.toggleDeleteMessage(t.id,!t.isDeleted).subscribe({next:s=>{s.success&&(this.toastr.success(s.message),t.isDeleted=!t.isDeleted,this.filterMessages(),this.loadMessages())},error:s=>{this.toastr.error("\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062d\u0630\u0641 "),console.error(s)}})}static{this.\u0275fac=function(s){return new(s||r)(e.rXU(y.b),e.rXU(f.tw))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-inbox"]],decls:12,vars:14,consts:[[1,"container","mx-auto","p-4"],[1,"text-2xl","font-bold","text-center","mb-6"],[1,"flex","justify-center","mb-6"],[1,"px-4","py-2","mx-2","rounded-md","border","border-gray-300",3,"ngClass","click"],["class","text-center text-gray-500",4,"ngIf"],["class","space-y-4",4,"ngIf"],[1,"text-center","text-gray-500"],[1,"space-y-4"],["class","bg-white shadow-md rounded p-4 border-l-4 w-4/5 mx-auto relative",3,"ngClass",4,"ngFor","ngForOf"],[1,"bg-white","shadow-md","rounded","p-4","border-l-4","w-4/5","mx-auto","relative",3,"ngClass"],[1,"absolute","top-3","right-3","px-3","py-1","rounded-md","text-white","text-sm",3,"ngClass","click"],[1,"absolute","top-3","ledt-3","px-3","py-1","rounded-md","text-white","text-sm","bg-red-700",3,"click"],[1,"text-gray-700","mt-6"],[1,"text-sm","text-gray-500","mt-2"],[1,"text-sm","text-gray-500"]],template:function(s,u){1&s&&(e.j41(0,"div",0)(1,"h2",1),e.EFF(2,"\u{1f4e5} \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0648\u0627\u0631\u062f"),e.k0s(),e.j41(3,"div",2)(4,"button",3),e.bIt("click",function(){return u.changeTab("read")}),e.EFF(5," \u0627\u0644\u0645\u0642\u0631\u0648\u0621\u0629 \u2705 "),e.k0s(),e.j41(6,"button",3),e.bIt("click",function(){return u.changeTab("unread")}),e.EFF(7," \u063a\u064a\u0631 \u0627\u0644\u0645\u0642\u0631\u0648\u0621\u0629 \u274c "),e.k0s(),e.j41(8,"button",3),e.bIt("click",function(){return u.changeTab("all")}),e.EFF(9," \u0643\u0644 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 "),e.k0s()(),e.DNE(10,O,2,0,"div",4),e.DNE(11,H,2,1,"div",5),e.k0s()),2&s&&(e.R7$(4),e.Y8G("ngClass",e.l_i(5,W,"read"===u.activeTab,"read"!==u.activeTab)),e.R7$(2),e.Y8G("ngClass",e.l_i(8,q,"unread"===u.activeTab,"unread"!==u.activeTab)),e.R7$(2),e.Y8G("ngClass",e.l_i(11,z,"all"===u.activeTab,"all"!==u.activeTab)),e.R7$(2),e.Y8G("ngIf",0===u.filteredMessages.length),e.R7$(1),e.Y8G("ngIf",u.filteredMessages.length>0))},dependencies:[o.YU,o.Sq,o.bT,B]})}}return r})()}];let Z=(()=>{class r{static{this.\u0275fac=function(s){return new(s||r)}}static{this.\u0275mod=e.$C({type:r})}static{this.\u0275inj=e.G2t({imports:[h.iI.forChild(K),h.iI]})}}return r})();var ee=l(5694);let te=(()=>{class r{static{this.\u0275fac=function(s){return new(s||r)}}static{this.\u0275mod=e.$C({type:r})}static{this.\u0275inj=e.G2t({imports:[o.MD,Z,c.YN,_.q1,ee.PlayerModule]})}}return r})()}}]);