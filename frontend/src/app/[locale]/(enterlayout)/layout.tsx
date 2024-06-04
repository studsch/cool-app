import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";
import { NextPage } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return NonRegLayout({ children });
}
