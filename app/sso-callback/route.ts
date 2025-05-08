import { NextRequest, NextResponse } from 'next/server'
import { createClientForServer } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (!code) {
    console.log('No code found in callback URL')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
   await createClientForServer()
    
  
    return NextResponse.next()
  } catch (error) {
    console.error('Error processing OAuth callback:', error)
    return NextResponse.next()
  }
}