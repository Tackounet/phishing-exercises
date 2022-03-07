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
  legitimate: boolean;
  rightAnswer: {
    text: string;
    items: {
      id: string;
      text: string;
      score: number;
    }[];
  };
  wrongAnswer: {
    text: string;
    items: {
      id: string;
      text: string;
      score: number;
    }[];
  };
}
