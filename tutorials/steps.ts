
const AnalyzeGameSteps: any[] = [
  {
    target: "[data-tutorial='1']",
    title: "Analyze a Game",
    content: "Select the Game that you would like to analyze.",
    placement: "top",
    stepText: "1/5",
  },
  {
    target: "[data-tutorial='2']",
    title: "Analyze a Game",
    content: "Choose your Analysis Depth. A deeper analysis depth considers more potential moves and will lead to a more sophisticated analysis.",
    placement: "top",
    stepText: "2/5",
  },
  {
    target: "[data-tutorial='3']",
    title: "Analyze a Game",
    content: "Select “Quick Summary” for an easy to understand Analysis that explains your biggest mistakes and how to resolve them - we recommend this Analysis type for regular users. We suggest the “Chess Master Analysis” for users with an in-depth understanding of Chess.",
    placement: "top",
    stepText: "3/5",
  },
  {
    target: "[data-tutorial='4']",
    title: "Analyze a Game",
    content: "Discover your biggest mistakes and get a suggestion how to avoid them in the future.",
    placement: "left",
    stepText: "4/5",
  },
  {
    target: "[data-tutorial='5']",
    title: "Analyze a Game",
    content: "Swipe through the recommendations and implement the learnings into your Games.",
    placement: "top",
    stepText: "5/5",
  }
];
const historySteps: any[] = [
  {
    target: "[data-tutorial='4']",
    title: "How to start a Game Analysis",
    content:
      "Your game will be analyzed in the background. You can find the game in the “My Game History” tab.",
    placement: "top",
    stepText: "4/7",
  },
  {
    target: "[data-tutorial='5']",
    title: "How to start a Game Analysis",
    content:
      "You can find all of your past analyses and also start new game analyses in the “My Game History” tab.",
    placement: "top",
    stepText: "5/7",
  },
  {
    target: "[data-tutorial='6']",
    title: "How to start a Game Analysis",
    content: "Click here to open the analysis, once it’s ready.",
    placement: "top",
    stepText: "6/7",
  },
];

const tutorials: Record<string, any[]> = {
  // "/analysis": AnalyzeGameSteps,
  "/my-game-history": AnalyzeGameSteps,
};

export default tutorials;
