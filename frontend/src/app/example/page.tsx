import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/ui/phone-number/phone-number";
import Checkbox from "@/components/ui/checkbox/checkbox";
import Radiobutton from "@/components/ui/button/radiobutton/radiobutton";
import MemoriesSign from "@/components/ui/memories-sign/memoriesSign";
import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";

export default function Home() {
  return (
    <>
      <NonRegLayout>
        <Button className="btn btn-primary" type="button" text="Search" />
        <Button className="btn btn-secondary" type="button" text="Popular" />
        <Input
          className="input input-primary"
          placeholder="Password"
          type="password"
        />
        <div>
          <Input
            className="input input-secondary"
            placeholder="number"
            type="tel"
          />
        </div>
        <div>
          <PhoneNumberInput />
        </div>
        <div>
          <Checkbox />
        </div>
        <div>
          <Radiobutton />
        </div>
        <div>
          <MemoriesSign />
        </div>
      </NonRegLayout>
    </>
  );
}
