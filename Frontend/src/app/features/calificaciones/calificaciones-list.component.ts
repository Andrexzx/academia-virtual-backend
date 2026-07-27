import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CalificacionService } from '../../core/services/calificacion.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { AsignaturaService } from '../../core/services/asignatura.service';
import { Calificacion, CalificacionCreate, CalificacionUpdate } from '../../core/models/calificacion.model';
import { Estudiante } from '../../core/models/estudiante.model';
import { Asignatura } from '../../core/models/asignatura.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-calificaciones-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './calificaciones-list.component.html',
  styleUrls: ['./calificaciones-list.component.css']
})
export class CalificacionesListComponent implements OnInit {
  private calificacionService = inject(CalificacionService);
  private estudianteService = inject(EstudianteService);
  private asignaturaService = inject(AsignaturaService);
  private fb = inject(FormBuilder);

  calificaciones: Calificacion[] = [];
  filteredCalificaciones: Calificacion[] = [];
  estudiantesMap = new Map<number, Estudiante>();
  asignaturasMap = new Map<string, Asignatura>();
  estudiantesList: Estudiante[] = [];
  asignaturasList: Asignatura[] = [];

  searchTerm = '';
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isFormOpen = false;
  isEditing = false;
  selectedId: number | null = null;
  calificacionForm!: FormGroup;

  isDeleteModalOpen = false;
  calificacionToDelete: Calificacion | null = null;

  ngOnInit(): void {
    this.initForm();
    this.cargarCatalogos();
  }

  private initForm(): void {
    this.calificacionForm = this.fb.group({
      id_estudiante: ['', Validators.required],
      cod_asignatura: ['', Validators.required],
      parcial1: [8.0, [Validators.required, Validators.min(0), Validators.max(10)]],
      parcial2: [8.0, [Validators.required, Validators.min(0), Validators.max(10)]],
      examen_final: [8.0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  cargarCatalogos(): void {
    this.loading = true;
    this.errorMessage = null;

    this.estudianteService.listar().subscribe({
      next: (estudiantes) => {
        this.estudiantesList = estudiantes;
        this.estudiantesMap.clear();
        estudiantes.forEach(e => this.estudiantesMap.set(e.id_estudiante, e));

        this.asignaturaService.listar().subscribe({
          next: (asignaturas) => {
            this.asignaturasList = asignaturas;
            this.asignaturasMap.clear();
            asignaturas.forEach(a => this.asignaturasMap.set(a.codigo, a));

            this.cargarCalificaciones();
          },
          error: err => this.handleErr('Error al cargar catálogo de asignaturas', err)
        });
      },
      error: err => this.handleErr('Error al cargar catálogo de estudiantes', err)
    });
  }

  cargarCalificaciones(): void {
    this.calificacionService.listar().subscribe({
      next: (data) => {
        this.calificaciones = data;
        this.applyFilter();
        this.loading = false;
      },
      error: err => this.handleErr('Error al cargar calificaciones', err)
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCalificaciones = [...this.calificaciones];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredCalificaciones = this.calificaciones.filter(c => {
      const est = this.estudiantesMap.get(c.id_estudiante);
      const asig = this.asignaturasMap.get(c.cod_asignatura);
      const estNombre = est ? est.nombre.toLowerCase() : '';
      const asigNombre = asig ? asig.nombre.toLowerCase() : '';

      return (
        c.id_calificacion.toString().includes(term) ||
        estNombre.includes(term) ||
        asigNombre.includes(term) ||
        (c.promedio && c.promedio.toString().includes(term))
      );
    });
  }

  getEstudianteNombre(id: number): string {
    const est = this.estudiantesMap.get(id);
    return est ? `${est.nombre}` : `Estudiante #${id}`;
  }

  getAsignaturaNombre(codigo: string): string {
    const asig = this.asignaturasMap.get(codigo);
    return asig ? `${asig.codigo} - ${asig.nombre}` : codigo;
  }

  calcularPromedioEnVivo(): number {
    const p1 = Number(this.calificacionForm.get('parcial1')?.value || 0);
    const p2 = Number(this.calificacionForm.get('parcial2')?.value || 0);
    const ef = Number(this.calificacionForm.get('examen_final')?.value || 0);
    return Number((p1 * 0.3 + p2 * 0.3 + ef * 0.4).toFixed(2));
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedId = null;
    this.calificacionForm.reset({
      parcial1: 8.0,
      parcial2: 8.0,
      examen_final: 8.0,
      id_estudiante: this.estudiantesList.length > 0 ? this.estudiantesList[0].id_estudiante : '',
      cod_asignatura: this.asignaturasList.length > 0 ? this.asignaturasList[0].codigo : ''
    });
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  openEditModal(c: Calificacion): void {
    this.isEditing = true;
    this.selectedId = c.id_calificacion;
    this.calificacionForm.patchValue({
      id_estudiante: c.id_estudiante,
      cod_asignatura: c.cod_asignatura,
      parcial1: c.parcial1,
      parcial2: c.parcial2,
      examen_final: c.examen_final
    });
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.calificacionForm.reset();
  }

  guardarCalificacion(): void {
    if (this.calificacionForm.invalid) {
      this.calificacionForm.markAllAsTouched();
      return;
    }

    const val = this.calificacionForm.value;
    const payload = {
      id_estudiante: Number(val.id_estudiante),
      cod_asignatura: val.cod_asignatura,
      parcial1: Number(val.parcial1),
      parcial2: Number(val.parcial2),
      examen_final: Number(val.examen_final)
    };

    this.loading = true;
    this.errorMessage = null;

    if (this.isEditing && this.selectedId !== null) {
      this.calificacionService.actualizar(this.selectedId, payload as CalificacionUpdate).subscribe({
        next: () => {
          this.showSuccess('Calificación actualizada exitosamente');
          this.closeFormModal();
          this.cargarCalificaciones();
        },
        error: err => this.handleErr('Error al actualizar calificación', err)
      });
    } else {
      this.calificacionService.crear(payload as CalificacionCreate).subscribe({
        next: () => {
          this.showSuccess('Calificación registrada exitosamente');
          this.closeFormModal();
          this.cargarCalificaciones();
        },
        error: err => this.handleErr('Error al registrar calificación', err)
      });
    }
  }

  confirmarEliminar(c: Calificacion): void {
    this.calificacionToDelete = c;
    this.isDeleteModalOpen = true;
  }

  cancelarEliminar(): void {
    this.isDeleteModalOpen = false;
    this.calificacionToDelete = null;
  }

  ejecutarEliminar(): void {
    if (!this.calificacionToDelete) return;
    const id = this.calificacionToDelete.id_calificacion;
    this.isDeleteModalOpen = false;
    this.loading = true;

    this.calificacionService.eliminar(id).subscribe({
      next: () => {
        this.showSuccess('Calificación eliminada exitosamente');
        this.cargarCalificaciones();
      },
      error: err => this.handleErr('Error al eliminar calificación', err)
    });
  }

  private handleErr(context: string, err: any): void {
    this.errorMessage = `${context}: ${err.message || 'Error en el servidor'}`;
    this.loading = false;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }
}
