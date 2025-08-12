export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  userRole?: string;
}

export interface ResultResponse {
  success: boolean;
  message: string;
}

export interface Player {
  playerId: number;
  fullName: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  matchesPlayed: number;
  rank: number;
  winRate: number;
  groupNumber?: number;
}

export interface CommonResponse {
  success: boolean;
  message: string;
}

export interface MessagesResponse {
  success: boolean;
  message: string;
  messages: Message[];
}
export interface NoteResponse {
  success: boolean;
  message: string;
  notes: Note[];
}

export interface Note {
  id: number;
  content: string;
  isDeleted: boolean;
  isHidden: boolean;
}
export interface Message {
  id: number;
  senderId: string;
  senderFullName: string;
  senderPhoneNumber: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
  sentAt: string;
  isFromAdmin: boolean;
}

export enum TournamentStage {
  League = 0, // القيمة الافتراضية
  GroupStage = 1, // 1
  QuarterFinals = 2, // 2
  SemiFinals = 3, // 3
  Final = 4, // 4
}

export interface Match {
  matchId: number;
  score1: number;
  score2: number;
  isCompleted: boolean;
  player1Name: string;
  player2Name: string;
  player1Id: number;
  player2Id: number;
  winnerId?: number | null;
  stage?: TournamentStage;
  tournamentStage?: string;
}

export enum SystemOfLeague {
  Points = 0,
  Classic = 1,
}

export interface StartLeagueDto {
  name: string;
  description: string;
  typeOfLeague: LeagueType;
  systemOfLeague: SystemOfLeague;
  // Optional: applies when SystemOfLeague = Points
  roundsPerMatch?: number;
}

export enum LeagueType {
  Single = 0,
  Multi = 1,
  Groups = 2,
}

export interface League {
  id: number;
  name: string;
  description: string;
  createdOn: string;
  typeOfLeague: LeagueType;
  isFinished: boolean;
  systemOfLeague?: SystemOfLeague;
}

export interface LeagueResponse {
  response: CommonResponse;
  league: League;
}
export interface AllLeagueMatches {
  leagueId: number;
  leagueName: string;
  leagueDescription: string;
  leagueType: number;
  isFinished: boolean;
  systemOfLeague: SystemOfLeague;
  createdOn: string;
  matches: Match[];
}

export interface Group {
  groupNumber: number;
  players: Player[];
  matches?: Match[];
}

export interface AllLeagueRank {
  leagueId: number;
  leagueName: string;
  leagueDescription: string;
  leagueType: number;
  systemOfLeague: SystemOfLeague;
  isFinished: boolean;
  createdOn: string;
  players: Player[] | null;
  groups: Group[] | null;
  matches: Match[] | null;
  knockoutMatches: Match[] | null;
}

// Multi-Tournament Types
export type SystemOfScoring = 'Classic' | 'Points';
export type TournamentStatus = 'Created' | 'Started' | 'Finished';

export interface Tournament {
  multiTournamentId: number;
  name: string;
  systemOfScoring: SystemOfScoring;
  teamCount: number;
  playersPerTeam: number;
  status: TournamentStatus;
  isActive: boolean;
  createdOn: string;
  startedOn?: string;
  finishedOn?: string;
  championTeamId?: number;
  championTeamName?: string;
  teams: Team[];
}

export interface Team {
  multiTeamId: number;
  teamName: string;
  totalPoints: number;
  wins: number;
  draws: number;
  losses: number;
  createdOn: string;
  players: MultiPlayer[];
}

export interface MultiPlayer {
  playerId: number;
  fullName: string;
  isActive: boolean;
  createdOn: string;
  multiParticipations: number;
  multiTitlesWon: number;
}

export interface MultiMatch {
  multiMatchId: number;
  team1Id: number;
  team1Name: string;
  team2Id: number;
  team2Name: string;
  player1Id: number;
  player1Name: string;
  player2Id: number;
  player2Name: string;
  score1?: number;
  score2?: number;
  totalPoints1?: number;
  totalPoints2?: number;
  isCompleted: boolean;
  completedOn?: string;
}

export interface MatchFixture {
  team1Id: number;
  team1Name: string;
  team2Id: number;
  team2Name: string;
  matches: MultiMatch[];
}

export interface Standings {
  tournamentId: number;
  tournamentName: string;
  status: string;
  championTeamId?: number;
  standings: TeamStanding[];
}

export interface TeamStanding {
  position: number;
  multiTeamId: number;
  teamName: string;
  totalPoints: number;
  wins: number;
  draws: number;
  losses: number;
  matchesPlayed: number;
}

// Request DTOs
export interface CreateTournamentRequest {
  name: string;
  systemOfScoring: SystemOfScoring;
  teamCount: number;
  playersPerTeam: number;
}

export interface UpdateTournamentStatusRequest {
  status: TournamentStatus;
}

export interface CreateTeamRequest {
  teamName: string;
  playerIds: number[];
}

export interface UpdateTeamRequest {
  teamName?: string;
  playerIds?: number[];
}

export interface MatchResultRequest {
  score1?: number;
  score2?: number;
  totalPoints1?: number;
  totalPoints2?: number;
}

export interface AddPlayerRequest {
  fullName: string;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
