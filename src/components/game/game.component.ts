// Node modules
import * as Chess from 'chess.js';
import { Subscription } from 'rxjs/rx';
import * as ChessBoard from 'chessboardjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Local modules
import { IGame } from '../../common/Interfaces';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

    readonly INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

    private _fbSubcription: Subscription;

    public id: string;
    public token: string;
    public moves: string[];
    public p1_token: string;
    public p2_token: string;
    public turnText: string;
    public statusText: string;
    public engine: ChessInstance;
    public board: ChessBoardInstance;

    constructor(
        private _route: ActivatedRoute,
        private _afDb: AngularFireDatabase) {

        this.engine = new Chess();
    }

    ngOnInit() {
        this._route.params.subscribe((params) => {
            this.id = params['key'];
            this.token = params['token'];
            this.listenForUpdates(this.id, this.token);
        });
    }

    history(): string | string[] {
        if (!this.moves) {
            return 'Nothing yet';
        } else {
            return this.moves.map((m, idx) => `<span key=${m}>${idx + 1}) ${m}</span>`);
        }
    }

    updateBoard(game: IGame): void {
        const playerNumber: number = this.extractPlayerNumber(this.token, game);
        this.moves = game.moves ? game.moves.split(',') : [];
        this.engine.load(game.fen || this.INITIAL_FEN);

        if (!this.board) {
            this.board = this.initBoard(game);
            this.board.position(this.engine.fen());
        } else if (this.isMyTurn(playerNumber, this.engine.turn())) {
            this.board.position(this.engine.fen());
        }
    }

    initBoard(game: IGame): ChessBoardInstance {
        // Cache state
        const engine = this.engine;
        const playerNumber: number = this.extractPlayerNumber(this.token, game);

        const onDragStartFunc = (source: string, piece: string): boolean => {
            return (
                !engine.game_over() &&
                this.isMyTurn(playerNumber, engine.turn()) &&
                this.allowMove(engine.turn(), piece)
            );
        };

        const onDropFunc = async (source: string, target: string): Promise<string> => {
            const tryMove: ChessJS.Move = {
                from: source,
                to: target,
                promotion: 'q'
            };
            const moveResult: ChessJS.Move = this.engine.move(tryMove);
            if (moveResult == null) {
                return 'snapback';
            }

            game.fen = engine.fen();
            game.moves = this.pushMove(this.moves, `${moveResult['from']}-${moveResult['to']}`);
            await this._afDb.object<IGame>(`/games/${this.id}`).set(game);
        };

        const onSnapEndFunc = () => {
            return this.board.position(engine.fen());
        };

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
    }

    updateInfo(game: IGame): void {
        // Cache engine so to avoid crazy changes
        const engine = this.engine;
        const playerNumber = this.extractPlayerNumber(this.token, game);
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

    pushMove(moves: string[], move: string): string {
        if (!moves) {
            return [move].join(',');
        } else {
            // const arr = moves.split(',');
            return [...moves, move].join(',');
        }
    }

    isMyTurn(playerNumber: number, turn: string): boolean {
        return (
            ((playerNumber === 1) && (String(turn).toLowerCase() === 'w')) ||
            ((playerNumber === 2) && (String(turn).toLowerCase() === 'b'))
        );
    }

    allowMove(turn: string, piece: string): boolean {
        return !(
            ((String(turn).toLowerCase() === 'w') && (piece.search(/^b/) !== -1)) ||
            ((String(turn).toLowerCase() === 'b') && (piece.search(/^w/) !== -1))
        );
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

    listenForUpdates(id: string, token: string): void {
        this._fbSubcription = this._afDb.object<IGame>(`/games/${id}`)
            .valueChanges()
            .subscribe((game) => {
                console.log(`GameComponent.listenForUpdates: subscribe game`, game);
                if ((game.p1_token === token) || (game.p2_token === token)) {
                    this.updateBoard(game);
                    this.updateInfo(game);
                } else {
                    // Game not found: Unsubscribe
                    this.ngOnDestroy();
                }
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
        if (this._fbSubcription) {
            this._fbSubcription.unsubscribe();
            this._fbSubcription = null;
            console.log(`GameComponent.ngOnDestroy: Unsubscribing from firebase`);
        } else {
            // Subscription not set/initialized
        }
    }
}
