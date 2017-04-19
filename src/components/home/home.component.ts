import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Utils } from '../../common/Utils';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private _router: Router,
        private _angularFire: AngularFire) { }

    ngOnInit() {

    }

    createGame(): void {
        const newGame = {
            p1_token: Utils.GenToken(),
            p2_token: Utils.GenToken()
        };

        this._router.navigate([`game/${newGame.p1_token}`]);

        const game: FirebaseListObservable<any[]> = this._angularFire.database.list('/games');
        game.push(newGame)
            .then((result) => {
                // console.log(result);
                this._router.navigate([`game/${newGame.p1_token}`]);
            })
            .catch((error) => {
                console.log(error);
            });
    }

}
