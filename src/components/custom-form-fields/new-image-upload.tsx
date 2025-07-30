'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { useFormContext, useController } from 'react-hook-form'

// Default configuration
const DEFAULT_MAX_SIZE_MB = 5
const SUPPORTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp'

interface NewImageUploadProps {
  name: string // Form field name
  label?: string // Input label
  className?: string // Additional CSS classes
  accept?: string // Accepted file types (MIME types)
  maxSizeMB?: number // Maximum file size in MB
  aspectRatio?: 'square' | 'video' | 'auto' // Preview aspect ratio
  required?: boolean // Whether the field is required
}

/**
 * A reusable file upload component with drag-and-drop support and image preview.
 * Features include:
 * - Drag and drop interface
 * - File type and size validation
 * - Image preview
 * - Loading state with progress
 * - Error handling
 * - Responsive design
 * - Full accessibility support
 */
export function NewImageUpload({
  name,
  label,
  className,
  accept = SUPPORTED_IMAGE_TYPES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  aspectRatio = 'square',
  required = false,
}: NewImageUploadProps) {
  // State management
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showRemove, setShowRemove] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form integration
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control: useFormContext().control,
    rules: {
      required: required ? 'This field is required' : false,
      validate: {
        fileSize: (f: File) =>
          !f ||
          f.size <= maxSizeMB * 1024 * 1024 ||
          `Max file size is ${maxSizeMB}MB`,
        fileType: (f: File) =>
          !f ||
          accept.split(',').some((t) => {
            const type = t.trim()
            return type.endsWith('/*')
              ? f.type.startsWith(type.split('/*')[0])
              : f.type === type
          }) ||
          `Only ${accept} files are allowed`,
      },
    },
  })

  /**
   * Simulates file upload progress
   */
  const simulateUpload = useCallback(() => {
    setIsUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsUploading(false), 300)
          return 100
        }
        return p + 10
      })
    }, 100)
  }, [])

  /**
   * Validates and processes the selected file
   * @param file - The file to process
   * @returns Error message if validation fails, null otherwise
   */
  const processFile = useCallback(
    (file: File) => {
      // Validate file type
      const isValidType = accept.split(',').some((t) => {
        const type = t.trim()
        return type.endsWith('/*')
          ? file.type.startsWith(type.split('/*')[0])
          : file.type === type
      })

      if (!isValidType) return `Invalid file type. Allowed: ${accept}`
      if (file.size > maxSizeMB * 1024 * 1024)
        return `File too large. Max: ${maxSizeMB}MB`

      // Read file and set preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        field.onChange(file)
        simulateUpload()
      }
      reader.onerror = () => 'Error reading file'
      reader.readAsDataURL(file)
      return null
    },
    [accept, maxSizeMB, field, simulateUpload],
  )

  /**
   * Handles drag events for the drop zone
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  /**
   * Handles file drop event
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      handleDrag(e)
      const file = e.dataTransfer.files?.[0]
      if (file) processFile(file)
    },
    [handleDrag, processFile],
  )

  /**
   * Handles file selection via input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  /**
   * Removes the selected file
   */
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    field.onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Update preview when field value changes
  useEffect(() => {
    if (typeof field.value === 'string') {
      setPreview(field.value)
    } else if (field.value instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(field.value)
    } else {
      setPreview(null)
    }
  }, [field.value])

  // Format accepted file types for display
  const fileTypes =
    accept === 'image/*'
      ? 'PNG, JPG, GIF, WEBP'
      : accept
          .split(',')
          .map((t) => t.trim().split('/').pop()?.toUpperCase())
          .join(', ')

  return (
    <div className={cn('space-y-2 w-full', className)}>
      {/* Input Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'group relative border-2 border-dashed rounded-md transition-all duration-300 bg-primary/10 cursor-pointer',
          'hover:border-primary/60 hover:bg-primary/5',
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300',
          error ? 'border-red-500' : '',
          preview ? 'p-2' : 'p-4',
          'max-w-[250px]', // Limit maximum width
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === 'Enter' || e.key === ' ') &&
          (e.preventDefault(), fileInputRef.current?.click())
        }
        aria-label={`Upload ${label}`}
      >
        {/* Hidden file input */}
        <input
          ref={(e) => {
            field.ref(e)
            if (fileInputRef) (fileInputRef as any).current = e
          }}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />

        {isUploading ? (
          // Loading State
          <div
            className="animate-fade-in flex flex-col items-center justify-center space-y-4 p-4"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-sm text-gray-600">
              Uploading... <span aria-hidden="true">{progress}%</span>
              <span className="sr-only">{progress} percent complete</span>
            </p>
          </div>
        ) : preview ? (
          // Preview State
          <div
            className="relative group/image transition-all duration-300"
            onMouseEnter={() => setShowRemove(true)}
            onMouseLeave={() => setShowRemove(false)}
          >
            <img
              src={preview}
              alt={`Preview of ${label}`}
              className={cn(
                'w-full h-24 object-contain rounded transition-all duration-300',
                aspectRatio === 'square' ? 'aspect-square' : 'aspect-video',
              )}
            />
            <button
              type="button"
              onClick={removeFile}
              className={cn(
                'absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm',
                'hover:bg-red-600 transition-all duration-300 focus:outline-none',
                'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                showRemove ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
              )}
              aria-label={`Remove ${label}`}
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          // Empty State
          <div
            className="flex flex-col items-center justify-center space-y-2 text-center "
            aria-hidden={!!preview}
          >
            <div
              className="p-2 rounded-full text-primary transition-all duration-300 group-hover:bg-primary/20"
              aria-hidden="true"
            >
              <FiUpload className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-gray-900">
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                {fileTypes} up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="mt-2 animate-fade-in"
            role="alert"
            aria-live="assertive"
          >
            <p className="text-sm text-red-600 text-center">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
