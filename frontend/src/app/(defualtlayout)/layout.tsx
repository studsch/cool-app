import TopBar from "@/components/topbar/topbar";
import Navbar from "@/components/nav-bar/nav-bar";
import Aside from "@/components/a-side/a-side";
import MyContacts from "@/components/my-contacts/my-contacts";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <TopBar></TopBar>
      </header>
      <main className="md:w-[768px] mx-auto">
        <div className="flex gap-4 w-[80%]">
          <Aside className="p-7 my-5 w-[200px] md:w-[240px] lg:w-[300px] flex flex-col rounded-md gap-4 bg-white ">
            <Navbar />
            <hr className="border-t-2 border-r-4 border-dashed w-[140px] mx-auto my-4" />
            <MyContacts />
          </Aside>
        </div>
        {children}
      </main>
    </>
  );
}
