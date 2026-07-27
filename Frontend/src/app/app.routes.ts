import { Routes } from '@angular/router';
import { EstudiantesListComponent } from './features/estudiantes/estudiantes-list.component';
import { DocentesListComponent } from './features/docentes/docentes-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'estudiantes', pathMatch: 'full' },
  { path: 'estudiantes', component: EstudiantesListComponent },
  { path: 'docentes', component: DocentesListComponent },
  { path: '**', redirectTo: 'estudiantes' }
];
