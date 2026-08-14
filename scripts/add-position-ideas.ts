import fs from 'fs'
import path from 'path'
import { positionIdeas } from '../components/learn/middlegame-strategy/PositionIdeas'

type TopicKey = keyof typeof positionIdeas

const topics = Object.keys(positionIdeas) as TopicKey[]

topics.forEach(topic => {
  const pagePath = path.join('app/dashboard/learning/middlegame', topic, 'page.tsx')
  let content = fs.readFileSync(pagePath, 'utf8')
  
  const importStatement = `import { PositionIdeas, positionIdeas } from "@/components/learn/middlegame-strategy/PositionIdeas"\n`
  content = content.replace(
    /import { Tooltip,/,
    importStatement + 'import { Tooltip,'
  )
  
  const positionIdeasComponent = `
              </div>
            </div>
            
            <PositionIdeas ideas={positionIdeas['${topic}']} />
            
            <div className="space-y-4">`
  
  content = content.replace(
    /\s+<\/div>\s+<\/div>\s+<div className="space-y-4">/,
    positionIdeasComponent
  )
  
  fs.writeFileSync(pagePath, content)
})

console.log('Added position ideas to all middlegame pages') 