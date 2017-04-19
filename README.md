# angular-firebase-chess
Fun and light port of this this react firebase chess project https://appendto.com/2017/04/building-a-realtime-chess-game-with-react-and-firebase/
React source can be found here - https://github.com/hiquest/react-chess/

This is an project to help me learn angular 4 and more.

# NOTES
The enviroment files are currently missing as they contain my firebase creds. I will change this soon. In the mean time, you can create your own enviromnent files.
angular CLI creates 2 default files. environment.ts & environment.prod.ts
This is the content of the files (one for dev and one for prod of course)

// Local modules
import { IFirebaseConfig } from '../common/Interfaces';

export const environment = {
  production: true
};

export const FirebaseConfig: IFirebaseConfig = {
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
};


# NgChess

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).