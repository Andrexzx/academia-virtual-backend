import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { EstudianteService } from '../../core/services/estudiante.service';
import { Estudiante, EstudianteCreate, EstudianteUpdate } from '../../core/models/estudiante.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-estudiantes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './estudiantes-list.component.html',
  styleUrls: ['./estudiantes-list.component.css']
})
export class EstudiantesListComponent implements OnInit {
  private estudianteService = inject(EstudianteService);
  private fb = inject(FormBuilder);

  estudiantes: Estudiante[] = [];
  filteredEstudiantes: Estudiante[] = [];
  searchTerm = '';
  loading = false;
  
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isFormOpen = false;
  isEditing = false;
  selectedId: number | null = null;
  estudianteForm!: FormGroup;

  isDeleteModalOpen = false;
  estudianteToDelete: Estudiante | null = null;

  ngOnInit(): void {
    this.initForm();
    this.cargarEstudiantes();
  }

  private initForm(): void {
    this.estudianteForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]]
    });
  }

  cargarEstudiantes(): void {
    this.loading = true;
    this.errorMessage = null;
    this.estudianteService.listar().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar estudiantes';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEstudiantes = [...this.estudiantes];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredEstudiantes = this.estudiantes.filter(e =>
      e.nombre.toLowerCase().includes(term) ||
      e.cedula.includes(term) ||
      e.direccion.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedId = null;
    this.estudianteForm.reset();
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  openEditModal(estudiante: Estudiante): void {
    this.isEditing = true;
    this.selectedId = estudiante.id_estudiante;
    this.estudianteForm.patchValue({
      cedula: estudiante.cedula,
      nombre: estudiante.nombre,
      direccion: estudiante.direccion,
      telefono: estudiante.telefono
    });
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.estudianteForm.reset();
  }

  guardarEstudiante(): void {
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched();
      return;
    }

    const payload = this.estudianteForm.value;
    this.loading = true;
    this.errorMessage = null;

    if (this.isEditing && this.selectedId !== null) {
      this.estudianteService.actualizar(this.selectedId, payload as EstudianteUpdate).subscribe({
        next: () => {
          this.showSuccess('Estudiante actualizado exitosamente');
          this.closeFormModal();
          this.cargarEstudiantes();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al actualizar estudiante';
          this.loading = false;
        }
      });
    } else {
      this.estudianteService.crear(payload as EstudianteCreate).subscribe({
        next: () => {
          this.showSuccess('Estudiante registrado exitosamente');
          this.closeFormModal();
          this.cargarEstudiantes();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al registrar estudiante';
          this.loading = false;
        }
      });
    }
  }

  confirmarEliminar(estudiante: Estudiante): void {
    this.estudianteToDelete = estudiante;
    this.isDeleteModalOpen = true;
  }

  cancelarEliminar(): void {
    this.isDeleteModalOpen = false;
    this.estudianteToDelete = null;
  }

  ejecutarEliminar(): void {
    if (!this.estudianteToDelete) return;
    const id = this.estudianteToDelete.id_estudiante;
    this.isDeleteModalOpen = false;
    this.loading = true;

    this.estudianteService.eliminar(id).subscribe({
      next: () => {
        this.showSuccess('Estudiante eliminado exitosamente');
        this.cargarEstudiantes();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al eliminar estudiante';
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
