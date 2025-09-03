"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ConfirmationDialog } from "./confirmation-dialog"
import { Trash2, Download, Mail, Archive } from "lucide-react"

export interface BulkAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: "default" | "destructive"
  requiresConfirmation?: boolean
  confirmationTitle?: string
  confirmationDescription?: string
}

export interface BulkActionsProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: () => void
  onClearSelection: () => void
  onAction: (actionId: string, selectedItems: string[]) => Promise<void>
  actions?: BulkAction[]
  className?: string
}

const defaultActions: BulkAction[] = [
  {
    id: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
    requiresConfirmation: true,
    confirmationTitle: "Delete Selected Items",
    confirmationDescription: "Are you sure you want to delete the selected items? This action cannot be undone.",
  },
  {
    id: "export",
    label: "Export",
    icon: <Download className="h-4 w-4" />,
  },
  {
    id: "email",
    label: "Send Email",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "archive",
    label: "Archive",
    icon: <Archive className="h-4 w-4" />,
    requiresConfirmation: true,
    confirmationTitle: "Archive Selected Items",
    confirmationDescription: "Are you sure you want to archive the selected items?",
  },
]

export function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  onAction,
  actions = defaultActions,
  className,
}: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = React.useState("")
  const [confirmationDialog, setConfirmationDialog] = React.useState<{
    isOpen: boolean
    action?: BulkAction
  }>({ isOpen: false })
  const [isLoading, setIsLoading] = React.useState(false)

  const handleAction = async (actionId: string) => {
    const action = actions.find((a) => a.id === actionId)
    if (!action) return

    if (action.requiresConfirmation) {
      setConfirmationDialog({ isOpen: true, action })
    } else {
      await executeAction(actionId)
    }
  }

  const executeAction = async (actionId: string) => {
    setIsLoading(true)
    try {
      await onAction(actionId, selectedItems)
      onClearSelection()
      setSelectedAction("")
    } catch (error) {
      console.error("Bulk action failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmAction = async () => {
    if (confirmationDialog.action) {
      await executeAction(confirmationDialog.action.id)
      setConfirmationDialog({ isOpen: false })
    }
  }

  if (selectedItems.length === 0) return null

  return (
    <>
      <div
        className={`flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg ${className}`}
      >
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {selectedItems.length} of {totalItems} selected
          </Badge>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={selectedAction}
            onValueChange={setSelectedAction}
            placeholder="Choose action..."
            options={actions.map((action) => ({
              value: action.id,
              label: action.label,
            }))}
          />
          <Button
            onClick={() => selectedAction && handleAction(selectedAction)}
            disabled={!selectedAction || isLoading}
            variant={actions.find((a) => a.id === selectedAction)?.variant}
          >
            {isLoading ? "Processing..." : "Apply"}
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog({ isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmationDialog.action?.confirmationTitle || "Confirm Action"}
        description={confirmationDialog.action?.confirmationDescription || "Are you sure you want to proceed?"}
        variant={confirmationDialog.action?.variant === "destructive" ? "destructive" : "default"}
        loading={isLoading}
      />
    </>
  )
}
