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
      // Al final de onMouseUp:
      
      
      this.wsService.send({
        tipo: 'mover',
        handle: ventana.Handle,
        x: Math.round(ventana.X),
        y: Math.round(ventana.Y)
      });
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    this.ventanas = [...this.ventanas]; // re-renderización
  }
  
  
  cerrarVentana(index: number) {
  const ventana = this.ventanas[index];

  this.ventanas.splice(index, 1);

  // (Opcional) Enviar mensaje al backend para cerrar la ventana
  this.wsService.send(JSON.stringify({
    tipo: 'cerrar',
    title: ventana.Title
  }));
  
}


}
