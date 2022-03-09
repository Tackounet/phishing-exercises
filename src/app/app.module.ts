import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoSanitizePipe } from './no-sanitize.pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { AuthComponent } from './auth/auth.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { ListExerciseComponent } from './list-exercise/list-exercise.component';
import { CreateSessionComponent } from './session/create-session/create-session.component';
import { ResultsComponent } from './results/results.component';
import { LoadExerciseComponent } from './load-exercise/load-exercise.component';

@NgModule({
  declarations: [
    AppComponent,
    ExerciseComponent,
    ExercisesComponent,
    ListExerciseComponent,
    CreateExerciseComponent,
    AuthComponent,
    SignupComponent,
    NoSanitizePipe,
    CreateSessionComponent,
    ResultsComponent,
    LoadExerciseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
