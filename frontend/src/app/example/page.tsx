import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import Checkbox from "@/components/ui/checkbox/checkbox";
import Radiobutton from "@/components/ui/radiobutton/radiobutton";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <div></div>
      </NonRegLayout>
    </>
  );
}
