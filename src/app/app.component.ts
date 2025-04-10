import { Component } from '@angular/core';
import { CanvasComponent } from './components/canvas/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CanvasComponent], // 👈 Importamos el otro standalone acá
  template: `<app-canvas></app-canvas>`, // 👈 ya no hace falta html externo si querés
})
export class AppComponent {}
