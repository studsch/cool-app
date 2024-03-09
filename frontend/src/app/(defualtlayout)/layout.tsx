import TopBar from "@/components/topbar/topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <TopBar></TopBar>
      </header>
      <main>{children}</main>
    </>
  );
}
