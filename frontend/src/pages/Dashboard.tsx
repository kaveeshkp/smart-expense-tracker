import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

const Dashboard = () => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Smart Expense Tracker</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">Dashboard</h2>
          <p className="text-white/70">Welcome to your expense tracker. Coming soon: expense management features.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
