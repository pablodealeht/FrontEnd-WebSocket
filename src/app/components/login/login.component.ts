import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  @Output() loginExitoso = new EventEmitter<void>();

  login() {
    if (this.username === 'admin' && this.password === '1234') {
      localStorage.setItem('logueado', 'true');
      this.loginExitoso.emit();
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
