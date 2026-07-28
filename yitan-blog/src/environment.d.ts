declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      POSTGRES_URL: string
      BLOB_READ_WRITE_TOKEN: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
    }
  }
}

declare module '@payloadcms/next/css'

export {}
