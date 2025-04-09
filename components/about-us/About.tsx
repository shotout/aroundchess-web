"use client";
import Image from "next/image";
export default function About() {
  const ourValues = [
    {
      icon: "/icons/about-training.png",
      title: "Passion for Learning",
      description:
        "We believe in the power of continuous learning. Our resources and tools are designed to inspire curiosity and help players of all levels expand their skills and understanding of the game.",
    },
    {
      icon: "/icons/about-community.png",
      title: "Community-Centric Approach",
      description:
        "Chess is best enjoyed together. We are committed to fostering a supportive and collaborative community where players can share insights, challenge each other, and grow collectively.",
    },
    {
      icon: "/icons/about-chess.png",
      title: "Innovation and Excellence",
      description:
        "From AI-driven analysis to 3D board features, we strive to push the boundaries of what's possible in chess education and analysis. Our goal is to deliver cutting-edge tools that enhance your learning experience.",
    },
    {
      icon: "/icons/about-tutorials.png",
      title: "Integrity and Fair Play",
      description:
        "We uphold the principles of honesty and sportsmanship. Our platform is built to ensure a fair, respectful, and positive environment for all players.",
    },
  ];
  return (
    <div className="flex-1 flex-col p-4 sm:p-6 border-b bg-[#FCFCFD]">
      <Image
        src="/images/chess-3.jpg"
        alt="About Us"
        width={1000}
        height={1000}
        className="rounded-[8px] w-full h-[160px] sm:h-[240px] xl:h-[360px] object-cover"
      />
      <h2 className="text-xl lg:text-3xl font-semibold text-gray-900 my-4">
        About AroundChess
      </h2>
      <p className="text-sm sm:text-md lg:text-lg text-gray-700 mb-4">
        Welcome to aroundchess.com – your ultimate destination for chess
        analysis and learning! We are passionate about helping players of all
        levels, from beginners to masters, elevate their game. Our platform
        offers in-depth analysis, interactive lessons, and cutting-edge tools
        designed to enhance your skills and strategic thinking.
      </p>
      <p className="text-sm sm:text-md lg:text-lg text-gray-700 mb-4">
        With powerful AI-driven analysis, 3D board features, and expert-guided
        tutorials, we aim to make learning chess both engaging and effective.
        Whether you're refining your openings, mastering endgames, or just
        starting your journey, aroundchess.com has everything you need to
        progress confidently.
      </p>
      <p className="text-sm sm:text-md lg:text-lg text-gray-700 mb-4">
        Join our growing community of chess enthusiasts and unlock your full
        potential. Let's explore the world of chess, one move at a time!
      </p>
      <div className="border border-input my-4"/>
      <h3 className="text-xl lg:text-3xl font-semibold text-gray-900 mt-6 sm:mt-0">
        Supported by Community
      </h3>
      <p className="text-sm sm:text-md lg:text-lg text-gray-700 mt-4">
        At aroundchess.com, we believe that chess is more than just a game –
        it's a community-driven journey.
      </p>
      <p className="text-sm sm:text-md lg:text-lg text-gray-700 mt-4">
        Our platform thrives thanks to the passion and support of players
        worldwide who share their knowledge, feedback, and love for the game.
      </p>
      <p className="text-sm sm:text-md lg:text-lg text-gray-700 mt-4">
        Together, we’re building a vibrant space where every player can learn,
        share, and grow.
      </p>
      <div className="border border-input my-4"/>
      <div className="flex flex-col mt-6 sm:mt-0">
        <h2 className="text-xl lg:text-3xl font-semibold text-gray-900 my-4 sm:my-2">
          Our Values
        </h2>
        <div className="grid sm:grid-cols-2 mt-6 sm:mt-0 gap-6 sm:gap-2 sm:gap-4">
          {ourValues.map((value: any, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-2 sm:rounded-md sm:border sm:border-input px-4 sm:py-4"
              >
                <Image
                  src={value.icon}
                  alt={value.title}
                  width={1000}
                  height={1000}
                  className="w-[40px] h-[40px] sm:w-[] object-cover"
                />
                <h3 className="text-md sm:text-lg lg:text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-md lg:text-lg text-[#585858]">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border border-input my-4"/>
      <div className="my-6">
        <h2 className="text-xl lg:text-3xl font-semibold text-gray-900">
          Need Help?
        </h2>
        <p className="space-y-8 text-xs sm:text-md lg:text-lg text-gray-700 mt-2">
          If you have any questions, please{" "}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            check our FAQ
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            contact our amazing Member Support Team
          </a>{" "}
          and we will get back to you as fast as we can!
        </p>
      </div>

      <div>
        <h2 className="text-xl lg:text-3xl font-semibold text-gray-900">
          Any Feedback?
        </h2>
        <p className="text-xs sm:text-md lg:text-lg text-gray-700 mt-2">
          Did you encounter any issues on our Platform, would like to give us
          Feedback or even suggest an amazing Feature that you would like to see
          on AroundChess?{" "}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            Send us a Message
          </a>{" "}
          on our Feedback Form or{" "}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            get in Touch on our Discord!
          </a>
        </p>
      </div>
    </div>
  );
}
