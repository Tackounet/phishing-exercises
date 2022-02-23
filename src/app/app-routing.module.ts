import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: 'admin/exercise', component: CreateExerciseComponent },
  { path: 'exercise', component: ExerciseComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
