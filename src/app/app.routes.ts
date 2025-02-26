// import { Routes } from '@angular/router';
// import { DefaultlayoutComponent } from './containers/defaultlayout/defaultlayout.component'; 
// import { HomeComponent } from './containers/home/home.component';
// import { TaskTrackComponent } from './task-track/task-track.component';
// import { TaskApproveComponent } from './task-approve/task-approve.component';

// export const routes: Routes = [
  
//     {
//       path: 'home',
//       component: HomeComponent,
//       children: [
//         {
//           path: '',
//           redirectTo: 'tasktrack',
//           pathMatch: 'full', // Redirect to TaskTrackComponent by default
//         },
//         {
//           path: 'tasktrack',
//           component: TaskTrackComponent,
//           children: [
//             {
//               path: 'task-approve/:id',
//               component: TaskApproveComponent,
//             },
//           ],
//         },
//       ],
//     },
//     { path: '', redirectTo: 'home', pathMatch: 'full' },
// ];