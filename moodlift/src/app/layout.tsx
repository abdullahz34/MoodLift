import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers"
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "MoodLift",
  description: "Wellbeing application made for FDM Group's Software Engineering Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>
          <Navbar /> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
