"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { FileUpload } from "./file-upload"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react"

export interface ImportExportProps {
  onImport?: (file: File, options: ImportOptions) => Promise<ImportResult>
  onExport?: (options: ExportOptions) => Promise<void>
  supportedFormats?: string[]
  className?: string
}

export interface ImportOptions {
  format: string
  hasHeaders: boolean
  delimiter?: string
  encoding?: string
}

export interface ExportOptions {
  format: string
  includeHeaders: boolean
  selectedFields?: string[]
  filters?: Record<string, any>
}

export interface ImportResult {
  success: boolean
  message: string
  imported: number
  errors: string[]
}

export function ImportExport({
  onImport,
  onExport,
  supportedFormats = ["csv", "xlsx", "json"],
  className,
}: ImportExportProps) {
  const [showImportModal, setShowImportModal] = React.useState(false)
  const [showExportModal, setShowExportModal] = React.useState(false)
  const [importFile, setImportFile] = React.useState<File | null>(null)
  const [importOptions, setImportOptions] = React.useState<ImportOptions>({
    format: "csv",
    hasHeaders: true,
    delimiter: ",",
    encoding: "utf-8",
  })
  const [exportOptions, setExportOptions] = React.useState<ExportOptions>({
    format: "csv",
    includeHeaders: true,
  })
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [result, setResult] = React.useState<ImportResult | null>(null)

  const formatOptions = supportedFormats.map((format) => ({
    value: format,
    label: format.toUpperCase(),
  }))

  const handleImport = async () => {
    if (!importFile || !onImport) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 20, 90))
    }, 500)

    try {
      const result = await onImport(importFile, importOptions)
      setResult(result)
      setProgress(100)
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Import failed",
        imported: 0,
        errors: [error.message || "Unknown error"],
      })
    } finally {
      clearInterval(progressInterval)
      setIsProcessing(false)
    }
  }

  const handleExport = async () => {
    if (!onExport) return

    setIsProcessing(true)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 25, 90))
    }, 300)

    try {
      await onExport(exportOptions)
      setProgress(100)
      setShowExportModal(false)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      clearInterval(progressInterval)
      setIsProcessing(false)
    }
  }

  const resetImport = () => {
    setImportFile(null)
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
  }

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {onImport && (
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        )}
        {onExport && (
          <Button variant="outline" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false)
          resetImport()
        }}
        title="Import Data"
        description="Upload a file to import data into the system"
        size="lg"
      >
        <div className="space-y-6">
          {!result && (
            <>
              <FileUpload
                accept={supportedFormats.map((f) => `.${f}`).join(",")}
                onFilesChange={(files) => setImportFile(files[0] || null)}
                label="Select File"
                helperText={`Supported formats: ${supportedFormats.join(", ").toUpperCase()}`}
                maxFiles={1}
              />

              {importFile && (
                <div className="space-y-4">
                  <Select
                    label="Format"
                    value={importOptions.format}
                    onValueChange={(value) => setImportOptions((prev) => ({ ...prev, format: value }))}
                    options={formatOptions}
                  />

                  <Checkbox
                    label="File has headers"
                    checked={importOptions.hasHeaders}
                    onCheckedChange={(checked) => setImportOptions((prev) => ({ ...prev, hasHeaders: checked }))}
                  />

                  {importOptions.format === "csv" && (
                    <Select
                      label="Delimiter"
                      value={importOptions.delimiter}
                      onValueChange={(value) => setImportOptions((prev) => ({ ...prev, delimiter: value }))}
                      options={[
                        { value: ",", label: "Comma (,)" },
                        { value: ";", label: "Semicolon (;)" },
                        { value: "\t", label: "Tab" },
                        { value: "|", label: "Pipe (|)" },
                      ]}
                    />
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </>
          )}

          {result && (
            <div className="space-y-4">
              <div
                className={`flex items-start space-x-3 p-4 rounded-lg ${result.success ? "bg-green-50" : "bg-red-50"}`}
              >
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                    {result.success ? "Import Successful" : "Import Failed"}
                  </p>
                  <p className={`text-sm ${result.success ? "text-green-700" : "text-red-700"}`}>{result.message}</p>
                  {result.success && <p className="text-sm text-green-700">Imported {result.imported} records</p>}
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-800">Errors:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowImportModal(false)
                resetImport()
              }}
            >
              {result ? "Close" : "Cancel"}
            </Button>
            {!result && (
              <Button onClick={handleImport} disabled={!importFile || isProcessing}>
                {isProcessing ? "Processing..." : "Import"}
              </Button>
            )}
            {result && !result.success && (
              <Button onClick={resetImport} variant="outline">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Data"
        description="Configure export settings and download your data"
        size="md"
      >
        <div className="space-y-6">
          <Select
            label="Format"
            value={exportOptions.format}
            onValueChange={(value) => setExportOptions((prev) => ({ ...prev, format: value }))}
            options={formatOptions}
          />

          <Checkbox
            label="Include headers"
            checked={exportOptions.includeHeaders}
            onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, includeHeaders: checked }))}
          />

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Preparing export...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowExportModal(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isProcessing}>
              {isProcessing ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
