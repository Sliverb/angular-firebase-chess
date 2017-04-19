// Type definitions for chess.js 0.10.2
// Project: https://github.com/oakmac/chessboardjs/
// Definitions by: Bayo Olatunji <https://github.com/sliverb>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace ChessBoardJS {
    interface BoardConfig {
        onDrop?: Function;
        draggable?: boolean;
        onChange?: Function;
        onMoveEnd?: Function;
        onSnapEnd?: Function;
        sparePieces?: boolean;
        onDragMove?: Function;
        showNotation?: boolean;
        onDragStart?: Function;
        onSnapbackEnd?: Function;
        onMouseoutSquare?: Function;
        onMouseoverSquare?: Function;
        pieceTheme?: string | Function;
        orientation?: ChessBoardJS.Types.OrientationType;
        showErrors?: boolean | string | Function;
        moveSpeed?: number | ChessBoardJS.Types.SpeedType;
        snapSpeed?: number | ChessBoardJS.Types.SpeedType;
        trashSpeed?: number | ChessBoardJS.Types.SpeedType;
        dropOffBoard?: ChessBoardJS.Types.DropOffBoardType;
        appearSpeed?: number | ChessBoardJS.Types.SpeedType;
        snapbackSpeed?: number | ChessBoardJS.Types.SpeedType;
        position?: ChessBoardJS.Types.PositionType | string | object;
    }
}

declare namespace ChessBoardJS.Types {
    type PositionType = 'start';
    type PositionFenType = 'fen';
    type SpeedType = 'slow' | 'fast';
    type OrientationFlipType = 'flip';
    type OrientationType = 'white' | 'black';
    type DropOffBoardType = 'snapback' | 'trash';
}

interface ChessBoardInstance {
    clear(useAnimation?: boolean): void;
    destroy(): void;
    fen(): string;
    flip(): void;
    move(...args: string[]): object; // *FIND RETURN*
    position(newPosition: object | string | ChessBoardJS.Types.PositionType, useAnimation?: boolean): void
    position(fen?: ChessBoardJS.Types.PositionFenType): string | object;
    orientation(side?: ChessBoardJS.Types.OrientationType | ChessBoardJS.Types.OrientationFlipType): string;
    resize(): void;
    start(useAnimation?: boolean): void;
}

interface ChessBoardFactory {
    (containerElOrId: any, config: ChessBoardJS.BoardConfig): ChessBoardInstance
    fenToObj(fen: string): any;
    objToFen(obj: any): any;
}

declare var ChessBoard: ChessBoardFactory;
declare module "chessboardjs" {
    export = ChessBoard;
}
