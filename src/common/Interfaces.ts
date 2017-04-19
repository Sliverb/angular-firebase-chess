
export interface IFirebaseConfig {
    readonly apiKey: string;
    readonly authDomain: string;
    readonly databaseURL: string;
    readonly projectId: string;
    readonly storageBucket: string;
    readonly messagingSenderId: string;
}

export interface IGame {
    p1_token: string;
    p2_token: string;
    moves: string;
    fen: string;
}
