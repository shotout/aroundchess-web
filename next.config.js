/** @type {import('next').NextConfig} */                                                                                                                                                                     
const nextConfig = {                                                                                                                                                                                         
  env: {                                                                                                                                                                                                     
    BASE_URL: process.env.BASE_URL,                                                                                                                                                                          
    BASE_URL_STAGING: process.env.BASE_URL_STAGING,                                                                                                                                                          
    BASE_URL_IP: process.env.BASE_URL_IP,                                                                                                                                                                    
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,                                                                                                                                                        
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY                                                                                                                                         
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  experimental: {                                                                                                                                                                                            
    missingSuspenseWithCSRBailout: false,                                                                                                                                                                    
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  async redirects() {                                                                                                                                                                                        
    return [                                                                                                                                                                                                 
      {                                                                                                                                                                                                      
        source: '/api/newsletter/unsubscribe',                                                                                                                                                               
        destination: 'https://ac-socialmedia.vercel.app/api/newsletter/unsubscribe',                                                                                                                         
        permanent: false,                                                                                                                                                                                    
      },                                                                                                                                                                                                     
    ]                                                                                                                                                                                                        
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  async headers() {                                                                                                                                                                                          
    return [                                                                                                                                                                                                 
      {                                                                                                                                                                                                      
        // matching all API routes                                                                                                                                                                           
        source: "/api/:path*",                                                                                                                                                                               
        headers: [                                                                                                                                                                                           
          { key: "Access-Control-Allow-Credentials", value: "true" },                                                                                                                                        
          { key: "Access-Control-Allow-Origin", value: "*" },                                                                                                                                                
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },                                                                                                               
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },                          
        ]                                                                                                                                                                                                    
      }                                                                                                                                                                                                      
    ]                                                                                                                                                                                                        
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  images: {                                                                                                                                                                                                  
    dangerouslyAllowSVG: true,                                                                                                                                                                               
    remotePatterns: [                                                                                                                                                                                        
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'img.clerk.com',                                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'images.clerk.dev',                                                                                                                                                                        
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'avatars.githubusercontent.com',                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'images.chesscomfiles.com',                                                                                                                                                                
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'placehold.co',                                                                                                                                                                            
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'api.chess.com',                                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'www.chess.com'                                                                                                                                                                            
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'cdn.chess.com',                                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'aroundchess-news.s3.amazonaws.com',                                                                                                                                                       
      }                                                                                                                                                                                                      
    ],                                                                                                                                                                                                       
  },                                                                                                                                                                                                         
}                                                                                                                                                                                                            
                                                                                                                                                                                                             
// Injected content via Sentry wizard below

import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "aroundchess",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
