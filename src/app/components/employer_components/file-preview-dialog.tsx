"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FilePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: {
    fileName: string
    contentType: string
    url?: string
  } | null
}

export function FilePreviewDialog({
  open,
  onOpenChange,
  file
}: FilePreviewDialogProps) {
  if (!file) return null

  const isImage = file.contentType.startsWith('image/')
  const isPDF = file.contentType === 'application/pdf'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border border-gray-200">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-gray-900 pr-8">{file.fileName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          {isImage ? (
            <img 
              src={file.url || "/placeholder.svg"} 
              alt={file.fileName}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          ) : isPDF ? (
            <iframe
              src={file.url || "/placeholder.svg"}
              className="w-full h-[70vh] border-0"
              title={file.fileName}
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Preview not available</p>
                <p className="text-sm text-gray-500">{file.contentType}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
