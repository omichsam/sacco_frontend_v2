import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SelectRolePage = lazy(() => import('@/pages/SelectRolePage'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const DirectorDashboard = lazy(() => import('@/pages/director/DirectorDashboard'))
const ChairmanDashboard = lazy(() => import('@/pages/chairman/ChairmanDashboard'))
const TreasuryDashboard = lazy(() => import('@/pages/treasury/TreasuryDashboard'))
const SecretaryDashboard = lazy(() => import('@/pages/secretary/SecretaryDashboard'))
const MembersPage = lazy(() => import('@/features/members/MembersPage'))
const LoansPage = lazy(() => import('@/features/loans/LoansPage'))
const SharesPage = lazy(() => import('@/features/shares/SharesPage'))
const DocumentsPage = lazy(() => import('@/features/documents/DocumentsPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-[#800000] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '10px', fontSize: '13px' },
          success: { iconTheme: { primary: '#800000', secondary: '#fff' } },
        }}
      />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* All protected routes — just requires login, no role guard */}
            <Route element={<ProtectedRoute />}>
              <Route path="/select-role" element={<SelectRolePage />} />

              {/* Admin */}
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} handle={{ title: 'Dashboard' }} />
                <Route path="/admin/members" element={<MembersPage />} handle={{ title: 'Members' }} />
                <Route path="/admin/loans" element={<LoansPage />} handle={{ title: 'Loans' }} />
                <Route path="/admin/shares" element={<SharesPage />} handle={{ title: 'Shares' }} />
                <Route path="/admin/documents" element={<DocumentsPage />} handle={{ title: 'Documents' }} />
              </Route>

              {/* Director */}
              <Route element={<DashboardLayout />}>
                <Route path="/director" element={<DirectorDashboard />} handle={{ title: 'Dashboard' }} />
                <Route path="/director/loans" element={<LoansPage />} handle={{ title: 'Loans' }} />
              </Route>

              {/* Chairman */}
              <Route element={<DashboardLayout />}>
                <Route path="/chairman" element={<ChairmanDashboard />} handle={{ title: 'Dashboard' }} />
                <Route path="/chairman/members" element={<MembersPage />} handle={{ title: 'Members' }} />
              </Route>

              {/* Treasury */}
              <Route element={<DashboardLayout />}>
                <Route path="/treasury" element={<TreasuryDashboard />} handle={{ title: 'Dashboard' }} />
                <Route path="/treasury/shares" element={<SharesPage />} handle={{ title: 'Shares' }} />
                <Route path="/treasury/loans" element={<LoansPage />} handle={{ title: 'Loans' }} />
              </Route>

              {/* Secretary */}
              <Route element={<DashboardLayout />}>
                <Route path="/secretary" element={<SecretaryDashboard />} handle={{ title: 'Dashboard' }} />
                <Route path="/secretary/members" element={<MembersPage />} handle={{ title: 'Members' }} />
                <Route path="/secretary/documents" element={<DocumentsPage />} handle={{ title: 'Documents' }} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
