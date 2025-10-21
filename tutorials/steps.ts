
const AnalysisModalSteps: any[] = [
  {
    target: "[data-tutorial='1']",
    title: "How to start a Game Analysis",
    content: "Select the game that you want to analyze. ",
    placement: "bottom",
    stepText: "1/7",
  },
  {
    target: "[data-tutorial='2']",
    title: "How to start a Game Analysis",
    content:
      "Choose your Analysis Depth. A deeper analysis depth considers more potential moves and will lead to a more sophisticated analysis.",
    placement: "top",
    stepText: "2/7",
  },
  {
    target: "[data-tutorial='3']",
    title: "How to start a Game Analysis",
    content:
      "After choosing your game and analysis depth, click on this button to start the analysis.",
    placement: "top",
    stepText: "3/7",
  },

  {
    target: "[data-tutorial='7']",
    title: "How to start a Game Analysis",
    content: "That’s it, time to discover your Game Analysis!",
    stepText: "7/7",
    placement: "top",
  },
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
  "/analysis": AnalysisModalSteps,
  "/my-game-history": historySteps,
};

export default tutorials;
