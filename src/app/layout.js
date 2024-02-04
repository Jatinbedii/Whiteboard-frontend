import { Noto_Sans } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "WhiteBoard Chat Room",
  description:
    "Combination of Whiteboards and Rooms make WhiteBoard Chat Room App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
