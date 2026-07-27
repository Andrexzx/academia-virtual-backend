import { Routes } from '@angular/router';
import { EstudiantesListComponent } from './features/estudiantes/estudiantes-list.component';
import { DocentesListComponent } from './features/docentes/docentes-list.component';
import { AsignaturasListComponent } from './features/asignaturas/asignaturas-list.component';
import { GruposListComponent } from './features/grupos/grupos-list.component';
import { MatriculaWizardComponent } from './features/matriculas/matricula-wizard.component';
import { ComprobantesListComponent } from './features/comprobantes/comprobantes-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'estudiantes', pathMatch: 'full' },
  { path: 'estudiantes', component: EstudiantesListComponent },
  { path: 'docentes', component: DocentesListComponent },
  { path: 'asignaturas', component: AsignaturasListComponent },
  { path: 'grupos', component: GruposListComponent },
  { path: 'matriculas', component: MatriculaWizardComponent },
  { path: 'comprobantes', component: ComprobantesListComponent },
  { path: '**', redirectTo: 'estudiantes' }
];
