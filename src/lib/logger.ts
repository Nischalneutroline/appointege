// import { createLogger, format, transports } from 'winston'

// // Check if running in browser
// const isBrowser = typeof window !== 'undefined'

// const logger = isBrowser
//   ? {
//       info: (message: string, meta?: any) =>
//         console.log(`[INFO] ${message}`, meta),
//       warn: (message: string, meta?: any) =>
//         console.warn(`[WARN] ${message}`, meta),
//       error: (message: string, meta?: any) =>
//         console.error(`[ERROR] ${message}`, meta),
//     }
//   : createLogger({
//       level: 'info',
//       format: format.combine(format.timestamp(), format.json()),
//       transports: [new transports.File({ filename: 'logs/app.log' })],
//     })

// export default logger
