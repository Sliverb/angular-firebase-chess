// Node modules
import * as Chess from 'chess.js';
import { Subscription } from 'rxjs/rx';
import * as ChessBoard from 'chessboardjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

// Local modules
import { IGame } from '../../common/Interfaces';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    readonly INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    public fbSubcriptions: Map<string, Subscription> = new Map<string, Subscription>();
    public token: string;
    public engine: ChessInstance;
    public board: ChessBoardInstance;
    public moves: string[];
    public p1_token: string;
    public p2_token: string;
    public turnText: string;
    public statusText: string;

    constructor(
        private _route: ActivatedRoute,
        private _angularFire: AngularFire) {

        this.engine = new Chess();
    }

    ngOnInit() {
        this._route.params.subscribe((params) => {
            this.token = params['token'];
            console.log(this.token);
            // TODO: Create an interface for the game object
            this.listenForUpdates(this.token, (id: string, game: IGame) => {
                this.updateBoard(id, game);
                this.updateInfo(game);
            });
        });
    }

    history(): string | string[] {
        if (!this.moves) {
            return 'Nothing yet';
        } else {
            return this.moves.map((m, idx) => `<span key=${m}>${idx + 1}) ${m}</span>`);
        }
    }

    updateBoard(id: string, game: IGame): void {
        const playerNumber = this.extractPlayerNumber(this.token, game);
        this.engine.load(game.fen || this.INITIAL_FEN);

        if (!this.board) {
            this.board = this.initBoard(id, game);
            this.board.position(this.engine.fen());
        } else if (this.isMyTurn(playerNumber, this.engine.turn())) {
            this.board.position(this.engine.fen());
        }
    }

    initBoard(id: string, game: IGame): ChessBoardInstance {
        // Cache state
        const self = this;
        const token = self.token;
        const engine = self.engine;
        const playerNumber = self.extractPlayerNumber(token, game);
        const boardConfig: ChessBoardJS.BoardConfig = {
            draggable: true,
            pieceTheme: 'https://s3-us-west-2.amazonaws.com/chessimg/{piece}.png',
            onDragStart: onDragStartFunc,
            onDrop: onDropFunc,
            onSnapEnd: onSnapEndFunc
        };

        const board = ChessBoard('game-board', boardConfig);
        if (playerNumber === 2) {
            board.orientation('black');
        }
        return board;

        function onDragStartFunc(source: string, piece: string): boolean {
            return !engine.game_over() &&
                self.isMyTurn(playerNumber, engine.turn()) &&
                self.allowMove(engine.turn(), piece);
        };

        function onDropFunc(source: string, target: string): string {
            const tryMove: ChessJS.Move = {
                from: source,
                to: target,
                promotion: 'q'
            };
            const moveResult: ChessJS.Move = self.engine.move(tryMove);
            if (moveResult === null) {
                return 'snapback';
            }

            game.fen = engine.fen();
            game.moves = self.pushMove(game.moves, `${moveResult['from']}-${moveResult['to']}`);
            self._angularFire.database.object(`/games/${id}`).set(game);
        };

        function onSnapEndFunc() {
            return self.board.position(engine.fen());
        };
    }

    updateInfo(game: IGame): void {
        // Cache engine so to avoid crazy changes
        const engine = this.engine;
        const playerNumber = this.extractPlayerNumber(this.token, game);
        this.moves = game.moves ? game.moves.split(',') : [];
        this.p1_token = game.p1_token;
        this.p2_token = game.p2_token;
        this.turnText = this.createTurnText(playerNumber, this.isMyTurn(playerNumber, engine.turn()));
        this.statusText = this.createStatusText(engine.turn(), engine.in_checkmate(), engine.in_draw(), engine.in_check());
    }

    extractPlayerNumber(token: string, game: IGame): number {
        if (token === game.p1_token) {
            return 1;
        } else if (token === game.p2_token) {
            return 2;
        } else {
            return 0;
        }
    }

    pushMove(moves: string, move: string): string {
        if (!moves) {
            return [move].join(',');
        } else {
            const arr = moves.split(',');
            return [...arr, move].join(',');
        }
    }

    isMyTurn(playerNumber: number, turn: string): boolean {
        return (playerNumber === 1 && turn === 'w') || (playerNumber === 2 && turn === 'b');
    }

    allowMove(turn: string, piece: string): boolean {
        return !(turn === 'w' && piece.search(/^b/) !== -1) || (turn.toString() === 'b' && piece.search(/^w/) !== -1);
    }

    createTurnText(playerNumber: number, isMyTurn: boolean): string {
        if (playerNumber > 0) {
            if (isMyTurn) {
                return `Your Turn`;
            } else {
                return `Waiting for opponent's move...`;
            }
        } else {
            return `View Only`;
        }
    }

    createStatusText(turn: string, in_mate: boolean, in_draw: boolean, in_check: boolean): string {
        const moveColor = (turn === 'b') ? 'Black' : 'White';
        if (in_mate) {
            return `Game Over, ${moveColor} is in checkmate`;
        } else if (in_draw) {
            return 'Game over, drawn position';
        } else if (in_check) {
            return `${moveColor} is in check!`;
        } else {
            return 'Game going strong...';
        }
    }

    listenForUpdates(token: string, cb: any): void {
        const tokenLabels: string[] = ['p1_token', 'p2_token'];
        tokenLabels.forEach((label) => {
            const tmpSubcription: Subscription = this._angularFire.database.list('/games', {
                query: {
                    orderByChild: label,
                    equalTo: this.token
                }
            }).subscribe((snapshots) => {
                snapshots.forEach((snapshot) => {
                    cb(snapshot.$key, snapshot);
                });
                this.fbSubcriptions.set(label, tmpSubcription);
            });
        });
    }

    getDomainInfo(): string {
        const { hostname, port } = window.location;
        if (port) {
            return `http://${hostname}:${port}`;
        } else {
            return `http://${hostname}`;
        }
    }

    ngOnDestroy(): void {
        this.fbSubcriptions.forEach((sub, key) => {
            console.log(`Unsubscribing from ${key}`);
            sub.unsubscribe();
        });
    }

}
