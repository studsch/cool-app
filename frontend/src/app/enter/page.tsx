import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/ui/phone-number/phone-number";
import Checkbox from "@/components/ui/checkbox/checkbox";
import Radiobutton from "@/components/ui/button/radiobutton/radiobutton";
import MemoriesSign from "@/components/ui/memories-sign/memoriesSign";
import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";

export default function Enter() {
  return (
    <div className="w-full h-[65vh] sm:min-w-[700px] sm:min-h-[400px] sm:h-[50vh] m-auto lg:w-4/6 lg:h-[50vh] flex relative z-10 shadow-3xl rounded-md overflow-hidden">
      <div className="w-full h-full bg-white relative"></div>
      <div className="w-full sm:block hidden h-full bg-gradient-to-b from-text-reg-primary-color to-reg-gradient-down relative"></div>
    </div>
  );
}
