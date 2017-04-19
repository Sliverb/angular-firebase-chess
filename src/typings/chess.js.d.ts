// Type definitions for chess.js 0.10.2
// Project: https://github.com/jhlywa/chess.js
// Definitions by: Bayo Olatunji <https://github.com/sliverb>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// import * as Chess from 'chess.js';

declare namespace ChessJS {
    interface ChessPiece {
        type: ChessJS.Types.ChessType;
        color: ChessJS.Types.ChessColor;
    }

    interface ValidationObject {
        error: string;
        valid: boolean;
        error_number: number;
    }

    interface Flags {
        NORMAL: string;
        CAPTURE: string;
        BIG_PAWN: string;
        EP_CAPTURE: string;
        PROMOTION: string;
        KSIDE_CASTLE: string;
        QSIDE_CASTLE: string;
    }

    interface Move {
        to: string;
        from: string;
        san?: string;
        flags?: string;
        piece?: string;
        color?: string;
        captured?: string;
        promotion?: string;
    }
}

declare namespace ChessJS.Types {
    type ChessColor = 'b' | 'w';
    // type ChessColorVar = Chess.BLACK | Chess.WHITE;

    type ChessType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
    // type ChessTypeVar = Chess.PAWN | Chess.KNIGHT | Chess.BISHOP | Chess.ROOK | Chess.QUEEN | Chess.KING;
}

declare namespace ChessJS.Options {
    interface Move {
        sloppy: boolean;
    }

    interface History {
        verbose: boolean;
    }

    interface Moves {
        legal?: boolean;
        square?: string;
        verbose?: boolean;
    }

    interface Pgn {
        sloppy?: boolean;
        max_width?: number;
        newline_char?: string;
    }
}

interface ChessInstance {
    readonly PAWN: string;
    readonly KNIGHT: string;
    readonly BISHOP: string;
    readonly ROOK: string;
    readonly QUEEN: string;
    readonly KING: string;
    readonly BLACK: string;
    readonly WHITE: string;
    readonly FLAGS: ChessJS.Flags;

    /* This is documented but not found in code */
    // board(): ChessPiece[][];

    load(fen: string): boolean;

    reset(): void;

    moves(options?: ChessJS.Options.Moves): string[] | ChessJS.Move[];

    in_check(): boolean;

    in_checkmate(): boolean;

    in_stalemate(): boolean;

    in_draw(): boolean;

    insufficient_material(): boolean;

    in_threefold_repetition(): boolean;

    game_over(): boolean;

    validate_fen(fen: string): ChessJS.ValidationObject;

    fen(): string;

    pgn(option?: ChessJS.Options.Pgn): string;

    load_pgn(pgn: string, options?: ChessJS.Options.Pgn): boolean;

    header(args?: any): void;
    header(): any;

    ascii(): string;

    turn(): string;

    move(move: string | ChessJS.Move, options?: ChessJS.Options.Move): ChessJS.Move;

    undo(): ChessJS.Move;

    clear(): void;

    put(piece: ChessJS.ChessPiece, square: string): boolean;

    get(square: string): ChessJS.ChessPiece;

    remove(square: string): ChessJS.ChessPiece;

    perft(depth: number): number;

    square_color(square: string): string;

    history(options: ChessJS.Options.History): ChessJS.Move[];
    history(): string[];
}

interface ChessFactory {
    new(fen: string): ChessInstance;
    new(): ChessInstance;
}

declare var Chess: ChessFactory;
declare module 'chess.js' {
    export = Chess;
}
