import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Modal } from './Modal'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  description: string
  confirmLabel?: string
  confirmWord?: string
  danger?: boolean
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmWord,
  danger = false,
}: Props) {
  const [typed, setTyped] = useState('')
  const [loading, setLoading] = useState(false)

  const canConfirm = !confirmWord || typed === confirmWord

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setLoading(false)
      setTyped('')
    }
  }

  function handleClose() {
    setTyped('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex gap-3">
          {danger && (
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
          )}
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        {confirmWord && (
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500">
              Type <span className="font-mono font-semibold text-gray-800">{confirmWord}</span> to confirm
            </p>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={confirmWord}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-colors"
            />
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-[#800000] hover:bg-[#a00000] text-white'
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
