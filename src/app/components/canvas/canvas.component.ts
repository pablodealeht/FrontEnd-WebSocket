import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/web-socket.service';
import { WindowInfo } from '../../models/window-info.model';

@Component({
  selector: 'app-canvas',
  standalone: true,  
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  ventanas: WindowInfo[] = [];
  pantallaWidth = 1920;
  pantallaHeight = 1080;
  scale = 1;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.connect('ws://localhost:5197/ws');
  
    this.wsService.getMessages().subscribe((data: any) => {
      if (data?.pantalla && data?.ventanas) {
        this.pantallaWidth = data.pantalla.width;
        this.pantallaHeight = data.pantalla.height;
        this.scale = window.innerWidth / this.pantallaWidth;
        this.ventanas = data.ventanas;
      } else {
        console.warn('[CanvasComponent] Mensaje inesperado:', data);
      }
    });
  
    setInterval(() => {
      this.wsService.send('obtener-ventanas');
    }, 2000);
  }
  startDrag(event: MouseEvent, index: number) {
    const ventana = this.ventanas[index];
  
    const offsetX = event.clientX - ventana.X * this.scale;
    const offsetY = event.clientY - ventana.Y * this.scale;
  
    const onMouseMove = (e: MouseEvent) => {
      ventana.X = (e.clientX - offsetX) / this.scale;
      ventana.Y = (e.clientY - offsetY) / this.scale;
    };
  
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
  
      const nuevaX = Math.round(ventana.X);
      const nuevaY = Math.round(ventana.Y);
  
      const colisiona = this.hayColision(nuevaX, nuevaY, ventana.Width, ventana.Height, index);
  
      if (!colisiona) {
        this.wsService.send({
          tipo: 'mover',
          handle: ventana.Handle,
          x: nuevaX,
          y: nuevaY
        });
      } else {
        console.warn('Movimiento cancelado por colisión');
        this.wsService.send('obtener-ventanas'); // Refresca desde el backend
      }
    };
  
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    this.ventanas = [...this.ventanas]; // Fuerza re-render
  }
  
  
  
  cerrarVentana(index: number) {
  const ventana = this.ventanas[index];

  this.ventanas.splice(index, 1);

  this.wsService.send(JSON.stringify({
    tipo: 'cerrar',
    title: ventana.Title
  }));
  
}

private hayColision(x: number, y: number, width: number, height: number, indexActual: number): boolean {
  return this.ventanas.some((ventana, index) => {
    if (index === indexActual) return false;

    const x1 = x;
    const y1 = y;
    const x2 = x + width;
    const y2 = y + height;

    const vx1 = ventana.X;
    const vy1 = ventana.Y;
    const vx2 = ventana.X + ventana.Width;
    const vy2 = ventana.Y + ventana.Height;

    // Si se solapan, hay colisión
    return !(x2 <= vx1 || x1 >= vx2 || y2 <= vy1 || y1 >= vy2);
  });
}




}
