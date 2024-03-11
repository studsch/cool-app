import TopBar from "@/components/topbar/topbar";
import Navbar from "@/components/nav-bar/nav-bar";
import Aside from "@/components/a-side/a-side";
import MyContacts from "@/components/my-contacts/my-contacts";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <TopBar />
      </header>
      <main className="md:w-[768px] xl:w-[1280px] mx-auto">
        <div className="flex gap-4 ">
          <Aside
            minWidth={768}
            className="p-7 my-5 w-[240px] flex flex-col rounded-md gap-4 h-fit bg-white "
          >
            <Navbar />
            <hr className="border-t-2 border-r-4 border-dashed w-[140px] mx-auto my-4" />
            <MyContacts />
          </Aside>
          {children}
        </div>
      </main>
    </>
  );
}
