import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
