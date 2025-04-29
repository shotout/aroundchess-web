import { Category, Question } from "./types";

export function searchFAQs(
  data: Category[],
  query: string
): { id: string; label: string; questions: Question[] }[] {
  if (!query.trim()) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();

  return data
    .map((category) => {
      const matchedQuestions = category.questions.filter((item) => {
        // Search in questions
        if (item.question.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // Search in answers
        return item.answer.some((answer) =>
          answer.toLowerCase().includes(searchTerm)
        );
      });

      return {
        id: category.id,
        label: category.label,
        questions: matchedQuestions,
      };
    })
    .filter((result) => result.questions.length > 0);
}
