// Node modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

// Local modules
import { AppComponent } from './app.component';
import { FirebaseConfig } from '../environments/environment';
import { AppRoutingModule, RoutingComponents } from './app.routes';

export const FirebaseAuthConfig  = {
    provider: AuthProviders.Anonymous,
    method: AuthMethods.Anonymous
};

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(FirebaseConfig, FirebaseAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
