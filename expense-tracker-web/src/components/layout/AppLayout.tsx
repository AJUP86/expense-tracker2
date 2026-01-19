import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit() {
    logout();
    navigate('/login');
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
        <span className="text-sm font-semibold">Expense Tracker</span>

        {/* Logout button only if user is logged in */}
        {user && (
          <button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
