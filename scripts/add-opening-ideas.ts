import fs from 'fs'
import path from 'path'
import { openingIdeas } from '../components/learn/opening-theory/OpeningIdeas'

type OpeningKey = keyof typeof openingIdeas

const openings = Object.keys(openingIdeas) as OpeningKey[]

openings.forEach(opening => {
  const pagePath = path.join('app/dashboard/learning/openings', opening, 'page.tsx')
  
  if (!fs.existsSync(pagePath)) {
    console.log(`Skipping ${opening} - page doesn't exist`)
    return
  }

  let content = fs.readFileSync(pagePath, 'utf8')
  
  const importStatement = `import { OpeningIdeas, openingIdeas } from "@/components/learn/opening-theory/OpeningIdeas"\n`
  content = content.replace(
    /import { Tooltip,/,
    importStatement + 'import { Tooltip,'
  )
  
  const openingIdeasComponent = `
              </div>
            </div>
            
            <OpeningIdeas ideas={openingIdeas['${opening}']} />
            
            <div className="space-y-4">`
  
  content = content.replace(
    /\s+<\/div>\s+<\/div>\s+<div className="space-y-4">/,
    openingIdeasComponent
  )
  
  fs.writeFileSync(pagePath, content)
  console.log(`Added opening ideas to ${opening}`)
})

console.log('Added opening ideas to all opening theory pages') 