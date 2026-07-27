import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatriculaService } from '../../core/services/matricula.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { GrupoService } from '../../core/services/grupo.service';
import { AsignaturaService } from '../../core/services/asignatura.service';
import { ComprobanteService } from '../../core/services/comprobante.service';
import { Matricula, EstadoMatricula, MatriculaCreate } from '../../core/models/matricula.model';
import { Estudiante } from '../../core/models/estudiante.model';
import { Grupo } from '../../core/models/grupo.model';
import { Asignatura } from '../../core/models/asignatura.model';
import { Comprobante } from '../../core/models/comprobante.model';

@Component({
  selector: 'app-matricula-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './matricula-wizard.component.html',
  styleUrls: ['./matricula-wizard.component.css']
})
export class MatriculaWizardComponent implements OnInit {
  private matriculaService = inject(MatriculaService);
  private estudianteService = inject(EstudianteService);
  private grupoService = inject(GrupoService);
  private asignaturaService = inject(AsignaturaService);
  private comprobanteService = inject(ComprobanteService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  matriculas: Matricula[] = [];
  filteredMatriculas: Matricula[] = [];
  estudiantesMap = new Map<number, Estudiante>();
  gruposMap = new Map<number, Grupo>();
  asignaturasMap = new Map<string, Asignatura>();

  estudiantesList: Estudiante[] = [];
  gruposList: Grupo[] = [];

  searchTerm = '';
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  selectedMatricula: Matricula | null = null;

  isNewModalOpen = false;
  preinscripcionForm!: FormGroup;

  isPagoModalOpen = false;
  pagoForm!: FormGroup;
  matriculaParaPago: Matricula | null = null;

  isComprobanteModalOpen = false;
  comprobanteActual: Comprobante | null = null;

  readonly pasosEstados: EstadoMatricula[] = [
    'Preinscrito',
    'Pendiente pago',
    'Matriculado',
    'Activo',
    'Finalizado'
  ];

  ngOnInit(): void {
    this.initForms();

    const cachedMatriculas = this.matriculaService.getCached();
    const cachedEstudiantes = this.estudianteService.getCached();
    const cachedGrupos = this.grupoService.getCached();

    if (cachedMatriculas.length > 0) {
      this.matriculas = cachedMatriculas;
      this.selectedMatricula = this.matriculas[0];
      if (cachedEstudiantes.length > 0) {
        this.estudiantesList = cachedEstudiantes;
        cachedEstudiantes.forEach(e => this.estudiantesMap.set(e.id_estudiante, e));
      }
      if (cachedGrupos.length > 0) {
        this.gruposList = cachedGrupos;
        cachedGrupos.forEach(g => this.gruposMap.set(g.id_grupo, g));
      }
      this.applyFilter();
    } else {
      this.loading = true;
    }
    this.cargarDatosCatalogos();
  }

  private initForms(): void {
    const todayStr = new Date().toISOString().split('T')[0];

    this.preinscripcionForm = this.fb.group({
      fecha: [todayStr, Validators.required],
      id_estudiante: ['', Validators.required],
      id_grupo: ['', Validators.required]
    });

    this.pagoForm = this.fb.group({
      subtotal: [150, [Validators.required, Validators.min(1)]]
    });
  }

  cargarDatosCatalogos(): void {
    this.errorMessage = null;

    this.estudianteService.listar().subscribe({
      next: (estudiantes) => {
        this.estudiantesList = estudiantes;
        this.estudiantesMap.clear();
        estudiantes.forEach(e => this.estudiantesMap.set(e.id_estudiante, e));

        this.grupoService.listar().subscribe({
          next: (grupos) => {
            this.gruposList = grupos;
            this.gruposMap.clear();
            grupos.forEach(g => this.gruposMap.set(g.id_grupo, g));

            this.asignaturaService.listar().subscribe({
              next: (asignaturas) => {
                this.asignaturasMap.clear();
                asignaturas.forEach(a => this.asignaturasMap.set(a.codigo, a));

                this.cargarMatriculas();
              },
              error: err => this.handleErr('Error al cargar asignaturas', err)
            });
          },
          error: err => this.handleErr('Error al cargar grupos', err)
        });
      },
      error: err => this.handleErr('Error al cargar estudiantes', err)
    });
  }

  cargarMatriculas(): void {
    this.matriculaService.listar().subscribe({
      next: (data) => {
        this.matriculas = data;
        if (this.matriculas.length > 0 && !this.selectedMatricula) {
          this.selectedMatricula = this.matriculas[0];
        }
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => this.handleErr('Error al cargar matriculas', err)
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMatriculas = [...this.matriculas];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredMatriculas = this.matriculas.filter(m => {
        const est = this.estudiantesMap.get(m.id_estudiante);
        const estNombre = est ? est.nombre.toLowerCase() : '';
        const estCedula = est ? est.cedula : '';
        return (
          m.id_matricula.toString().includes(term) ||
          m.estado.toLowerCase().includes(term) ||
          estNombre.includes(term) ||
          estCedula.includes(term)
        );
      });
    }
    this.cdr.markForCheck();
  }

  selectMatricula(m: Matricula): void {
    this.selectedMatricula = m;
    this.cdr.markForCheck();
  }

  getEstudianteNombre(id: number): string {
    const est = this.estudiantesMap.get(id);
    return est ? `${est.nombre} (${est.cedula})` : `Estudiante #${id}`;
  }

  getGrupoInfo(id: number): string {
    const g = this.gruposMap.get(id);
    if (!g) return `Grupo #${id}`;
    const asig = this.asignaturasMap.get(g.cod_asignatura);
    const asigNombre = asig ? asig.nombre : g.cod_asignatura;
    return `Grupo #${g.id_grupo} - ${asigNombre} (${g.modalidad})`;
  }

  getPasoIndex(estado: EstadoMatricula): number {
    return this.pasosEstados.indexOf(estado);
  }

  openNewModal(): void {
    const todayStr = new Date().toISOString().split('T')[0];
    this.preinscripcionForm.reset({
      fecha: todayStr,
      id_estudiante: this.estudiantesList.length > 0 ? this.estudiantesList[0].id_estudiante : '',
      id_grupo: this.gruposList.length > 0 ? this.gruposList[0].id_grupo : ''
    });
    this.isNewModalOpen = true;
    this.errorMessage = null;
  }

  closeNewModal(): void {
    this.isNewModalOpen = false;
  }

  crearPreinscripcion(): void {
    if (this.preinscripcionForm.invalid) {
      this.preinscripcionForm.markAllAsTouched();
      return;
    }

    const val = this.preinscripcionForm.value;
    const payload: MatriculaCreate = {
      fecha: val.fecha,
      id_estudiante: Number(val.id_estudiante),
      id_grupo: Number(val.id_grupo)
    };

    this.loading = true;
    this.matriculaService.crear(payload).subscribe({
      next: (res) => {
        this.showSuccess('Solicitud de preinscripción registrada exitosamente');
        this.closeNewModal();
        if (res.length > 0) {
          this.selectedMatricula = res[0];
        }
        this.cargarMatriculas();
      },
      error: err => this.handleErr('Error al solicitar matrícula', err)
    });
  }

  validarRequisitos(m: Matricula, aprobado: boolean): void {
    this.loading = true;
    this.errorMessage = null;
    this.matriculaService.validarRequisitos(m.id_matricula, aprobado).subscribe({
      next: (res) => {
        const msg = aprobado ? 'Requisitos validados y aprobados. Pasa a Pendiente Pago.' : 'Requisitos rechazados. Matrícula Cancelada.';
        this.showSuccess(msg);
        if (res.length > 0) {
          this.selectedMatricula = res[0];
        }
        this.cargarMatriculas();
      },
      error: err => this.handleErr('Error en validación académica', err)
    });
  }

  openPagoModal(m: Matricula): void {
    this.matriculaParaPago = m;
    this.pagoForm.reset({ subtotal: 150 });
    this.isPagoModalOpen = true;
    this.errorMessage = null;
  }

  closePagoModal(): void {
    this.isPagoModalOpen = false;
    this.matriculaParaPago = null;
  }

  confirmarPago(pagoRealizado: boolean): void {
    if (!this.matriculaParaPago) return;
    const m = this.matriculaParaPago;

    if (!pagoRealizado) {
      this.loading = true;
      this.matriculaService.confirmarPago(m.id_matricula, false).subscribe({
        next: (res) => {
          this.showSuccess('Pago no realizado. Matrícula Anulada.');
          this.closePagoModal();
          if (res.length > 0) this.selectedMatricula = res[0];
          this.cargarMatriculas();
        },
        error: err => this.handleErr('Error al anular pago', err)
      });
      return;
    }

    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const subtotal = Number(this.pagoForm.value.subtotal);
    const todayStr = new Date().toISOString().split('T')[0];

    this.loading = true;
    this.matriculaService.confirmarPago(m.id_matricula, true).subscribe({
      next: (resMat) => {
        this.comprobanteService.crear({
          fecha: todayStr,
          subtotal: subtotal,
          id_matricula: m.id_matricula
        }).subscribe({
          next: (resComp) => {
            this.showSuccess('Pago confirmado y comprobante emitido exitosamente');
            this.closePagoModal();
            if (resMat.length > 0) this.selectedMatricula = resMat[0];
            if (resComp.length > 0) {
              this.comprobanteActual = resComp[0];
              this.isComprobanteModalOpen = true;
            }
            this.cargarMatriculas();
          },
          error: err => this.handleErr('Error al emitir comprobante de pago', err)
        });
      },
      error: err => this.handleErr('Error al confirmar pago de matrícula', err)
    });
  }

  activarMatricula(m: Matricula): void {
    this.loading = true;
    this.errorMessage = null;
    this.matriculaService.activar(m.id_matricula).subscribe({
      next: (res) => {
        this.showSuccess('Matrícula activada para el período lectivo.');
        if (res.length > 0) this.selectedMatricula = res[0];
        this.cargarMatriculas();
      },
      error: err => this.handleErr('Error al activar matrícula', err)
    });
  }

  finalizarMatricula(m: Matricula): void {
    this.loading = true;
    this.errorMessage = null;
    this.matriculaService.finalizar(m.id_matricula).subscribe({
      next: (res) => {
        this.showSuccess('Matrícula finalizada (cierre del período).');
        if (res.length > 0) this.selectedMatricula = res[0];
        this.cargarMatriculas();
      },
      error: err => this.handleErr('Error al finalizar matrícula', err)
    });
  }

  closeComprobanteModal(): void {
    this.isComprobanteModalOpen = false;
    this.comprobanteActual = null;
  }

  private handleErr(context: string, err: any): void {
    this.errorMessage = `${context}: ${err.message || 'Error en el servidor'}`;
    this.loading = false;
    this.cdr.markForCheck();
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
