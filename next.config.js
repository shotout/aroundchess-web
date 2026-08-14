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
    webpackMemoryOptimizations: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { dev }) => {
    if (!dev) config.cache = false;
    return config;
  },

  async redirects() {
    return [
      {
        source: '/api/newsletter/unsubscribe',
        destination: 'https://ac-socialmedia.vercel.app/api/newsletter/unsubscribe',
        permanent: false,
      },
      {
        source: '/play-practice',
        destination: '/play',
        permanent: true,
      },
    ]
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  async headers() {                                                                                                                                                                                          
    return [                                                                                                                                                                                                 
      {                                                                                                                                                                                                      
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
                                                                                                                                                                                                             
import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {

  org: "aroundchess",
  project: "javascript-nextjs",

  silent: !process.env.CI,

  widenClientFileUpload: false,

  tunnelRoute: "/monitoring",

  webpack: {
    automaticVercelMonitors: true,

    treeshake: {
      removeDebugLogging: true,
    },
  },
});
