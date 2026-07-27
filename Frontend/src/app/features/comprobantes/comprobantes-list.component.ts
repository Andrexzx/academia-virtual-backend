import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprobanteService } from '../../core/services/comprobante.service';
import { Comprobante } from '../../core/models/comprobante.model';

@Component({
  selector: 'app-comprobantes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comprobantes-list.component.html',
  styleUrls: ['./comprobantes-list.component.css']
})
export class ComprobantesListComponent implements OnInit {
  private comprobanteService = inject(ComprobanteService);

  comprobantes: Comprobante[] = [];
  filteredComprobantes: Comprobante[] = [];
  searchTerm = '';
  loading = false;
  errorMessage: string | null = null;

  comprobanteSeleccionado: Comprobante | null = null;
  isModalOpen = false;

  totalFacturado = 0;
  totalIva = 0;

  ngOnInit(): void {
    this.cargarComprobantes();
  }

  cargarComprobantes(): void {
    this.loading = true;
    this.errorMessage = null;
    this.comprobanteService.listar().subscribe({
      next: (data) => {
        this.comprobantes = data;
        this.calcularTotales();
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar comprobantes';
        this.loading = false;
      }
    });
  }

  calcularTotales(): void {
    this.totalFacturado = this.comprobantes.reduce((acc, c) => acc + c.total, 0);
    this.totalIva = this.comprobantes.reduce((acc, c) => acc + c.iva, 0);
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredComprobantes = [...this.comprobantes];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredComprobantes = this.comprobantes.filter(c =>
      c.id_comprobante.toString().includes(term) ||
      c.id_matricula.toString().includes(term) ||
      c.fecha.includes(term) ||
      c.total.toString().includes(term)
    );
  }

  verComprobante(comp: Comprobante): void {
    this.comprobanteSeleccionado = comp;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.comprobanteSeleccionado = null;
  }
}
