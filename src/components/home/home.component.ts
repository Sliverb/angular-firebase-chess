// Node modules
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

// Local modules
import { Utils } from '../../common/Utils';
import { IGame } from '../../common/Interfaces';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private _router: Router,
        private _afDb: AngularFireDatabase) { }

    ngOnInit() {
    }

    async createGame(): Promise<void> {
        const newGame: IGame = {
            p1_token: Utils.GenToken(),
            p2_token: Utils.GenToken(),
            moves: null,
            fen: null
        };

        const game: AngularFireList<IGame> = this._afDb.list<IGame>('/games');
        const result = await game.push(newGame);
        console.log('HomeComponent.createGame: push game result', result);
        if (!Utils.IsStringNullOrEmpty(result.key)) {
            this._router.navigate([`game`, result.key, newGame.p1_token]);
        } else {
            // Error pushing game
        }
    }
}
