// Node modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Local modules
import { HomeComponent } from '../components/home/home.component';
import { GameComponent } from '../components/game/game.component';
import { PageNotFoundComponent } from '../components/pagenotfound/pagenotfound.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'game/:key/:token', component: GameComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }

export const RoutingComponents = [ HomeComponent, GameComponent, PageNotFoundComponent ];
