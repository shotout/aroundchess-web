interface CheckmateCategoryItemProps {
  movesToCheckmate: number;
  positionsCount: number;
  onCategorySelect: (movesToCheckmate: number) => void;
}

export const CheckmateCategoryItem: React.FC<CheckmateCategoryItemProps> = ({
  movesToCheckmate,
  positionsCount,
  onCategorySelect,
}) => {
  return (
    <div className="rounded-xl p-4 border border-gray-200 bg-white flex items-center hover:shadow-md transition-all h-40 xl:min-w-[343px]">
      <div className="flex w-full h-full border rounded-md p-3">
        <div className="w-3/5 flex flex-col justify-center">
          <h3 className="font-semibold text-lg mb-3">
            Checkmate in {movesToCheckmate}
          </h3>
          <button
            onClick={() => onCategorySelect(movesToCheckmate)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 hover:bg-blue-700 transition-colors whitespace-nowrap w-fit"
          >
            <div className="flex">
              <h1>Play this set</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
        <div className="w-2/5 flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
