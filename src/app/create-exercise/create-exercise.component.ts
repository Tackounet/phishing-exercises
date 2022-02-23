import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LibraryService } from 'src/app/library.service';

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.css']
})
export class CreateExerciseComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    template: [0, [Validators.required, Validators.min(0), Validators.max(2)]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['Description', [Validators.required, Validators.minLength(3)]],
    object: ['Object', [Validators.required, Validators.minLength(3)]],
    senderDisplayName: ['SEnder Name', [Validators.required, Validators.minLength(3)]],
    senderEmail: ['sender@email.com', [Validators.required, Validators.email, Validators.minLength(3)]],
    time: ['10:00 PM', [Validators.required, Validators.minLength(3)]],
    toDisplayName: ['John DOE', [Validators.required, Validators.minLength(3)]],
    toEmail: ['jdoe@scor.com', [Validators.required, Validators.email, Validators.minLength(3)]],
    body: ['This is a body', [Validators.required, Validators.minLength(3)]],
    rightAnswer: ['Right', [Validators.required, Validators.minLength(3)]],
    wrongAnswer: ['Wrong', [Validators.required, Validators.minLength(3)]],
    answers: this.formBuilder.array([], [])
  });
  // form: FormGroup = this.formBuilder.group({
  //   title: ['', [Validators.required, Validators.minLength(3)]],
  //   description: ['', [Validators.required, Validators.minLength(3)]],
  //   object: ['', [Validators.required, Validators.minLength(3)]],
  //   senderDisplayName: ['', [Validators.required, Validators.minLength(3)]],
  //   senderEmail: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
  //   time: ['', [Validators.required, Validators.minLength(3)]],
  //   toDisplayName: ['John DOE', [Validators.required, Validators.minLength(3)]],
  //   toEmail: ['jdoe@scor.com', [Validators.required, Validators.email, Validators.minLength(3)]],
  //   body: ['', [Validators.required, Validators.minLength(3)]],
  //   rightAnswer: ['', [Validators.required, Validators.minLength(3)]],
  //   wrongAnswer: ['', [Validators.required, Validators.minLength(3)]],
  //   answers: this.formBuilder.array([], [])
  // });
  createMode: boolean = true;
  id: string = '';

  constructor(private formBuilder: FormBuilder, private libraryService: LibraryService) { }

  ngOnInit(): void {
  }

  get formAnswers() {
    return <FormArray>this.form.get('answers');
  }

  private getDigram(displayName: string): string {
    const names = displayName.toUpperCase().split(' ');
    return (names.length > 1) ? `${names[0].charAt(0)}${names[1].charAt(0)}` : `${names[0].charAt(0)}`;
  }

  onSubmit(): void {
    console.log(this.form.invalid);
    if (this.form.invalid) { return }
    const exercise = {
      id: this.id,
      template: this.form.value.template,
      title: this.form.value.title,
      description: this.form.value.description,
      digram: this.getDigram(this.form.value.senderDisplayName),
      object: this.form.value.object,
      senderDisplayName: this.form.value.senderDisplayName,
      senderEmail: this.form.value.senderEmail,
      time: this.form.value.time,
      toDisplayName: this.form.value.toDisplayName,
      toEmail: this.form.value.toEmail,
      body: this.form.value.body,
      rightAnswer: this.form.value.rightAnswer,
      wrongAnswer: this.form.value.wrongAnswer,
      answers: this.form.value.answers
    };
    if (this.createMode) {
      this.libraryService.addExercise(exercise);
    } else {
      this.libraryService.updateExercise(exercise);
    }
    this.form.reset();
  }

  removeOrClearAnswer(i: number) {
    const elementArray = this.form.get('answers') as FormArray;
    if (elementArray.length > 1) {
      elementArray.removeAt(i);
    } else {
      elementArray.reset();
    }
  }

  addNewAnswer() {
    const elementArray = this.form.get('answers') as FormArray;
    elementArray.push(this.formBuilder.group({
      id: new FormControl(null, { validators: [Validators.required] }),
      text: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] })
    }));
  }
}
