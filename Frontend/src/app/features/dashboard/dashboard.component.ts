import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EstudianteService } from '../../core/services/estudiante.service';
import { DocenteService } from '../../core/services/docente.service';
import { AsignaturaService } from '../../core/services/asignatura.service';
import { GrupoService } from '../../core/services/grupo.service';
import { MatriculaService } from '../../core/services/matricula.service';
import { CalificacionService } from '../../core/services/calificacion.service';
import { Matricula, EstadoMatricula } from '../../core/models/matricula.model';

interface EstadoStat {
  estado: EstadoMatricula;
  count: number;
  porcentaje: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private estudianteService = inject(EstudianteService);
  private docenteService = inject(DocenteService);
  private asignaturaService = inject(AsignaturaService);
  private grupoService = inject(GrupoService);
  private matriculaService = inject(MatriculaService);
  private calificacionService = inject(CalificacionService);

  totalEstudiantes = 0;
  totalDocentes = 0;
  totalAsignaturas = 0;
  totalGrupos = 0;
  totalMatriculas = 0;
  totalCalificaciones = 0;

  promedioGeneral = 0;
  tasaAprobacion = 0;
  totalAprobados = 0;
  totalReprobados = 0;

  statsMatriculas: EstadoStat[] = [];
  loading = true;

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.loading = true;

    this.estudianteService.listar().subscribe({
      next: (est) => {
        this.totalEstudiantes = est.length;

        this.docenteService.listar().subscribe({
          next: (doc) => {
            this.totalDocentes = doc.length;

            this.asignaturaService.listar().subscribe({
              next: (asig) => {
                this.totalAsignaturas = asig.length;

                this.grupoService.listar().subscribe({
                  next: (grup) => {
                    this.totalGrupos = grup.length;

                    this.matriculaService.listar().subscribe({
                      next: (mat) => {
                        this.totalMatriculas = mat.length;
                        this.procesarStatsMatriculas(mat);

                        this.calificacionService.listar().subscribe({
                          next: (cal) => {
                            this.totalCalificaciones = cal.length;
                            this.procesarStatsCalificaciones(cal);
                            this.loading = false;
                          },
                          error: () => this.loading = false
                        });
                      },
                      error: () => this.loading = false
                    });
                  },
                  error: () => this.loading = false
                });
              },
              error: () => this.loading = false
            });
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  private procesarStatsMatriculas(matriculas: Matricula[]): void {
    const estados: EstadoMatricula[] = [
      'Preinscrito',
      'Pendiente pago',
      'Matriculado',
      'Activo',
      'Finalizado',
      'Cancelado',
      'Anulado'
    ];

    const counts = new Map<EstadoMatricula, number>();
    estados.forEach(e => counts.set(e, 0));

    matriculas.forEach(m => {
      counts.set(m.estado, (counts.get(m.estado) || 0) + 1);
    });

    const total = matriculas.length || 1;
    this.statsMatriculas = estados.map(e => ({
      estado: e,
      count: counts.get(e) || 0,
      porcentaje: Number((((counts.get(e) || 0) / total) * 100).toFixed(1))
    }));
  }

  private procesarStatsCalificaciones(calificaciones: any[]): void {
    if (calificaciones.length === 0) {
      this.promedioGeneral = 0;
      this.tasaAprobacion = 0;
      this.totalAprobados = 0;
      this.totalReprobados = 0;
      return;
    }

    let sumaPromedios = 0;
    let aprobados = 0;

    calificaciones.forEach(c => {
      const prom = c.promedio || 0;
      sumaPromedios += prom;
      if (prom >= 7.0) {
        aprobados++;
      }
    });

    this.promedioGeneral = Number((sumaPromedios / calificaciones.length).toFixed(2));
    this.totalAprobados = aprobados;
    this.totalReprobados = calificaciones.length - aprobados;
    this.tasaAprobacion = Number(((aprobados / calificaciones.length) * 100).toFixed(1));
  }
}
