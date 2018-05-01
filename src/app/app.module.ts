// Node modules
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireDatabaseModule } from 'angularfire2/database';

// Local modules
import { AppComponent } from './app.component';
import { SanitizeHtmlPipe } from '../pipes/SanitizeHtml';
import { FirebaseConfig } from '../environments/environment';
import { AppRoutingModule, RoutingComponents } from './app.routes';

// export const FirebaseAuthConfig  = {
//     provider: AuthProviders.Anonymous,
//     method: AuthMethods.Anonymous
// };

@NgModule({
  declarations: [
    AppComponent,
    SanitizeHtmlPipe,
    RoutingComponents
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FirebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
