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
