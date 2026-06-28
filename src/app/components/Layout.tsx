import { ReactNode } from 'react';

interface LayoutProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export default function Layout({ title, subtitle, children }: LayoutProps) {
  return (
    <main className="min-h-screen lg:ml-80 bg-white">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        {children || (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600">No data available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
