// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CanvasComponent } from './components/canvas/canvas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'canvas', component: CanvasComponent },
  { path: '**', redirectTo: 'login' }
];
