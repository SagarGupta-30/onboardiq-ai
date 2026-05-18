import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: "OnboardIQ AI | Enterprise Compliance & Security Onboarding",
  description: "AI-powered employee onboarding compliance, automated risk checks, and SOC2/GDPR auditing posture management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased min-h-screen text-slate-100 bg-[#030014]">
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar Navigation */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top Navigation */}
              <Navbar />
              
              {/* Dynamic Pages */}
              <main className="flex-1 w-full">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
