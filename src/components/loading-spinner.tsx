import { cn } from '@/lib/utils'

// src/components/loading-spinner.tsx
export default function LoadingSpinner({
  text,
  className,
}: {
  className?: string
  text?: string
}) {
  if (text) {
    return (
      <div className={cn('flex gap-2', className)}>
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
          />
        </svg>
        {text && <span>{text}</span>}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-content-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}
