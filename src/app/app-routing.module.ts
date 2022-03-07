import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { ListExerciseComponent } from './list-exercise/list-exercise.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from './auth/auth.component';
import { CreateSessionComponent } from './session/create-session/create-session.component';

const routes: Routes = [
  // { path: '', component: ExerciseComponent },
  { path: 'admin/exercise', component: CreateExerciseComponent },
  { path: 'admin/exercises', component: ListExerciseComponent },
  { path: 'admin/exercise/:exerciseId', component: CreateExerciseComponent },
  { path: 'sessions/new', component: CreateSessionComponent },
  { path: 'exercises', component: ExercisesComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
