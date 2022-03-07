export interface Result {
  exerciseId: string;
  exerciseTitle: string;
  traineeId: string;
  traineeName: string;
  sessionId: string;
  score: number;
  isCorrect: boolean | null;
  isPhishing: boolean | null;
}
