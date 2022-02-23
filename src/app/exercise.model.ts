export interface Exercise {
  id: string;
  template: number;
  title: string;
  description: string;
  digram: string;
  object: string;
  senderDisplayName: string;
  senderEmail: string;
  time: string;
  toDisplayName: string;
  toEmail: string;
  body: string;
  rightAnswer: string;
  wrongAnswer: string;
  answers: [{
    id: string;
    text: string;
  }] | undefined | null;
}
