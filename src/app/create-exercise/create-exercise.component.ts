import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LibraryService } from 'src/app/library.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.css']
})
export class CreateExerciseComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    template: [0, [Validators.required, Validators.min(0), Validators.max(2)]],
    title: ['SCOR expiration', [Validators.required, Validators.minLength(3)]],
    description: ['You\'re John DOE and working at SCOR.', [Validators.required, Validators.minLength(3)]],
    object: ['[-Password Expired-]', [Validators.required, Validators.minLength(3)]],
    senderDisplayName: ['Scor Password', [Validators.required, Validators.minLength(3)]],
    senderEmail: ['anonymous@ae156.secure.ne.jp', [Validators.required, Validators.email, Validators.minLength(3)]],
    time: ['10:14 AM', [Validators.required, Validators.minLength(3)]],
    toDisplayName: ['DOE John', [Validators.required, Validators.minLength(3)]],
    toEmail: ['JDOE@scor.com', [Validators.required, Validators.email, Validators.minLength(3)]],
    body: ['<div style=font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5><p><span class=clickable answer="a20">Hi Jdoe,</span><p><span class=clickable answer="a21">The password of your email account jdoe@scor.com will expire today <<writeDate({&quot;d&quot;:&quot;0&quot;,&quot;format&quot;:&quot;MMMM d, YYYY&quot;})>></span><p><span class=clickable answer="a22">Please click below if you want to keep using same password</span></p><br><p><div style=text-decoration:none;display:inline-block;color:#fff;background-color:#2688d9;font-size:24px;font-weight:700 class="clickable link"title=https://urldefense.com/v3/__https://anewbike.com/y/?email=jdoe@scor.com__;!!Ad9y2A!i7nwrmDGehUpoPWRlDiDqnFCPaf_EEuP2Chu73kLJG2lIzYZCSgC0FgvRuV$data-bs-toggle=tooltip answer="a23">Keep Same Password</div><p></p><br><br><br><p><span class=clickable answer="a24">Thanks,</span></p><br><p><span class=clickable answer="a25">The account team</span><p><span class=clickable answer="a26" style=color:#666>Scor | Security</span></div>', [Validators.required, Validators.minLength(3)]],
    phishing: [true, [Validators.required]],
    rightAnswer: ['Indeed, this email is suspicious. Now please click on the element(s) that raise your suspiciousness, then click on validate.', [Validators.required, Validators.minLength(3)]],
    wrongAnswer: ['Unfortunately, this is a phishing email. You should pay more attention on clues that must raise your suspiciousness.', [Validators.required, Validators.minLength(3)]],
    ranswers: this.formBuilder.array([
      this.formBuilder.group({
        id: new FormControl('a3', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('SCOR support doesn\'t have this name')
      }),
      this.formBuilder.group({
        id: new FormControl('a4', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the email address is suspicious')
      }),
      this.formBuilder.group({
        id: new FormControl('a10', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('you don\'t expect to have this message')
      }),
      this.formBuilder.group({
        id: new FormControl('a12', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the message doesn\'t follow the SCOR visual guide')
      }),
      this.formBuilder.group({
        id: new FormControl('a13', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the message creates an urgency situation')
      }),
      this.formBuilder.group({
        id: new FormControl('a20', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('greeting recipients with their email id makes the email suspicious')
      }),
      this.formBuilder.group({
        id: new FormControl('a23', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the link when hovering over this text doesn\'t seem to be legitimate')
      }),
      this.formBuilder.group({
        id: new FormControl('a25', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('this team doesn\'t exist at SCOR')
      }),
      this.formBuilder.group({
        id: new FormControl('a26', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the signature doesn\'t match the SCOR visual guide')
      })
    ]),
    wanswers: this.formBuilder.array([this.formBuilder.group({
      id: new FormControl(null, { validators: [Validators.minLength(1)] }),
      score: new FormControl(0),
      text: new FormControl(null)
    })])
  });

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
  exercisePreview!: Exercise;
  preview1 = false;
  preview2 = false;
  createMode: boolean = true;
  id: string = '';

  constructor(private formBuilder: FormBuilder, private libraryService: LibraryService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('exerciseId')) {
        this.createMode = false;
        const id = param.get('exerciseId');
        this.id = (id) ? id : '';
        this.libraryService.getExercise(this.id).subscribe(response => {
          this.updateForm(response.exercise);
        });
      }
    });
  }

  private updateAnswers(str: string, answers: { id: string, score: number, text: string }[]) {
    const elementArray = this.form.get(str) as FormArray;
    elementArray.clear();
    answers.forEach((e: { id: string, score: number, text: string }) => {
      if (e.id) {
        elementArray.push(this.formBuilder.group({
          id: new FormControl(e.id, { validators: [Validators.minLength(1)] }),
          score: new FormControl(e.score),
          text: new FormControl(e.text)
        }));
      }
    });
    if (elementArray.length === 0) {
      elementArray.push(this.formBuilder.group({
        id: new FormControl(null, { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl(null)
      }));
    }
  }

  get formRightAnswers() {
    return <FormArray>this.form.get('ranswers');
  }

  get formWrongAnswers() {
    return <FormArray>this.form.get('wanswers');
  }

  private getDigram(displayName: string): string {
    const names = displayName.toUpperCase().split(' ');
    return (names.length > 1) ? `${names[0].charAt(0)}${names[1].charAt(0)}` : `${names[0].charAt(0)}`;
  }

  private getItems(items: { id: string; score: number; text: string }[]) {
    const returnedItems: { id: string; score: number; text: string }[] = [];
    items.forEach(e => {
      if (e.id && e.id.trim() !== '' && e.score !== undefined && e.score !== null && e.text && e.text.trim() !== '') {
        const item = e;
        item.text = this.removeDoubleSpace(item.text);
        returnedItems.push(item);
      }
    });
    if (returnedItems.length === 0) {
      returnedItems.push({
        id: 'ignore',
        score: 0,
        text: 'ignore'
      });
    }
    return returnedItems;
  }

  fillupAnswer() {
    const phish = this.form.value.phishing;
    if (phish) {
      this.form.patchValue({
        'rightAnswer': 'Correct, this email is indeed legitimate.',
        'wrongAnswer': 'There is not enough elements that should raise your suspiciousness.'
      });
    } else {
      this.form.patchValue({
        'rightAnswer': 'Indeed, this email is suspicious. Now please click on the element(s) that raised your suspiciousness, then click on validate.',
        'wrongAnswer': 'Unfortunately, this is a phishing email. You should pay more attention on clues that must raise your suspiciousness.'
      });
    }
  }

  private removeDoubleSpace(str: string) {
    return str.replaceAll('\n', '').replaceAll(/ +/g, ' ');
  }

  private replaceBreakLine(str: string) {
    return str.replaceAll('\n', '<br>');
  }

  displayPreview() {
    if (!this.preview1 && !this.preview2) {
      this.preview1 = true;
    } else {
      this.preview1 = !this.preview1;
      this.preview2 = !this.preview2;
    }
    this.exercise.id = '';
    this.exercise.template = parseInt(this.form.value.template);
    this.exercise.title = this.form.value.title;
    this.exercise.description = this.replaceBreakLine(this.form.value.description);
    this.exercise.digram = this.getDigram(this.form.value.senderDisplayName);
    this.exercise.object = this.form.value.object;
    this.exercise.senderDisplayName = this.form.value.senderDisplayName;
    this.exercise.senderEmail = this.form.value.senderEmail;
    this.exercise.time = this.form.value.time;
    this.exercise.toDisplayName = this.form.value.toDisplayName;
    this.exercise.toEmail = this.form.value.toEmail;
    this.exercise.body = this.removeDoubleSpace(this.form.value.body) + '<div id="loaded"></div>';
    this.exercise.legitimate = !this.form.value.phishing;
    this.exercise.rightAnswer.text = this.form.value.rightAnswer;
    this.exercise.rightAnswer.items = this.getItems(this.form.value.ranswers);
    this.exercise.wrongAnswer.text = this.form.value.rightAnswer;
    this.exercise.wrongAnswer.items = this.getItems(this.form.value.ranswers);
    const exercise = this.exercise;
    this.exercisePreview = exercise;
  }

  private isValidForm(): boolean {
    if (this.form.invalid) { return false; }
    return (this.getItems(this.form.value.ranswers).length !== 0);
  }

  onSubmit(): void {
    if (!this.isValidForm()) { return; }
    const exercise = this.createExercise();
    if (this.createMode) {
      this.libraryService.addExercise(exercise).subscribe(response => {
        this.form.reset();
      });
    } else {
      this.libraryService.updateExercise(this.id, exercise).subscribe(response => {
        this.form.reset();
      });
    }
  }

  removeOrClearAnswer(i: number, str: string) {
    const elementArray = this.form.get(str) as FormArray;
    if (elementArray.length > 1) {
      elementArray.removeAt(i);
    } else {
      elementArray.reset();
    }
  }

  addNewAnswer(str: string) {
    const elementArray = this.form.get(str) as FormArray;
    elementArray.push(this.formBuilder.group({
      id: new FormControl(null, { validators: [Validators.minLength(1)] }),
      score: new FormControl(10),
      text: new FormControl(null)
    }));
  }

  private createExercise(): Exercise {
    return {
      id: this.id,
      template: this.form.value.template,
      title: this.form.value.title.trim(),
      description: this.replaceBreakLine(this.form.value.description),
      digram: this.getDigram(this.form.value.senderDisplayName),
      object: this.form.value.object,
      senderDisplayName: this.form.value.senderDisplayName,
      senderEmail: this.form.value.senderEmail,
      time: this.form.value.time,
      toDisplayName: this.form.value.toDisplayName,
      toEmail: this.form.value.toEmail,
      body: this.removeDoubleSpace(this.form.value.body),
      legitimate: !this.form.value.phishing,
      rightAnswer: {
        text: this.removeDoubleSpace(this.form.value.rightAnswer),
        items: this.getItems(this.form.value.ranswers)
      },
      wrongAnswer: {
        text: this.removeDoubleSpace(this.form.value.wrongAnswer),
        items: this.form.value.wanswers
      }
    };
  }

  export() {
    const exercise = this.createExercise();
    const json = JSON.stringify(exercise);
    const tempElement = document.createElement('a');
    tempElement.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(json));
    tempElement.setAttribute('download', exercise.title.replaceAll(/[^0-9a-zA-Z]+/g, '-') + '.json');
    tempElement.style.display = 'none';
    document.body.appendChild(tempElement);
    tempElement.click();
    tempElement.remove();
  }

  updateForm(exercise: Exercise) {
    this.form.patchValue({
      'template': exercise.template,
      'title': exercise.title,
      'description': exercise.description,
      'object': exercise.object,
      'senderDisplayName': exercise.senderDisplayName,
      'senderEmail': exercise.senderEmail,
      'time': exercise.time,
      'toDisplayName': exercise.toDisplayName,
      'toEmail': exercise.toEmail,
      'body': exercise.body,
      'phishing': !exercise.legitimate,
      'rightAnswer': exercise.rightAnswer.text,
      'wrongAnswer': exercise.wrongAnswer.text
    });
    this.updateAnswers('ranswers', exercise.rightAnswer.items);
    this.updateAnswers('wanswers', exercise.wrongAnswer.items);
  }

  onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length > 0) {
      const selectedFile = files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(selectedFile, "UTF-8");
      fileReader.onload = () => {
        const exercise = JSON.parse((fileReader.result as string));
        this.updateForm(exercise);
      }
      fileReader.onerror = (error) => {
        console.error(error);
      }
    }
  }
}
