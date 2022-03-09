import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Input, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { LibraryService } from '../library.service';

declare const bootstrap: any

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('main') main!: ElementRef;
  @ViewChild('urlText') urlText!: ElementRef;
  @ViewChild('blackScreenImage') blackScreenImage!: ElementRef;
  @ViewChild('urlBox') urlBox!: ElementRef;
  @ViewChild('answer') answer!: ElementRef;
  @ViewChild('response') response!: ElementRef;
  @ViewChild('statement') statement!: ElementRef;
  @ViewChild('buttons') buttons!: ElementRef;
  @ViewChild('btnLegitimate') btnLegitimate!: ElementRef;
  @ViewChild('btnSuspicious') btnSuspicious!: ElementRef;
  @ViewChild('btnValidate') btnValidate!: ElementRef;
  @ViewChild('btnNext') btnNext!: ElementRef;
  @ViewChild('email') email!: ElementRef;
  @ViewChild('proposal') proposal!: ElementRef;

  @Output() finish = new EventEmitter<{ score: number, isCorrect: boolean | null, answers: string[]}>();

  @Input() exercisePreview!: Exercise;
  @Input() preview: boolean = true;

  private timeoutId?: ReturnType<typeof setTimeout>;
  private exerciseTimeout?: ReturnType<typeof setTimeout>;
  private mouseDown: boolean = false;
  private timeoutMouse?: ReturnType<typeof setTimeout>;
  private pointSuccessLegitimate: number = 10;
  private pointSuccessSuspicious: number = 10;
  private pointFailLegitimate: number = 0;
  private pointFailSuspicious: number = -10;
  template: number = 0;
  private contentIsLoaded = false;
  private exercisesSub: Subscription = Subscription.EMPTY;
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
  private id: string = '';
  private y: number = 0;
  private numberOfClickedItems: number = 0;
  private lockClock = 0;
  private delay = 500;
  senderColor: string = this.generateHTMLColor();
  private exerciseScore: number = 0;
  private isCorrect: boolean | null = null;
  private isPhishing: boolean | null = null;
  deploy = false;
  private isPreview = false;
  private answers: string[] = [];

  constructor(private route: ActivatedRoute, private libraryService: LibraryService, private elRef: ElementRef) { }

  ngAfterViewChecked(): void {
    this.loadAllContent();
  }

  loadAllContent() {
    if (this.contentIsLoaded) { return; }
    const loaded = this.email.nativeElement.querySelectorAll('#loaded');
    if (loaded) {
      this.initBody();
      this.contentIsLoaded = true;
      loaded[0].remove();
      this.proposal.nativeElement.querySelectorAll('.proposal').forEach((e: HTMLElement) => {
        e.style.opacity = '0';
      });
      if (this.preview) {
        this.displayButtons('block');
      }
    }
  }

  private loadExercise() {
    this.libraryService.getExercise(this.id).subscribe(response => {
      this.exercise = response.exercise;
      this.exerciseScore = 0;
      this.template = this.exercise.template;
      this.exercise.body = this.libraryService.render(this.exercise.body);
      this.exercise.object = this.libraryService.render(this.exercise.object);
      this.exercise.description = this.libraryService.render(this.exercise.description);
      this.exercise.toDisplayName = this.libraryService.render(this.exercise.toDisplayName);
    });
  }

  ngOnInit(): void {
    if (this.exercisePreview) {
      this.exerciseScore = 0;
      this.exercise = this.exercisePreview;
      this.template = this.exercise.template;
      this.exercise.body = this.libraryService.render(this.exercise.body);
      this.exercise.object = this.libraryService.render(this.exercise.object);
      this.exercise.description = this.libraryService.render(this.exercise.description);
      this.exercise.toDisplayName = this.libraryService.render(this.exercise.toDisplayName);
      this.isPreview = true;
    } else {
      this.id = this.route.snapshot.params['id'];
      this.loadExercise();
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
        this.loadExercise();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
  }

  private onDeploy(d: Event, context: any) {
    let e: HTMLElement | null | undefined = (d.target as HTMLElement);
    while (e?.getAttribute('fn') !== "deployable" && e?.className !== 'template') {
      e = e?.parentElement;
    }
    let classes = e.className.replaceAll(/ +/g, ' ').split(' ');
    const fold = context.email.nativeElement.querySelectorAll(".fold");
    const unfold = context.email.nativeElement.querySelectorAll(".unfold");
    if (classes.includes('deployed')) {
      classes = classes.filter(e => e !== 'deployed');
      e.className = classes.join(' ') + ' undeployed';
      fold.forEach((e: HTMLElement) => e.style.display = 'inline-block');
      unfold.forEach((e: HTMLElement) => e.style.display = 'none');
    } else {
      classes = classes.filter(e => e !== 'undeployed');
      e.className = classes.join(' ') + ' deployed';
      fold.forEach((e: HTMLElement) => e.style.display = 'none');
      unfold.forEach((e: HTMLElement) => e.style.display = 'inline-block');
    }
  }

  private displayUrl(e: any, context: any) {
    let node = e;
    while (!node.getAttribute('data-bs-toggle') && node.className !== 'template') {
      node = node.parentElement;
    }
    context.urlText.nativeElement.innerText = node.getAttribute('bs-title');
    context.blackScreenImage.nativeElement.style.display = 'block';
    context.blackScreenImage.nativeElement.style.opacity = '1';
    context.urlBox.nativeElement.style.opacity = '1';
    if (context.urlBox.nativeElement.getAttribute('os') === 'ios') {
      context.urlBox.nativeElement.style.maxHeight = '992px';
    } else {
      context.urlBox.nativeElement.style.transition = 'max-height 0.2s ease-out';
      context.urlBox.nativeElement.style.maxHeight = context.urlBox.nativeElement.scrollHeight + "px";
    }
  }

  private clearUrl(context: any) {
    if (context.timeoutId) {
      clearTimeout(context.timeoutId);
    }
  }

  private showUrl(e: Event, context: any) {
    this.timeoutId = setTimeout(context.displayUrl, 500, e.target, context);
  }

  private initBody() {
    this.displayButtons('block');
    this.btnLegitimate.nativeElement.style.display = 'inline';
    this.btnSuspicious.nativeElement.style.display = 'inline';
    this.btnValidate.nativeElement.style.display = 'none';
    this.answer.nativeElement.innerHTML = '';
    this.response.nativeElement.innerHTML = '';
    this.statement.nativeElement.style.height = '0px';
    this.response.nativeElement.opacity = 0;
    const that = this;

    if (this.template !== 0) {
      this.email.nativeElement.querySelectorAll('[data-bs-toggle]').forEach((e: HTMLElement) => {
        const title = e.getAttribute('title');
        const t = title === null ? '' : title;
        e.setAttribute('bs-title', t);
        e.removeAttribute('title');
        e.addEventListener('mousedown', (e: Event) => that.showUrl(e, that));
        e.addEventListener('touchstart', (e: Event) => that.showUrl(e, that));
        e.addEventListener('mouseup', () => that.clearUrl(that));
        e.addEventListener('mouseleave', () => that.clearUrl(that));
        e.addEventListener('touchend', () => that.clearUrl(that));
        e.addEventListener('touchleave', () => that.clearUrl(that));
      });
      this.email.nativeElement.querySelectorAll('[fn="deployable"]').forEach((e: HTMLElement) => {
        e.addEventListener('mouseup', (e: Event) => that.onDeploy(e, that));
      });
    } else {
      const tooltipTriggerList = [].slice.call(this.email.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      });
    }

    this.main.nativeElement.style.opacity = 1;
    this.btnLegitimate.nativeElement.style.opacity = 1;
    this.btnSuspicious.nativeElement.style.opacity = 1;
  }

  private generateHTMLColor() {
    return '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
  }

  unloadScreen() {
    this.blackScreenImage.nativeElement.style.display = 'none';
    this.blackScreenImage.nativeElement.style.opacity = '0';
    this.urlBox.nativeElement.style.maxHeight = '';
    if (this.urlBox.nativeElement.getAttribute('os') === 'ios') {
      this.urlBox.nativeElement.style.opacity = '0';
    } else {
      this.urlBox.nativeElement.style.transition = 'none';
    }
  }

  private expandStatement(context: any) {
    const sectionHeight = context.statement.nativeElement.scrollHeight;
    context.statement.nativeElement.style.height = sectionHeight + 'px';

    const transition = () => {
      context.statement.nativeElement.removeEventListener('transitionend', transition);
      context.statement.nativeElement.style.height = null;
    };

    context.statement.nativeElement.addEventListener('transitionend', transition);
  }

  private collapseStatement() {
    let sectionHeight = this.statement.nativeElement.scrollHeight;
    let elementTransition = this.statement.nativeElement.style.transition;
    this.statement.nativeElement.style.transition = '';
    const that = this;

    requestAnimationFrame(function () {
      that.statement.nativeElement.style.height = sectionHeight + 'px';
      that.statement.nativeElement.style.transition = elementTransition;
      requestAnimationFrame(function () {
        that.statement.nativeElement.style.height = 0 + 'px';
        setTimeout(function () {
          ++that.y;
          that.main.nativeElement.querySelectorAll('[class*=show-]').forEach((e: HTMLElement) => e.classList.remove('hidden'));
          that.main.nativeElement.querySelectorAll('.show-' + that.y).forEach((e: HTMLElement) => e.classList.remove('hidden'));
          that.expandStatement(that);
        }, 200);
      });
    });
  }

  private rewriteStatement() {
    this.collapseStatement();
  }

  isLegitimate() {
    if (this.exercise.legitimate) {
      this.answer.nativeElement.innerHTML = this.exercise.rightAnswer.text;
      this.isCorrect = true;
      this.isPhishing = false;
      this.exerciseScore = this.pointSuccessLegitimate;
    } else {
      this.answer.nativeElement.innerHTML = this.exercise.wrongAnswer.text;
      this.isCorrect = false;
      this.isPhishing = true;
      this.exerciseScore = this.pointFailSuspicious;
    }
    if (this.preview) {
      this.displayButtons('none');
    }
    this.swapButtons(this.btnNext);
    this.rewriteStatement();
  }

  isSuspicious() {
    if (!this.exercise.legitimate) {
      this.swapButtons(this.btnValidate);
      this.answer.nativeElement.innerHTML = this.exercise.rightAnswer.text;
      this.exerciseScore += this.pointSuccessSuspicious;
      const that = this;
      this.email.nativeElement.querySelectorAll('.clickable').forEach((e: HTMLElement) => {
        e.style.cursor = 'pointer';
        e.addEventListener('mousedown', (e: Event) => {
          that.mouseDown = true;
          e.stopPropagation();
          that.timeoutMouse = setTimeout(() => that.mouseDown = false, 500, e);
        });
        e.addEventListener('mouseup', (e: Event) => {
          if (that.mouseDown) {
            that.mouseDown = false;
            window.clearTimeout(that.timeoutMouse);
            that.turnClick(e, that);
          }
        });
      });
      this.proposal.nativeElement.querySelectorAll('.proposal').forEach((e: HTMLElement) => {
        e.style.opacity = '1';
      });
      this.btnValidate.nativeElement.disabled = true;
    } else {
      this.answer.nativeElement.innerHTML = this.exercise.wrongAnswer.text;
      this.isCorrect = false;
      this.isPhishing = false;
      this.exerciseScore = this.pointFailLegitimate;
      if (this.preview) {
        this.displayButtons('none');
      } else {
        this.swapButtons(this.btnNext);
      }
    }
    this.rewriteStatement();
  }

  toValidate() {
    if (this.preview) {
      this.displayButtons('none');
    } else {
      this.swapButtons(this.btnNext);
    }
    this.email.nativeElement.querySelectorAll('.clickable').forEach((e: HTMLElement) => {
      e.style.cursor = 'auto';
    });
    this.email.nativeElement.querySelectorAll('.clickable').forEach((e: HTMLElement) => {
      const new_element = e.cloneNode(true);
      e.parentNode?.replaceChild(new_element, e);
    });
    const allRightAnswers: any = {};
    const allWrongAnswers: any = {};
    if (this.exercise.rightAnswer.items) {
      this.exercise.rightAnswer.items.forEach(e => {
        if (e.id) {
          allRightAnswers[e.id] = e;
        }
      });
    }
    if (this.exercise.wrongAnswer.items) {
      this.exercise.wrongAnswer.items.forEach(e => {
        if (e.id) {
          allWrongAnswers[e.id] = e;
        }
      });
    }

    this.main.nativeElement.querySelectorAll('.clicked').forEach((e: HTMLElement) => {
      const attr: string | null = e.getAttribute('answer');
      const answer: string = attr === null ? '' : attr;
      const color = (answer in allRightAnswers) ? '#64f3b0' : '#ffa4a4';
      if (e.classList.contains('clickable')) {
        e.style.outline = color + ' solid 2px';
        e.style.backgroundColor = color;
      } else if (e.classList.contains('proposal')) {
        e.getElementsByTagName('label')[0].style.backgroundColor = color;
        e.getElementsByTagName('label')[0].style.color = '#212529';
      } else {
        Array.from(e.children).forEach(element => {
          e.style.backgroundColor = color;
        });
      }
    });
    const updateResponse = () => {
      this.response.nativeElement.innerHTML = this.writeResponse(allRightAnswers, allWrongAnswers);
      this.response.nativeElement.opacity = 1;
    }
    this.response.nativeElement.opacity = 0;
    setTimeout(updateResponse, 200);
    this.rewriteStatement();
  }

  writeResponse(allRightAnswers: any, allWrongAnswers: any) {
    const rightAnswers = [];
    const wrongAnswers = [];
    const allClickedElements = this.email.nativeElement.getElementsByClassName('clicked');

    let displayWrongAnswer = false;
    let displayDefaultWrongAnswer = false;

    for (let i = 0; i < allClickedElements.length; ++i) {
      const answer = allClickedElements[i].getAttribute('answer');
      const a: string = (answer === null) ? '' : answer;
      this.answers.push(a);
      if (allRightAnswers[a]) {
        this.isCorrect = true;
        if (allRightAnswers[a].text && allRightAnswers[a].text !== 'ignore' && allRightAnswers[a].text !== '') {
          rightAnswers.push(allRightAnswers[a].text);
        }
        this.exerciseScore += allRightAnswers[a].score;
      } else if (allWrongAnswers[a]) {
        if (allWrongAnswers[a].text && allWrongAnswers[a].text !== 'ignore' && allWrongAnswers[a].text !== '') {
          wrongAnswers.push(allWrongAnswers[a].text);
          displayWrongAnswer = true;
        }
        this.exerciseScore -= allWrongAnswers[a].score;
      } else {
        this.exerciseScore -= 5;
        displayDefaultWrongAnswer = true;
      }
    }

    let message = rightAnswers.length > 0 ? '<p><span style="color:#3c3">Correct' : '';
    for (let i = 0; i < rightAnswers.length; ++i) {
      if (i !== 0 && i === rightAnswers.length - 1) {
        message += ' and ' + rightAnswers[i];
      } else {
        message += ', ' + rightAnswers[i];
      }
    }

    if (displayWrongAnswer) {
      if (message !== '') {
        message += '.</span> <span style="color:#f33">However';
      } else {
        message = '<p><span style="color:#f33">Sorry';
      }
      for (let i = 0; i < wrongAnswers.length; ++i) {
        if (i !== 0 && i === wrongAnswers.length - 1) {
          message += ' and ' + wrongAnswers[i];
        } else {
          message += ', ' + wrongAnswers[i];
        }
      }
    }

    if (displayDefaultWrongAnswer) {
      if (displayWrongAnswer) {
        message += '. The other elements you have selected are not suspicious enough';
      } else {
        if (message !== '') {
          message += '.</span> <span style="color:#f33">However, the other elements you have selected are not suspicious enough';
        } else {
          message = '<p><span style="color:#f33">Unfortunately, the elements you have selected does not raise enough suspiciousness';
        }
      }
    }

    this.isPhishing = true;
    return message + '.</span></p>';
  }

  switchClick(e: Event) {
    this.turnClick(e, this);
  }

  turnClick(e: Event, context: any) {
    let element: HTMLElement | null | undefined = (e.target as HTMLElement);
    while (!element?.getAttribute('answer') && element?.className !== 'template') {
      element = element?.parentElement;
    }
    if (element.className === 'template') { return; }
    if (element.classList.contains('clicked')) {
      --context.numberOfClickedItems;
      element.classList.remove('clicked');
    } else {
      ++context.numberOfClickedItems;
      element.classList.add('clicked');
    }
    e.stopPropagation();
    context.btnValidate.nativeElement.disabled = context.numberOfClickedItems == 0;
  }

  private displayButtons(str: string) {
    this.buttons.nativeElement.style.display = str;
  }

  private swapButtons(btnRef: ElementRef) {
    const btn = this.buttons.nativeElement.querySelectorAll(".btn-nav");
    btn.forEach((e: HTMLElement) => e.style.opacity = '0');
    setTimeout(function () {
      btn.forEach((e: HTMLElement) => e.style.display = 'none');
      btnRef.nativeElement.style.display = 'inline';
      setTimeout(function () {
        btnRef.nativeElement.style.opacity = '1';
      }, 200);
    }, 200);
  }

  goToNextPage() {
    if (this.lockClock < (Date.now() - this.delay)) {
      this.main.nativeElement.style.opacity = 0;
      this.lockClock = Date.now();
      this.finish.emit({
        score: this.exerciseScore,
        isCorrect: this.isCorrect,
        answers: this.answers
      });
    }
  }
}
