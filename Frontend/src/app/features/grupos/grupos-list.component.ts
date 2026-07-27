import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { GrupoService } from '../../core/services/grupo.service';
import { DocenteService } from '../../core/services/docente.service';
import { AsignaturaService } from '../../core/services/asignatura.service';
import { Grupo, GrupoCreate, GrupoUpdate } from '../../core/models/grupo.model';
import { Docente } from '../../core/models/docente.model';
import { Asignatura } from '../../core/models/asignatura.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-grupos-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './grupos-list.component.html',
  styleUrls: ['./grupos-list.component.css']
})
export class GruposListComponent implements OnInit {
  private grupoService = inject(GrupoService);
  private docenteService = inject(DocenteService);
  private asignaturaService = inject(AsignaturaService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  grupos: Grupo[] = [];
  filteredGrupos: Grupo[] = [];
  docentesMap = new Map<number, Docente>();
  asignaturasMap = new Map<string, Asignatura>();
  docentesList: Docente[] = [];
  asignaturasList: Asignatura[] = [];

  searchTerm = '';
  loading = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  isFormOpen = false;
  isEditing = false;
  selectedId: number | null = null;
  grupoForm!: FormGroup;

  isDeleteModalOpen = false;
  grupoToDelete: Grupo | null = null;

  ngOnInit(): void {
    this.initForm();
    const cachedGrupos = this.grupoService.getCached();
    const cachedDocentes = this.docenteService.getCached();
    const cachedAsignaturas = this.asignaturaService.getCached();

    if (cachedGrupos.length > 0) {
      this.grupos = cachedGrupos;
      if (cachedDocentes.length > 0) {
        this.docentesList = cachedDocentes;
        cachedDocentes.forEach(d => this.docentesMap.set(d.id_docente, d));
      }
      if (cachedAsignaturas.length > 0) {
        this.asignaturasList = cachedAsignaturas;
        cachedAsignaturas.forEach(a => this.asignaturasMap.set(a.codigo, a));
      }
      this.applyFilter();
    } else {
      this.loading = true;
    }
    this.cargarDatosGenerales();
  }

  private initForm(): void {
    this.grupoForm = this.fb.group({
      modalidad: ['Presencial', Validators.required],
      horario: ['', [Validators.required, Validators.minLength(3)]],
      cupo_maximo: [30, [Validators.required, Validators.min(1)]],
      id_docente: ['', Validators.required],
      cod_asignatura: ['', Validators.required]
    });
  }

  cargarDatosGenerales(): void {
    this.errorMessage = null;
    this.docenteService.listar().subscribe({
      next: (docentes) => {
        this.docentesList = docentes;
        this.docentesMap.clear();
        docentes.forEach(d => this.docentesMap.set(d.id_docente, d));

        this.asignaturaService.listar().subscribe({
          next: (asignaturas) => {
            this.asignaturasList = asignaturas;
            this.asignaturasMap.clear();
            asignaturas.forEach(a => this.asignaturasMap.set(a.codigo, a));

            this.cargarGrupos();
          },
          error: (err) => {
            this.errorMessage = err.message || 'Error al cargar catálogo de asignaturas';
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar catálogo de docentes';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  cargarGrupos(): void {
    this.grupoService.listar().subscribe({
      next: (data) => {
        this.grupos = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar oferta de grupos';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredGrupos = [...this.grupos];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredGrupos = this.grupos.filter(g => {
        const docente = this.docentesMap.get(g.id_docente);
        const asignatura = this.asignaturasMap.get(g.cod_asignatura);
        const docenteStr = docente ? `${docente.titulo} ${docente.especialidad}`.toLowerCase() : '';
        const asigStr = asignatura ? `${asignatura.codigo} ${asignatura.nombre}`.toLowerCase() : '';

        return (
          g.modalidad.toLowerCase().includes(term) ||
          g.horario.toLowerCase().includes(term) ||
          docenteStr.includes(term) ||
          asigStr.includes(term)
        );
      });
    }
    this.cdr.markForCheck();
  }

  getDocenteNombre(id: number): string {
    const doc = this.docentesMap.get(id);
    return doc ? `${doc.titulo} - ${doc.especialidad}` : `Docente #${id}`;
  }

  getAsignaturaNombre(codigo: string): string {
    const asig = this.asignaturasMap.get(codigo);
    return asig ? `${asig.codigo} - ${asig.nombre}` : codigo;
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedId = null;
    this.grupoForm.reset({
      modalidad: 'Presencial',
      cupo_maximo: 30,
      id_docente: this.docentesList.length > 0 ? this.docentesList[0].id_docente : '',
      cod_asignatura: this.asignaturasList.length > 0 ? this.asignaturasList[0].codigo : ''
    });
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  openEditModal(grupo: Grupo): void {
    this.isEditing = true;
    this.selectedId = grupo.id_grupo;
    this.grupoForm.patchValue({
      modalidad: grupo.modalidad,
      horario: grupo.horario,
      cupo_maximo: grupo.cupo_maximo,
      id_docente: grupo.id_docente,
      cod_asignatura: grupo.cod_asignatura
    });
    this.isFormOpen = true;
    this.errorMessage = null;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.grupoForm.reset({ modalidad: 'Presencial', cupo_maximo: 30 });
  }

  guardarGrupo(): void {
    if (this.grupoForm.invalid) {
      this.grupoForm.markAllAsTouched();
      return;
    }

    const val = this.grupoForm.value;
    const payload = {
      modalidad: val.modalidad,
      horario: val.horario,
      cupo_maximo: Number(val.cupo_maximo),
      id_docente: Number(val.id_docente),
      cod_asignatura: val.cod_asignatura
    };

    this.loading = true;
    this.errorMessage = null;

    if (this.isEditing && this.selectedId !== null) {
      this.grupoService.actualizar(this.selectedId, payload as GrupoUpdate).subscribe({
        next: () => {
          this.showSuccess('Grupo actualizado exitosamente');
          this.closeFormModal();
          this.cargarGrupos();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al actualizar grupo';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.grupoService.crear(payload as GrupoCreate).subscribe({
        next: () => {
          this.showSuccess('Grupo aperturado exitosamente');
          this.closeFormModal();
          this.cargarGrupos();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al aperturar grupo';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  confirmarEliminar(grupo: Grupo): void {
    this.grupoToDelete = grupo;
    this.isDeleteModalOpen = true;
  }

  cancelarEliminar(): void {
    this.isDeleteModalOpen = false;
    this.grupoToDelete = null;
  }

  ejecutarEliminar(): void {
    if (!this.grupoToDelete) return;
    const id = this.grupoToDelete.id_grupo;
    this.isDeleteModalOpen = false;
    this.loading = true;

    this.grupoService.eliminar(id).subscribe({
      next: () => {
        this.showSuccess('Grupo eliminado exitosamente');
        this.cargarGrupos();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al eliminar grupo';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.markForCheck();
    }, 4000);
  }
}
