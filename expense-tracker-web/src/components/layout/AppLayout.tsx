type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 flex items-center px-4">
        <span className="text-sm font-semibold">Expense Tracker</span>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
