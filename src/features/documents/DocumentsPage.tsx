import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, FileText, Trash2, CheckCircle, Clock, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/api/client'
import { formatDate } from '@/lib/utils'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import type { Document } from '@/types'
import type { PaginatedResponse } from '@/types'

async function getDocuments(): Promise<PaginatedResponse<Document>> {
  const { data } = await api.get('/documents/')
  return data
}

async function uploadDocument(file: File, documentType: string, memberId: string): Promise<Document> {
  const form = new FormData()
  form.append('file', file)
  form.append('document_type', documentType)
  form.append('member', memberId)
  const { data } = await api.post('/documents/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

async function deleteDocument(id: number): Promise<void> {
  await api.delete(`/documents/${id}/`)
}

const DOC_TYPES = [
  'National ID',
  'Passport',
  'KRA PIN',
  'Payslip',
  'Bank Statement',
  'Other',
]

export default function DocumentsPage() {
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('')
  const [memberId, setMemberId] = useState('')
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  const upload = useMutation({
    mutationFn: () => uploadDocument(selectedFile!, docType, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Document uploaded successfully')
      setSelectedFile(null)
      setDocType('')
      setMemberId('')
    },
    onError: () => toast.error('Failed to upload document. Please try again.'),
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Document deleted')
      setDeletingDoc(null)
    },
    onError: () => toast.error('Failed to delete document'),
  })

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setSelectedFile(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const canUpload = selectedFile && docType && memberId

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Documents</h2>
          <p className="text-sm text-gray-500">Upload and manage member documents</p>
        </div>

        {/* Upload zone */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Upload Document</h3>
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-[#800000] bg-[#800000]/5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={20} className="text-[#800000]" />
                  <span className="text-sm font-medium text-gray-800">{selectedFile.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                    className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    Drag & drop a file, or <span className="text-[#800000]">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20"
                >
                  <option value="">Select type…</option>
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Member ID</label>
                <input
                  type="text"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="Enter member ID"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20"
                />
              </div>
            </div>

            <button
              onClick={() => upload.mutate()}
              disabled={!canUpload || upload.isPending}
              className="w-full py-2.5 bg-[#800000] hover:bg-[#a00000] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {upload.isPending ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              Upload Document
            </button>
          </div>
        </div>

        {/* Document list */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">All Documents</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-100 rounded w-48 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
                </div>
              </div>
            ))}
            {!isLoading && data?.results.map((doc) => (
              <div key={doc.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#800000]/10 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-[#800000]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.document_type}</p>
                  <p className="text-xs text-gray-500">Uploaded {formatDate(doc.uploaded_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.verified ? (
                    <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <CheckCircle size={10} /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                      <Clock size={10} /> Pending
                    </span>
                  )}
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#800000] hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => setDeletingDoc(doc)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {!isLoading && !data?.results.length && (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No documents uploaded yet.</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={() => remove.mutateAsync(deletingDoc!.id)}
        title="Delete Document"
        description={`Permanently delete "${deletingDoc?.document_type}"? This cannot be undone.`}
        confirmLabel="Yes, Delete"
        danger
      />
    </>
  )
}
