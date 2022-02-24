import { Injectable } from '@angular/core';
import { FunctionsService } from './functions.service';
import { HttpClient } from '@angular/common/http';
import { Exercise } from './exercise.model';
import { Subject, TimeoutConfig } from 'rxjs';

const URL_BACKEND = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private exercises: Exercise[] = [];
  private exercisesSubject = new Subject<Exercise[]>();

  constructor(private http: HttpClient, private functionsService: FunctionsService) { }

  isLegitimate() { }

  validate() {
  }

  onDeploy(d: any) {
    console.log("deploy");
    let e: HTMLElement | null | undefined = d;
    while ((e as HTMLElement).getAttribute('deployable') !== null && (e as HTMLElement).getAttribute('deployable') !== undefined && e?.id.split('-')[0] !== 'template') {
      e = e?.parentElement;
    }
    console.log(e);
    let classes = (e as HTMLElement).className.replaceAll(/ +/g, ' ').split(' ');
    const fold = document.querySelectorAll(".fold");
    const unfold = document.querySelectorAll(".unfold");
    if (classes.includes('deployed')) {
      classes = classes.filter(e => e !== 'deployed');
      (e as HTMLElement).className = classes.join(' ') + ' undeployed';
      fold.forEach(e => (e as HTMLElement).style.display = 'inline-block');
      unfold.forEach(e => (e as HTMLElement).style.display = 'none');
      console.log("fold");
    } else {
      classes = classes.filter(e => e !== 'undeployed');
      (e as HTMLElement).className = classes.join(' ') + ' deployed';
      fold.forEach(e => (e as HTMLElement).style.display = 'none');
      unfold.forEach(e => (e as HTMLElement).style.display = 'inline-block');
      console.log("unfold");
    }
    console.log("done");
  }

  getExercises() {
    this.http.get<{ message: string, exercises: Exercise[] }>(`${URL_BACKEND}/exercises`)
      .subscribe(response => {
        this.exercises = response.exercises;
        console.log(response);
        this.exercisesSubject.next([...this.exercises]);
      });
  }

  addExercise(exercise: Exercise) {
    this.http.post<{ message: string }>(`${URL_BACKEND}/exercise`, exercise)
      .subscribe(response => {
        console.log(response);
      });
  }

  updateExercise(exercise: Exercise) {
    const id = 0;
    this.http.patch<{ message: string }>(`${URL_BACKEND}/exercise/${id}`, exercise)
      .subscribe(response => {
        console.log(response);
      });
  }

  getExercisesListener() {
    return this.exercisesSubject.asObservable();
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
    const re = /<<([^(]+)\(([^>]+)\)>>/g;
    let ret = text;
    let match;
    do {
      match = re.exec(text);
      if (match) {
        // console.log("test: " + match[0]);
        ret = ret.replaceAll(match[0], this.dispatch(this.decodeHTML(match[1]), JSON.parse(this.decodeHTML(match[2]))));
        // this.dispatch(this.decodeHTML(match[1]), JSON.parse(this.decodeHTML(match[2])));
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
