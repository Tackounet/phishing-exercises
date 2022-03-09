import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Exercise } from '../exercise.model';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-load-exercise',
  templateUrl: './load-exercise.component.html',
  styleUrls: ['./load-exercise.component.css']
})
export class LoadExerciseComponent implements OnInit {
  exercise: Exercise = {
    id: '',
    template: 0,
    title: '',
    description: '',
    digram: '',
    object: '',
    senderDisplayName: '',
    senderEmail: '',
    time: '',
    toDisplayName: '',
    toEmail: '',
    body: '',
    legitimate: true,
    rightAnswer: {
      text: '',
      items: []
    },
    wrongAnswer: {
      text: '',
      items: []
    }
  };
  display = false;

  constructor(private libraryService: LibraryService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('exerciseId')) {
        const id = param.get('exerciseId') || '';
        this.libraryService.getExercise(id).subscribe(response => {
          const exercise = response.exercise;
          exercise.body = exercise.body + '<span id="loaded"></span>';
          this.exercise = exercise;
          this.display = true;
        });
      }
    });
  }

}
