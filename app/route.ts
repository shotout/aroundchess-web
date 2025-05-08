import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  
  if (code || error) {
    const callbackUrl = `/sso-callback${url.search}`
    return redirect(callbackUrl)
  }
  
  return null
}