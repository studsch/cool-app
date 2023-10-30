import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/ui/phone-number/phone-number";
import Checkbox from "@/components/ui/checkbox/checkbox";
import Radiobutton from "@/components/ui/button/radiobutton/radiobutton";
import MemoriesSign from "@/components/ui/memories-sign/memoriesSign";
import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";

export default function Enter() {
  return (
    <div className="container h-full flex relative">
      <div className="w-3/6 h-4/6 bg-white"></div>
      <div className="w-3/6 h-4/6 bg-pink"></div>
    </div>
  );
}
