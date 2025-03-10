const https = require('https')
const fs = require('fs')
const path = require('path')

const STOCKFISH_FILES = [
  {
    url: 'https://raw.githubusercontent.com/lichess-org/stockfish.wasm/master/stockfish.wasm',
    filename: 'stockfish.wasm'
  },
  {
    url: 'https://raw.githubusercontent.com/lichess-org/stockfish.wasm/master/stockfish.worker.js',
    filename: 'stockfish.worker.js'
  },
  {
    url: 'https://raw.githubusercontent.com/lichess-org/stockfish.wasm/master/stockfish.js',
    filename: 'stockfish.js'
  }
]

const PUBLIC_DIR = path.join(process.cwd(), 'public')

// Create public directory if it doesn't exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR)
}

// Download each Stockfish file
STOCKFISH_FILES.forEach(file => {
  https.get(file.url, (response) => {
    const fileStream = fs.createWriteStream(path.join(PUBLIC_DIR, file.filename))
    response.pipe(fileStream)
    fileStream.on('finish', () => {
      fileStream.close()
      console.log(`${file.filename} downloaded successfully!`)
    })
  }).on('error', (err) => {
    console.error(`Error downloading ${file.filename}:`, err)
  })
}) 