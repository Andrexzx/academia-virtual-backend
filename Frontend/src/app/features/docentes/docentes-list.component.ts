import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DocenteService } from '../../core/services/docente.service';
import { Docente, DocenteCreate, DocenteUpdate } from '../../core/models/docente.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-docentes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './docentes-list.component.html',
  styleUrls: ['./docentes-list.component.css']
})
export class DocentesListComponent implements OnInit {
  private docenteService = inject(DocenteService);
  private fb = inject(FormBuilder);

  docentes: Docente[] = [];
  filteredDocentes: Docente[] = [];
  searchTerm = '';
  loading = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  isFormOpen = false;
  isEditing = false;
  selectedId: number | null = null;
  docenteForm!: FormGroup;

  isDeleteModalOpen = false;
  docenteToDelete: Docente | null = null;

  ngOnInit(): void {
    this.initForm();
    this.cargarDocentes();
  }

  private initForm(): void {
    this.docenteForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      especialidad: ['', [Validators.required, Validators.minLength(3)]],
      experiencia: [0, [Validators.required, Validators.min(0)]]
    });
  }

  cargarDocentes(): void {
    this.loading = true;
    this.errorMessage = null;
    this.docenteService.listar().subscribe({
      next: (data) => {
        this.docentes = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar docentes';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDocentes = [...this.docentes];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredDocentes = this.docentes.filter(d =>
      d.titulo.toLowerCase().includes(term) ||
      d.especialidad.toLowerCase().includes(term) ||
      d.experiencia.toString().includes(term)
    );
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedId = null;
    this.docenteForm.reset({ experiencia: 0 });
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  openEditModal(docente: Docente): void {
    this.isEditing = true;
    this.selectedId = docente.id_docente;
    this.docenteForm.patchValue({
      titulo: docente.titulo,
      especialidad: docente.especialidad,
      experiencia: docente.experiencia
    });
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.docenteForm.reset({ experiencia: 0 });
  }

  guardarDocente(): void {
    if (this.docenteForm.invalid) {
      this.docenteForm.markAllAsTouched();
      return;
    }

    const payload = this.docenteForm.value;
    this.loading = true;
    this.errorMessage = null;

    if (this.isEditing && this.selectedId !== null) {
      this.docenteService.actualizar(this.selectedId, payload as DocenteUpdate).subscribe({
        next: () => {
          this.showSuccess('Docente actualizado exitosamente');
          this.closeFormModal();
          this.cargarDocentes();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al actualizar docente';
          this.loading = false;
        }
      });
    } else {
      this.docenteService.crear(payload as DocenteCreate).subscribe({
        next: () => {
          this.showSuccess('Docente registrado exitosamente');
          this.closeFormModal();
          this.cargarDocentes();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al registrar docente';
          this.loading = false;
        }
      });
    }
  }

  confirmarEliminar(docente: Docente): void {
    this.docenteToDelete = docente;
    this.isDeleteModalOpen = true;
  }

  cancelarEliminar(): void {
    this.isDeleteModalOpen = false;
    this.docenteToDelete = null;
  }

  ejecutarEliminar(): void {
    if (!this.docenteToDelete) return;
    const id = this.docenteToDelete.id_docente;
    this.isDeleteModalOpen = false;
    this.loading = true;

    this.docenteService.eliminar(id).subscribe({
      next: () => {
        this.showSuccess('Docente eliminado exitosamente');
        this.cargarDocentes();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al eliminar docente';
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
