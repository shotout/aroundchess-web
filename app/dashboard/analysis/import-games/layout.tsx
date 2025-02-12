import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Import Games | Chess Analysis",
  description: "Import your chess games in PGN format for detailed analysis and insights.",
}

export default function ImportGamesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 