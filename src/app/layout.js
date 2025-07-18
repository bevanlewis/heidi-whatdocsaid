import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Heidi App",
  description: "Heidi App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
