import "./css/style.css";
import { Inter } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import LegalModal from '@/components/legal-modal'; // <-- Ensure path correctness
import { ToastContainer } from 'react-toastify';

import Provider from './Provider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-gray-950 font-inter text-base text-gray-200`}>
        <Provider>
          <ToastContainer position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            <LegalModal /> {/* Add your modal here */}
            <main>{children}</main>
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
