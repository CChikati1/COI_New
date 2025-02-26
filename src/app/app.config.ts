import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

// import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { provideAnimations } from '@angular/platform-browser/animations';
import { TaskApproveComponent } from './task-approve/task-approve.component';
import { TaskTrackComponent } from './task-track/task-track.component';
import { TaskPrintComponent } from './task-print/task-print.component';
import { CoiReportComponent } from './coi-report/coi-report.component';
import { MatDialogModule } from '@angular/material/dialog';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter([
      { path: '', component: TaskTrackComponent }, // Default route (COI list)
      { path: 'coi/:id', component: TaskApproveComponent }, // Route with COI ID
      { path: 'print/:id', component: TaskPrintComponent },
      {path:'report' , component:CoiReportComponent}
    ], withComponentInputBinding()), 
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(MatDialogModule) 
    

  ]
};


