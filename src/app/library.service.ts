import { Injectable } from '@angular/core';
import { FunctionsService } from './functions.service';
import { HttpClient } from '@angular/common/http';
import { Exercise } from './exercise.model';
import { map, Subject } from 'rxjs';
import { Result } from './result.model';
import { Score } from './score.model';
import { Trainee } from './trainee.model';

const URL_BACKEND = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private exercises: Exercise[] = [];
  private exercisesSubject = new Subject<Exercise[]>();

  constructor(private http: HttpClient, private functionsService: FunctionsService) { }

  getExercises() {
    this.http.get<{ message: string, exercises: any }>(`${URL_BACKEND}/exercises`)
      .pipe(map(exercisesResponse => {
        return exercisesResponse.exercises.map((exercise: any) => {
          return {
            id: exercise._id,
            template: exercise.template,
            title: exercise.title,
            description: exercise.description,
            digram: exercise.digram,
            object: exercise.object,
            senderDisplayName: exercise.senderDisplayName,
            senderEmail: exercise.senderEmail,
            time: exercise.time,
            toDisplayName: exercise.toDisplayName,
            toEmail: exercise.toEmail,
            body: exercise.body + '<div id="loaded"></div>',
            legitimate: exercise.legitimate,
            rightAnswer: exercise.rightAnswer,
            wrongAnswer: exercise.wrongAnswer
          };
        })
      }))
      .subscribe(exercises => {
        this.exercises = exercises;
        this.exercisesSubject.next([...this.exercises]);
      });
  }

  addExercise(exercise: Exercise) {
    return this.http.post<{ message: string, exercise: Exercise }>(`${URL_BACKEND}/exercises`, exercise);
  }

  getExercise(id: string) {
    return this.http.get<{ message: string, exercise: Exercise }>(`${URL_BACKEND}/exercises/${id}`);
  }

  updateExercise(id: string, exercise: Exercise) {
    return this.http.put<{ message: string, exercise: Exercise }>(`${URL_BACKEND}/exercises/${id}`, exercise);
  }

  sendExerciseScore(score: Result) {
    this.http.post<{ message: string, result: Result }>(`${URL_BACKEND}/trainees/result`, score)
      .subscribe(response => {
        console.log(response);
      });
  }

  sendStats(stats: Score) {
    this.http.post<{ message: string }>(`${URL_BACKEND}/trainees/stats`, stats)
      .subscribe(response => {
        console.log(response);
      });
  }

  getExercisesListener() {
    return this.exercisesSubject.asObservable();
  }

  registerTrainee(trainee: Trainee) {
    this.http.post<{ message: string }>(`${URL_BACKEND}/trainees/register`, trainee)
      .subscribe(response => {
        console.log(response);
      });
  }

  registerSession(id: string) {
    this.http.post<{ message: string }>(`${URL_BACKEND}/sessions`, {id: id})
      .subscribe(response => {
        console.log(response);
      });
  }

  getSession() {
    return this.http.get<{ message: string, sessionId: string }>(`${URL_BACKEND}/sessions`);
  }

  private decodeHTML(str: string | null): string {
    const element = document.createElement('div');
    if (str) {
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }
    element.remove();
    return str === null ? '' : str;
  }

  render(text: any) {
    console.log("render: " + text);
    const re = /<<([^(]+)\(([^>]+)\)>>/g;
    let ret = text;
    let match;
    do {
      match = re.exec(text);
      if (match) {
        console.log("test: " + match[0]);
        ret = ret.replaceAll(match[0], this.dispatch(this.decodeHTML(match[1]), JSON.parse(this.decodeHTML(match[2]))));
        this.dispatch(this.decodeHTML(match[1]), JSON.parse(this.decodeHTML(match[2])));
      }
    } while (match);
    return ret;
  }

  private dispatch(fn: string, args: any) {
    switch (fn) {
      case 'run':
        return this.functionsService.run(args);
      case 'display':
        return this.functionsService.display(args);
      case 'writeDate':
        return this.functionsService.writeDate(args);
      default:
        console.error(`${fn} : ${args}`);
    }
    return '';
  }
}
