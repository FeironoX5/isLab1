import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {HomePage} from './pages/home-page/home-page';
import {OperationsPage} from './pages/operations-page/operations-page';
import {HomePageActions} from './pages/home-page/home-page-actions';
import {provideHttpClient} from '@angular/common/http';
import {provideNativeDateAdapter} from '@angular/material/core';
import {OperationsPageActions} from './pages/operations-page/operations-page-actions';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter([
      {
        path: '',
        redirectTo: 'home/0',
        pathMatch: 'full',
      },
      {
        path: 'home/:tableIndex',
        children: [
          {path: '', component: HomePage},
          {path: '', component: HomePageActions, outlet: 'actions'},
        ]
      },
      {
        path: 'operations',
        children: [
          {path: '', component: OperationsPage},
          {path: '', component: OperationsPageActions, outlet: 'actions'},
        ]
      },
    ]),
    provideHttpClient(),
    provideNativeDateAdapter()
  ]
};
