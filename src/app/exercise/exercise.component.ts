import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { LibraryService } from '../library.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit, OnDestroy {
  timeoutId?: ReturnType<typeof setTimeout>;
  mouseDown = false;
  timeoutMouse = null;
  template: number = 0;
  private exercisesSub: Subscription = Subscription.EMPTY;
  exercises: Exercise[] = [];
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
    rightAnswer: '',
    wrongAnswer: '',
    answers: null
  };

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.libraryService.getExercises();
    this.exercisesSub = this.libraryService.getExercisesListener()
      .subscribe((exercises: Exercise[]) => {
        this.exercises = exercises;
        this.exercise = this.exercises[0];
//        document.getElementById('title')?.innerText = this.exercise.title;
        this.template = this.exercise.template;
        this.template = 1;

        // scope.$on('$viewContentLoaded', function ())
        setTimeout(this.initBody, 1000);
        // this.initBody();
      });
  }

  ngOnDestroy(): void {
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
  }

  toto(): void{

  }

  onDeploy(d: any) {
    console.log("deploy");
    let e: HTMLElement | null | undefined = d;
    while (!e?.getAttribute('deployable') && e?.id.split('-')[0] !== 'template') {
      e = e?.parentElement;
    }
    console.log(e);
    let classes = e.className.replaceAll(/ +/g, ' ').split(' ');
    const fold = document.querySelectorAll(".fold");
    const unfold = document.querySelectorAll(".unfold");
    if (classes.includes('deployed')) {
      classes = classes.filter(e => e !== 'deployed');
      e.className = classes.join(' ') + ' undeployed';
      fold.forEach(e => (e as HTMLElement).style.display = 'inline-block');
      unfold.forEach(e => (e as HTMLElement).style.display = 'none');
      console.log("fold");
    } else {
      classes = classes.filter(e => e !== 'undeployed');
      e.className = classes.join(' ') + ' deployed';
      fold.forEach(e => (e as HTMLElement).style.display = 'none');
      unfold.forEach(e => (e as HTMLElement).style.display = 'inline-block');
      console.log("unfold");
    }
    console.log("done");
  }

  // onDeploy(d: any) {
  //   this.libraryService.onDeploy(d);
  // }

  displayUrl(e: any) {
    let node = e;
    while (!node.getAttribute('data-original-title') && node.id !== 'template') {
      node = node.parentElement;
    }
    const urlText = document.getElementById('url-text');
    if (urlText) {
      urlText.innerText = node.getAttribute('data-original-title');
      const screen = document.getElementById('black-screen-image');
      if (screen) {
        screen.style.display = 'block';
        screen.style.opacity = '1';
        const box = document.getElementById('url-box');
        if (box) {
          box.style.opacity = '1';
          if (box.getAttribute('os') === 'ios') {
            box.style.maxHeight = '992px';
          } else {
            box.style.transition = 'max-height 0.2s ease-out';
            box.style.maxHeight = box.scrollHeight + "px";
          }
        }
      }
    }
  }




  // plop() {
  //   console.log("plop");
  // }

  private initBody() {

    const showUrl = (e: any) => {
      // console.log(e);
      this.timeoutId = setTimeout(this.displayUrl, 500, e.target);
    }

    const clearUrl = () => {
      // console.log("test");
      if (!this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }

    const onDeploy = (d: any) => {
      console.log("deploy");
      let e: HTMLElement | null | undefined = d;
      while (!e?.getAttribute('deployable') && e?.id.split('-')[0] !== 'template') {
        e = e?.parentElement;
      }
      console.log(e);
      let classes = e.className.replaceAll(/ +/g, ' ').split(' ');
      const fold = document.querySelectorAll(".fold");
      const unfold = document.querySelectorAll(".unfold");
      if (classes.includes('deployed')) {
        classes = classes.filter(e => e !== 'deployed');
        e.className = classes.join(' ') + ' undeployed';
        fold.forEach(e => (e as HTMLElement).style.display = 'inline-block');
        unfold.forEach(e => (e as HTMLElement).style.display = 'none');
        console.log("fold");
      } else {
        classes = classes.filter(e => e !== 'undeployed');
        e.className = classes.join(' ') + ' deployed';
        fold.forEach(e => (e as HTMLElement).style.display = 'none');
        unfold.forEach(e => (e as HTMLElement).style.display = 'inline-block');
        console.log("unfold");
      }
      console.log("done");
    }

    // const p = plop;
    // const that = this;

    document.querySelectorAll('[data-original-title]').forEach((e) => {
      // console.log(e);
      e.addEventListener('click', onDeploy);
      e.addEventListener('mousedown', showUrl);
      e.addEventListener('touchstart', showUrl);
      e.addEventListener('mouseup', clearUrl);
      e.addEventListener('mouseleave', clearUrl);
      e.addEventListener('touchend', clearUrl);
      e.addEventListener('touchleave', clearUrl);
    });
    document.querySelectorAll('[deployable]').forEach(e => {
      e.addEventListener('mouseup', onDeploy);
    });
  }

// function unloadScreen() {
//   const screen = document.getElementById('black-screen-image');
//   screen.style.display = 'none';
//   screen.style.opacity = '0';
//   const box = document.getElementById('url-box');
//   box.style.maxHeight = null;
//   if (box.getAttribute('os') === 'ios') {
//     box.style.opacity = '0';
//   } else {
//     box.style.transition = 'none';
//   }
// }

// function triggerSuspicious() {
//   $('.clickable, .proposal')
//     .css('cursor', 'pointer')
//     .mousedown(function (e) {
//       mouseDown = true;
//       e.stopPropagation();
//       timeoutMouse = setTimeout(function () {
//         mouseDown = false;
//       }, 500, e);
//     })
//     .mouseup(function (e) {
//       if (mouseDown) {
//         mouseDown = false;
//         clearTimeout(timeoutMouse);
//         turnClick(e, $(this));
//       }
//     });
//   $('.proposal').css('opacity', 1).addClass('hh');
//   $('.no-hint').css('opacity', 0);
// }

// function toggleClass(element, classname, action, selector) {
//   document.querySelectorAll(selector).forEach(a => {
//     let classes = a.className.replaceAll(/ +/g, ' ').split(' ');
//     if (action == 'add') {
//       a.className = classes.join(' ') + ' ' + classname;
//     } else if (action == 'remove') {
//       classes = classes.filter(e => e !== classname);
//       a.className = classes.join(' ');
//     }
//   });
// }

// function turnClick(ev, e) {
//   const link = e.attr('link-with');
//   const action = e.hasClass('clicked') ? 'remove' : 'add';
//   if (action === 'remove') {
//     e.removeClass('clicked');
//   } else {
//     e.addClass('clicked');
//   }
//   ev.stopPropagation();
// }
}
