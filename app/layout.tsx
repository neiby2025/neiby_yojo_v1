import "./globals.css";
import HamburgerMenu from "@/components/hamburger-menu";

export const metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <HamburgerMenu />
        {children}
      </body>
    </html>
  );
}
