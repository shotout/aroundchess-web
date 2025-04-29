export interface Question {
    question: string;
    answer: string[];
  }
  
  export interface Category {
    id: string;
    label: string;
    questions: Question[];
  }
  