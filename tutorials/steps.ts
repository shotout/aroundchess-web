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

const PlayVsAISteps: any[] = [
  {
    target: "[data-tutorial='play-vs-ai-step-1']",
    title: "Play a Game and start your Analysis",
    content: "Visit “You vs AI” to play Chess against an AI opponent.",
    placement: "right",
    stepText: "1/7",
  },
  {
    target: "[data-tutorial='play-vs-ai-step-2']",
    title: "Play a Game and start your Analysis",
    content: "Click “Start a Game” to start playing Chess against an AI opponent.",
    placement: "bottom",
    stepText: "2/7",
  },
  {
    target: "[data-tutorial='play-vs-ai-step-3']",
    title: "Play a Game and start your Analysis",
    content: "Once your Game is finished, tap “Analyze Now”.",
    placement: "top",
    stepText: "3/7",
  },
  {
    target: "[data-tutorial='2']",
    title: "Play a Game and start your Analysis",
    content: "Choose your Analysis Depth. A deeper analysis depth considers more potential moves and will lead to a more sophisticated analysis.",
    placement: "top",
    stepText: "4/7",
  },
  {
    target: "[data-tutorial='3']",
    title: "Play a Game and start your Analysis",
    content: "Select “Quick Summary” for an easy to understand Analysis that explains your biggest mistakes and how to resolve them - we recommend this Analysis type for regular users. We suggest the “Chess Master Analysis” for users with an in-depth understanding of Chess.",
    placement: "top",
    stepText: "5/7",
  },
  {
    target: "[data-tutorial='4']",
    title: "Play a Game and start your Analysis",
    content: "Discover your biggest mistakes and get a suggestion how to avoid them in the future.",
    placement: "left",
    stepText: "6/7",
  },
  {
    target: "[data-tutorial='5']",
    title: "Play a Game and start your Analysis",
    content: "Swipe through the recommendations and implement the learnings into your Games.",
    placement: "top",
    stepText: "7/7",
  }
]

const PlayingVsAISteps: any[] = [
  {
    target: "[data-tutorial='play-vs-ai-step-3']",
    title: "Play a Game and start your Analysis",
    content: "Once your Game is finished, tap “Analyze Now”.",
    placement: "top",
    stepText: "3/7",
  },
  {
    target: "[data-tutorial='2']",
    title: "Play a Game and start your Analysis",
    content: "Choose your Analysis Depth. A deeper analysis depth considers more potential moves and will lead to a more sophisticated analysis.",
    placement: "top",
    stepText: "4/7",
  },
  {
    target: "[data-tutorial='3']",
    title: "Play a Game and start your Analysis",
    content: "Select “Quick Summary” for an easy to understand Analysis that explains your biggest mistakes and how to resolve them - we recommend this Analysis type for regular users. We suggest the “Chess Master Analysis” for users with an in-depth understanding of Chess.",
    placement: "top",
    stepText: "5/7",
  },
  {
    target: "[data-tutorial='4']",
    title: "Play a Game and start your Analysis",
    content: "Discover your biggest mistakes and get a suggestion how to avoid them in the future.",
    placement: "left",
    stepText: "6/7",
  },
  {
    target: "[data-tutorial='5']",
    title: "Play a Game and start your Analysis",
    content: "Swipe through the recommendations and implement the learnings into your Games.",
    placement: "top",
    stepText: "7/7",
  }
]

const tutorials: Record<string, any[]> = {
  "/my-game-history": AnalyzeGameSteps,
  "/playground/play-vs-ai": PlayVsAISteps,
  "/playground/play-vs-ai/playing": PlayVsAISteps
};

export default tutorials;
