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
    body: ['<div style=font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:13px;color:#202020;line-height:1.5><p><span class=clickable answer="a20">Hi Jdoe,</span><p><span class=clickable answer="a21">The password of your email account jdoe@scor.com will expire today <<writeDate({&quot;d&quot;:&quot;0&quot;,&quot;format&quot;:&quot;MMMM d, YYYY&quot;})>></span><p><span class=clickable answer="a22">Please click below if you want to keep using same password</span></p><br><p><div style=text-decoration:none;display:inline-block;color:#fff;background-color:#2688d9;font-size:24px;font-weight:700 class="clickable link"title="https://urldefense.com/v3/__https://anewbike.com/y/?email=jdoe@scor.com__;!!Ad9y2A!i7nwrmDGehUpoPWRlDiDqnFCPaf_EEuP2Chu73kLJG2lIzYZCSgC0FgvRuV$"data-bs-toggle=tooltip answer="a23">Keep Same Password</div><p></p><br><br><br><p><span class=clickable answer="a24">Thanks,</span></p><br><p><span class=clickable answer="a25">The account team</span><p><span class=clickable answer="a26" style=color:#666>Scor | Security</span></div>', [Validators.required, Validators.minLength(3)]],
    phishing: [true, [Validators.required]],
    rightAnswer: ['Indeed, this email is suspicious. Now please click on the element(s) that raise your suspiciousness, then click on validate.', [Validators.required, Validators.minLength(3)]],
    wrongAnswer: ['Unfortunately, this is a phishing email. You should pay more attention on clues that must raise your suspiciousness.', [Validators.required, Validators.minLength(3)]],
    ranswers: this.formBuilder.array([
      this.formBuilder.group({
        id: new FormControl('a3', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('SCOR support doesn\'t have this name', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a4', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the email address is suspicious', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a10', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('you don\'t expect to have this message', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a12', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the message doesn\'t follow the SCOR visual guide', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a13', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the message creates an urgency situation', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a20', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('greeting recipients with their email id makes the email suspicious', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a23', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the link when hovering over this text doesn\'t seem to be legitimate', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a25', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('this team doesn\'t exist at SCOR', { validators: [Validators.minLength(3)] })
      }),
      this.formBuilder.group({
        id: new FormControl('a26', { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl('the signature doesn\'t match the SCOR visual guide', { validators: [Validators.minLength(3)] })
      })
    ]),
    wanswers: this.formBuilder.array([this.formBuilder.group({
      id: new FormControl(null, { validators: [Validators.minLength(1)] }),
      score: new FormControl(0),
      text: new FormControl(null, { validators: [Validators.minLength(3)] })
    })])
  });





  // form: FormGroup = this.formBuilder.group({
  //   template: [0, [Validators.required, Validators.min(0), Validators.max(2)]],
  //   title: ['Microsoft Office alert', [Validators.required, Validators.minLength(3)]],
  //   description: ['You\'re John DOE and working at SCOR.', [Validators.required, Validators.minLength(3)]],
  //   object: ['ID: 133 - Account Alert! (March 2022)', [Validators.required, Validators.minLength(3)]],
  //   senderDisplayName: ['Microsoft account team', [Validators.required, Validators.minLength(3)]],
  //   senderEmail: ['outlooo.teeam@outlook.com', [Validators.required, Validators.email, Validators.minLength(3)]],
  //   time: ['12:15 AM', [Validators.required, Validators.minLength(3)]],
  //   toDisplayName: ['DOE John', [Validators.required, Validators.minLength(3)]],
  //   toEmail: ['JDOE@scor.com', [Validators.required, Validators.email, Validators.minLength(3)]],
  //   body: ['<img class="clickable" answer="a20" src="./assets/images/img-outlook.png"><p style="margin-top:20px"><span class="clickable" answer="a21">Dear Outlook user,</span></p><p><span class="clickable" answer="a22">You have some blocked incoming mails due to our maintenance problem.</span></p><p><span class="clickable" answer="a23">In order to rectify this problem, you are required to follow the below link to verify and use your account normally.</span></p><p><span class="clickable" answer="a24">Please click below to unlock your messages, it takes a few seconds.</span></p><p><span class="clickable link button-link" answer="a25" style="color:#fff;padding:6px 10px;background:#2672ec;font-weight:bold" title="https://urldefense.com/v3/__http://spapparelsindia.in/Aprons/outlook.com/login.html__;!!Ad9y2A!i7nwrmDGehUpoPWRlDiDqnFCPaf_EEuP2Chu73kLJG2lIzYZCSgC0FgvRuV$" data-bs-toggle="tooltip">Verify Your Account</span></p><p><span class="clickable" answer="a26">We apologize for any inconvenience and appreciate your understanding.</span></p><p><span class="clickable" answer="a27">Thanks.</span><br><span class="clickable" answer="a28">The Microsoft account team<sup style="font-size:10px">TM</sup></span></p>', [Validators.required, Validators.minLength(3)]],
  //   phishing: [true, [Validators.required]],
  //   rightAnswer: ['Indeed, this email is suspicious. Now please click on the element(s) that raise your suspiciousness, then click on validate.', [Validators.required, Validators.minLength(3)]],
  //   wrongAnswer: ['Unfortunately, this is a phishing email. You should pay more attention on clues that must raise your suspiciousness.', [Validators.required, Validators.minLength(3)]],
  //   ranswers: this.formBuilder.array([
  //     this.formBuilder.group({
  //       id: new FormControl('a4', { validators: [Validators.minLength(1)] }),
  //       score: new FormControl(15),
  //       text: new FormControl('the email address is suspicious', { validators: [Validators.minLength(3)] })
  //     }),
  //     this.formBuilder.group({
  //       id: new FormControl('a20', { validators: [Validators.minLength(1)] }),
  //       score: new FormControl(5),
  //       text: new FormControl('general greetings might be suspicious', { validators: [Validators.minLength(3)] })
  //     }),
  //     this.formBuilder.group({
  //       id: new FormControl('a25', { validators: [Validators.minLength(1)] }),
  //       score: new FormControl(15),
  //       text: new FormControl('the link when hovering over this text doesn\'t seem to be legitimate', { validators: [Validators.minLength(3)] })
  //     })
  //   ]),
  //   wanswers: this.formBuilder.array([this.formBuilder.group({
  //     id: new FormControl(null, { validators: [Validators.minLength(1)] }),
  //     score: new FormControl(0),
  //     text: new FormControl(null, { validators: [Validators.minLength(3)] })
  //   })])
  // });






  // form: FormGroup = this.formBuilder.group({
  //   template: [0, [Validators.required, Validators.min(0), Validators.max(2)]],
  //   title: ['Title', [Validators.required, Validators.minLength(3)]],
  //   description: ['Description', [Validators.required, Validators.minLength(3)]],
  //   object: ['Object', [Validators.required, Validators.minLength(3)]],
  //   senderDisplayName: ['Sender Name', [Validators.required, Validators.minLength(3)]],
  //   senderEmail: ['sender@email.com', [Validators.required, Validators.email, Validators.minLength(3)]],
  //   time: ['10:00 PM', [Validators.required, Validators.minLength(3)]],
  //   toDisplayName: ['DOE John', [Validators.required, Validators.minLength(3)]],
  //   toEmail: ['JDOE@scor.com', [Validators.required, Validators.email, Validators.minLength(3)]],
  //   body: ['This is a body', [Validators.required, Validators.minLength(3)]],
  //   phishing: [false, [Validators.required]],
  //   rightAnswer: ['Right', [Validators.required, Validators.minLength(3)]],
  //   wrongAnswer: ['Wrong', [Validators.required, Validators.minLength(3)]],
  //   ranswers: this.formBuilder.array([this.formBuilder.group({
  //     id: new FormControl(null, { validators: [Validators.minLength(1)] }),
  //     score: new FormControl(0),
  //     text: new FormControl(null, { validators: [Validators.minLength(3)] })
  //   })]),
  //   wanswers: this.formBuilder.array([this.formBuilder.group({
  //     id: new FormControl(null, { validators: [Validators.minLength(1)] }),
  //     score: new FormControl(0),
  //     text: new FormControl(null, { validators: [Validators.minLength(3)] })
  //   })])
  // });
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
    body : '',
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
          const exercise = response.exercise;
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
          this.updateForm('ranswers', exercise.rightAnswer.items);
          this.updateForm('wanswers', exercise.wrongAnswer.items);
        });
      }
    });
  }

  private updateForm(str: string, answers: { id: string, score: number, text: string }[]) {
    const elementArray = this.form.get(str) as FormArray;
    elementArray.clear();
    answers.forEach((e: {id: string, score: number, text: string}) => {
      if (e.id) {
        elementArray.push(this.formBuilder.group({
          id: new FormControl(e.id, { validators: [Validators.minLength(1)] }),
          score: new FormControl(e.score),
          text: new FormControl(e.text, { validators: [Validators.minLength(3)] })
        }));
      }
    });
    if (elementArray.length === 0) {
      elementArray.push(this.formBuilder.group({
        id: new FormControl(null, { validators: [Validators.minLength(1)] }),
        score: new FormControl(10),
        text: new FormControl(null, { validators: [Validators.minLength(3)] })
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

  private getItems(items: { id: string; score: number; text: string}[]) {
    const returnedItems: { id: string; score: number; text: string }[] = [];
    items.forEach(e => {
      // console.log(e.id + ' - ' + e.score + ' - ' + e.text);
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
        'wrongAnswer':'There is not enough elements that should raise your suspiciousness.'
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
    console.log(this.preview1);
    console.log(this.preview2);
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
    // console.log(this.exercise.body.replaceAll('\n', '').replaceAll(/ +/g, ' '));
  }

  private isValidForm(): boolean {
    if (this.form.invalid) { return false; }
    return (this.getItems(this.form.value.ranswers).length !== 0);
  }

  onSubmit(): void {
    console.log(this.isValidForm());
    if (!this.isValidForm()) { return; }
    const exercise: Exercise = {
      id: this.id,
      template: this.form.value.template,
      title: this.form.value.title,
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
    if (this.createMode) {
      console.log('create');
      this.libraryService.addExercise(exercise).subscribe(response => {
        console.log(response);
        this.form.reset();
      });
    } else {
      console.log('edit');
      this.libraryService.updateExercise(this.id, exercise).subscribe(response => {
        console.log(response);
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
      text: new FormControl(null, { validators: [Validators.minLength(3)] })
    }));
  }
}
