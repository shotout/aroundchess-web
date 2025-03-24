'use client'
import { useState } from 'react'

export default function Home() {
  const [apiType, setApiType] = useState<string>('') 
  const [username, setUsername] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [month, setMonth] = useState<string>('')

  const [result, setResult] = useState<any>(null)  
  const [error, setError] = useState<string>('')   

  const handleApiTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApiType(e.target.value)
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      setError('Username is required')
      return
    }

    let apiEndpoint = ''
    if (apiType === 'monthlyGames') {
      if (!year || !month) {
        setError('Year and month are required for Monthly Games')
        return
      }
      apiEndpoint = `/api/chess/monthlyGames?username=${username}&year=${year}&month=${month}`
    } else {
      apiEndpoint = `/api/chess/${apiType}?username=${username}`
    }

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, year, month }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await res.json()

      setResult(data)
      setError('')  
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch data')
      setResult(null) 
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">chess.com Fetcher</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiType" className="block text-sm font-medium text-gray-700">Select API:</label>
          <select
            id="apiType"
            value={apiType}
            onChange={handleApiTypeChange}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select API</option>
            <option value="stats">Stats</option>
            <option value="clubs">Clubs</option>
            <option value="games">Games</option>
            <option value="monthlyGames">Monthly Games</option>
          </select>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {apiType === 'monthlyGames' && (
          <>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year:</label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month:</label>
              <input
                type="number"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        <div>
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Fetch Data
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}  
      
      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Data Result:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
