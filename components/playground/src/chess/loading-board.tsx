import { useThemeStore } from "../store/playground/theme-store"

export function LoadingBoard() {
  const { boardTheme } = useThemeStore()

  return (
    <div className="grid grid-cols-8 gap-0 border-2 border-gray-800">
      {Array.from({ length: 8 }).map((_, rowIndex) =>
        Array.from({ length: 8 }).map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-16 h-16 max-sm:h-10 max-sm:w-10 ${
              (rowIndex + colIndex) % 2 === 0
                ? boardTheme.light
                : boardTheme.dark
            } animate-pulse`}
          />
        ))
      )}
    </div>
  )
} 