import TopBar from "@/components/topbar/topbar";
import Navbar from "@/components/nav-bar/nav-bar";
import ServerList from "@/components/nav-bar/server-list";
import MyContacts from "@/components/my-contacts/my-contacts";
import { Toaster } from "@/components/ui/toaster";
import { useTranslations } from "next-intl";
export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("MyContacts");
  return (
    <>
      <header>
        <TopBar />
        <div className="h-unit-17"></div>
      </header>
      <main className="md:w-[768px] xl:w-[1280px] mx-auto h-full">
        <div className="flex gap-4 ">
          <div className="p-7 my-5 w-[240px] flex-col rounded-md gap-4 h-fit bg-white xl:flex hidden">
            <Navbar>
              <ServerList />
            </Navbar>
            <MyContacts>
              <hr className="border-t-2 border-r-4 border-dashed w-[140px] mx-auto my-4" />
              <h2 className="text-text-primary-color text-base weigh mx-auto w-fit font-semibold pb-4">
<<<<<<< HEAD:frontend/src/app/(defualtlayout)/layout.tsx
                Мои контакты
=======
                {t("title")}
>>>>>>> 1e3589219ccffa4fda297c555701542b02f6f9ef:frontend/src/app/[locale]/(defualtlayout)/layout.tsx
              </h2>
            </MyContacts>
          </div>
          {children}
        </div>
        <Toaster />
      </main>
    </>
  );
}
