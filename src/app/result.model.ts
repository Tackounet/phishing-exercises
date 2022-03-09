export interface Result {
  exerciseId: string;
  exerciseTitle: string;
  traineeId: string;
  traineeName: string;
  sessionId: string;
  score: number;
  answers: string[];
  isCorrect: boolean | null;
  isPhishing: boolean | null;
}
