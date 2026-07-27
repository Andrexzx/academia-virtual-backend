import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AsignaturaService } from '../../core/services/asignatura.service';
import { Asignatura, AsignaturaCreate, AsignaturaUpdate } from '../../core/models/asignatura.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-asignaturas-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './asignaturas-list.component.html',
  styleUrls: ['./asignaturas-list.component.css']
})
export class AsignaturasListComponent implements OnInit {
  private asignaturaService = inject(AsignaturaService);
  private fb = inject(FormBuilder);

  asignaturas: Asignatura[] = [];
  filteredAsignaturas: Asignatura[] = [];
  searchTerm = '';
  loading = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  isFormOpen = false;
  isEditing = false;
  selectedCodigo: string | null = null;
  asignaturaForm!: FormGroup;

  isDeleteModalOpen = false;
  asignaturaToDelete: Asignatura | null = null;

  ngOnInit(): void {
    this.initForm();
    this.cargarAsignaturas();
  }

  private initForm(): void {
    this.asignaturaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9_-]{3,10}$')]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      creditos: [4, [Validators.required, Validators.min(1)]],
      nivel: ['', Validators.required]
    });
  }

  cargarAsignaturas(): void {
    this.loading = true;
    this.errorMessage = null;
    this.asignaturaService.listar().subscribe({
      next: (data) => {
        this.asignaturas = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar asignaturas';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAsignaturas = [...this.asignaturas];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredAsignaturas = this.asignaturas.filter(a =>
      a.codigo.toLowerCase().includes(term) ||
      a.nombre.toLowerCase().includes(term) ||
      a.nivel.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedCodigo = null;
    this.asignaturaForm.reset({ creditos: 4, nivel: 'Primer semestre' });
    this.asignaturaForm.get('codigo')?.enable();
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  openEditModal(asignatura: Asignatura): void {
    this.isEditing = true;
    this.selectedCodigo = asignatura.codigo;
    this.asignaturaForm.patchValue({
      codigo: asignatura.codigo,
      nombre: asignatura.nombre,
      creditos: asignatura.creditos,
      nivel: asignatura.nivel
    });
    this.asignaturaForm.get('codigo')?.disable();
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.asignaturaForm.reset({ creditos: 4, nivel: 'Primer semestre' });
  }

  guardarAsignatura(): void {
    if (this.asignaturaForm.invalid) {
      this.asignaturaForm.markAllAsTouched();
      return;
    }

    const rawValue = this.asignaturaForm.getRawValue();
    this.loading = true;
    this.errorMessage = null;

    if (this.isEditing && this.selectedCodigo) {
      const updatePayload: AsignaturaUpdate = {
        nombre: rawValue.nombre,
        creditos: Number(rawValue.creditos),
        nivel: rawValue.nivel
      };
      this.asignaturaService.actualizar(this.selectedCodigo, updatePayload).subscribe({
        next: () => {
          this.showSuccess('Asignatura actualizada exitosamente');
          this.closeFormModal();
          this.cargarAsignaturas();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al actualizar asignatura';
          this.loading = false;
        }
      });
    } else {
      const createPayload: AsignaturaCreate = {
        codigo: rawValue.codigo,
        nombre: rawValue.nombre,
        creditos: Number(rawValue.creditos),
        nivel: rawValue.nivel
      };
      this.asignaturaService.crear(createPayload).subscribe({
        next: () => {
          this.showSuccess('Asignatura registrada exitosamente');
          this.closeFormModal();
          this.cargarAsignaturas();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al registrar asignatura';
          this.loading = false;
        }
      });
    }
  }

  confirmarEliminar(asignatura: Asignatura): void {
    this.asignaturaToDelete = asignatura;
    this.isDeleteModalOpen = true;
  }

  cancelarEliminar(): void {
    this.isDeleteModalOpen = false;
    this.asignaturaToDelete = null;
  }

  ejecutarEliminar(): void {
    if (!this.asignaturaToDelete) return;
    const codigo = this.asignaturaToDelete.codigo;
    this.isDeleteModalOpen = false;
    this.loading = true;

    this.asignaturaService.eliminar(codigo).subscribe({
      next: () => {
        this.showSuccess('Asignatura eliminada exitosamente');
        this.cargarAsignaturas();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al eliminar asignatura';
        this.loading = false;
      }
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }
}
