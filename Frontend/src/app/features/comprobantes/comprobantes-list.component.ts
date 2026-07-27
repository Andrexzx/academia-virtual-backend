import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprobanteService } from '../../core/services/comprobante.service';
import { MatriculaService } from '../../core/services/matricula.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { Comprobante } from '../../core/models/comprobante.model';
import { Matricula } from '../../core/models/matricula.model';
import { Estudiante } from '../../core/models/estudiante.model';

@Component({
  selector: 'app-comprobantes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comprobantes-list.component.html',
  styleUrls: ['./comprobantes-list.component.css']
})
export class ComprobantesListComponent implements OnInit {
  private comprobanteService = inject(ComprobanteService);
  private matriculaService = inject(MatriculaService);
  private estudianteService = inject(EstudianteService);
  private cdr = inject(ChangeDetectorRef);

  comprobantes: Comprobante[] = [];
  filteredComprobantes: Comprobante[] = [];
  matriculasMap = new Map<number, Matricula>();
  estudiantesMap = new Map<number, Estudiante>();

  searchTerm = '';
  loading = false;
  errorMessage: string | null = null;

  totalFacturado = 0;
  totalIva = 0;

  comprobanteSeleccionado: Comprobante | null = null;
  isModalOpen = false;

  ngOnInit(): void {
    const cachedComprobantes = this.comprobanteService.getCached();
    const cachedMatriculas = this.matriculaService.getCached();
    const cachedEstudiantes = this.estudianteService.getCached();

    if (cachedComprobantes.length > 0) {
      this.comprobantes = cachedComprobantes;
      if (cachedMatriculas.length > 0) {
        cachedMatriculas.forEach(m => this.matriculasMap.set(m.id_matricula, m));
      }
      if (cachedEstudiantes.length > 0) {
        cachedEstudiantes.forEach(e => this.estudiantesMap.set(e.id_estudiante, e));
      }
      this.applyFilter();
      this.calcularTotales();
    } else {
      this.loading = true;
    }
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.errorMessage = null;

    this.estudianteService.listar().subscribe({
      next: (estudiantes) => {
        this.estudiantesMap.clear();
        estudiantes.forEach(e => this.estudiantesMap.set(e.id_estudiante, e));

        this.matriculaService.listar().subscribe({
          next: (matriculas) => {
            this.matriculasMap.clear();
            matriculas.forEach(m => this.matriculasMap.set(m.id_matricula, m));

            this.cargarComprobantes();
          },
          error: (err) => {
            this.errorMessage = err.message || 'Error al cargar catálogo de matrículas';
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar catálogo de estudiantes';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarComprobantes(): void {
    this.comprobanteService.listar().subscribe({
      next: (data) => {
        this.comprobantes = data;
        this.applyFilter();
        this.calcularTotales();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar comprobantes de pago';
        this.loading = false;
        this.cdr.markForCheck();
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
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredComprobantes = this.comprobantes.filter(c => {
        const estNombre = this.getEstudianteNombre(c.id_matricula).toLowerCase();
        return (
          c.id_comprobante.toString().includes(term) ||
          c.fecha.includes(term) ||
          c.total.toString().includes(term) ||
          estNombre.includes(term)
        );
      });
    }
    this.cdr.markForCheck();
  }

  getEstudianteNombre(idMatricula: number): string {
    const mat = this.matriculasMap.get(idMatricula);
    if (!mat) return `Matrícula #${idMatricula}`;
    const est = this.estudiantesMap.get(mat.id_estudiante);
    return est ? est.nombre : `Estudiante #${mat.id_estudiante}`;
  }

  getEstudianteCedula(idMatricula: number): string {
    const mat = this.matriculasMap.get(idMatricula);
    if (!mat) return '-';
    const est = this.estudiantesMap.get(mat.id_estudiante);
    return est ? est.cedula : '-';
  }

  verComprobante(comp: Comprobante): void {
    this.comprobanteSeleccionado = comp;
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.comprobanteSeleccionado = null;
  }
}
