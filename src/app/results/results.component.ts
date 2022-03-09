import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LibraryService } from '../library.service';
import { Result } from '../result.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Result[] = [];
  stats: { title: string, correct: number, score: number, id: string  }[] = [];
  total: number = 0;
  path: string = '';
  top5: { title: string; correct: number; score: number; name: string; }[] = [];
  allTrainees: { title: string; correct: number; score: number; name: string; }[] = [];
  @ViewChild('phishBtn') phishBtn!: ElementRef;
  @ViewChild('topBtn') topBtn!: ElementRef;
  @ViewChild('allBtn') allBtn!: ElementRef;

  constructor(private libraryService: LibraryService, private router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.libraryService.getSession().subscribe(s => {
      this.libraryService.getResults(s.sessionId).subscribe(r => {
        this.route.paramMap.subscribe((param: ParamMap) => {
          this.phishBtn.nativeElement.disabled = true;
          if (param.has('path')) {
            const path = param.get('path');
            if (path === 'top5') {
              this.path = 'top5';
              this.phishBtn.nativeElement.disabled = false;
              this.topBtn.nativeElement.disabled = true;
            } else if (path === 'participants') {
              this.phishBtn.nativeElement.disabled = false;
              this.allBtn.nativeElement.disabled = true;
              this.path = 'all';
            }
          }
        });
        this.results = r.results;
        this.total = this.results.length;
        const statsExercises: { [key: string]: { correct: number, score: number, id: string } } = {};
        const statsTrainees: { [key: string]: { correct: number, score: number, name: string } } = {};
        const participants = new Set();
        this.results.forEach(result => {
          participants.add(result.traineeId);
          if (result.traineeId in statsTrainees) {
            statsTrainees[result.traineeId].correct += (result.isCorrect) ? 1 : 0;
            statsTrainees[result.traineeId].score += result.score;
          } else {
            statsTrainees[result.traineeId] = {
              correct: (result.isCorrect) ? 1 : 0,
              score: result.score,
              name: result.traineeName
            };
          }
          if (result.isPhishing) {
            if (result.exerciseTitle in statsExercises) {
              statsExercises[result.exerciseTitle].correct += (result.isCorrect) ? 1 : 0;
              statsExercises[result.exerciseTitle].score += result.score;
            } else {
              statsExercises[result.exerciseTitle] = {
                correct: (result.isCorrect) ? 1 : 0,
                score: result.score,
                id: result.exerciseId
              };
            }
          }
        });

        const exercisesToSort = [];
        for (const key in statsExercises) {
          exercisesToSort.push({ title: key, correct: statsExercises[key].correct, score: statsExercises[key].score, id: statsExercises[key].id });
        }

        exercisesToSort.sort(function (a, b) {
          return (a.correct - b.correct || a.score - b.score);
        });

        this.stats = [...exercisesToSort];

        const traineesToSort = [];
        for (const key in statsTrainees) {
          traineesToSort.push({ title: key, correct: statsTrainees[key].correct, score: statsTrainees[key].score, name: statsTrainees[key].name });
        }

        traineesToSort.sort(function (a, b) {
          return (b.score - a.score || b.correct - a.correct);
        });

        this.allTrainees = [...traineesToSort];
        this.top5 = traineesToSort.slice(0, 5);
        this.total = participants.size;
      });
    });
  }

  navigate(id: string) {
    this.router.navigate(['/', 'exercise', id]);
  }

  onPhish() {
    this.path = '';
    this.phishBtn.nativeElement.disabled = true;
    this.topBtn.nativeElement.disabled = false;
    this.allBtn.nativeElement.disabled = false;
  }

  onTop5() {
    this.path = 'top5';
    this.phishBtn.nativeElement.disabled = false;
    this.topBtn.nativeElement.disabled = true;
    this.allBtn.nativeElement.disabled = false;
  }

  onAllScores() {
    this.path = 'all';
    this.phishBtn.nativeElement.disabled = false;
    this.topBtn.nativeElement.disabled = false;
    this.allBtn.nativeElement.disabled = true;
  }
}
