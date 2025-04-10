import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CanvasComponent } from './components/canvas/canvas.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CanvasComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logueado = localStorage.getItem('logueado') === 'true';

  onLoginExitoso() {
    this.logueado = true;
  }
}
