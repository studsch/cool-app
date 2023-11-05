import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import { Checkbox } from "@nextui-org/react";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import EnterToggleLink from "@/components/ui/links/enter-toggle-link";
import LogForm from "@/components/log-form/log-form";
import RegForm from "@/components/reg-form/reg-form";

export default function Enter() {
  return (
    <>
      <div className="w-full h-[80vh] 2xl:w-[1000px]  2xl:h-[640px] md:h-[500px] sm:h-[460px] lg:w-[800px] m-auto flex relative z-10 shadow-3xl rounded-xl sm:rounded-md overflow-hidden">
        <div
          id="log-window"
          className="py-10 w-full px-unit-sm sm:px-unit-xl lg:px-unit-2xl h-full bg-white relative flex flex-col justify-center items-center overflow-auto "
        >
          <h1 className="w-0 h-0 overflow-hidden">Memories</h1>
          <MemoriesSign className="md:h-24 h-16" />
          <div className="w-full flex flex-col">
            <p className="h-5 md:h-6 sm:h-4 text-center text-sm font-light text-text-reg-secondary-color">
              Nice to see you again
            </p>
            <p className="h-12 md:h-16 sm:h-12 text-center text-2xl text-text-reg-secondary-color">
              Welcome back!
            </p>
            <LogForm>
              <div className="mb-2 px-1 flex justify-between items-center md:h-auto sm:mb-1 sm:h-14 md:mb-2 md:mt-8 py-2">
                <h5 className="hover:underline cursor-pointer text-link-primary-color text-sm font-light">
                  Forgot password?
                </h5>
                <h5 className="text-end hover:underline cursor-pointer text-link-primary-color text-sm font-light">
                  Sign in with phone
                </h5>
              </div>
            </LogForm>
            {/* <div className="w-full flex flex-col gap-4">
              <Input
                className="input input-primary w-full"
                placeholder="Login"
                type="text"
              />
              <Input
                className="input input-primary w-full"
                placeholder="Password"
                type="password"
              />
            </div> */}
            {/* <div className="mb-2 px-1 flex justify-between items-end md:h-auto sm:mb-1 sm:h-14 md:mb-2 md:mt-8 py-2">
              <h5 className="hover:underline cursor-pointer text-link-primary-color text-sm font-light">
                Forgot password?
              </h5>
              <h5 className="text-end hover:underline cursor-pointer text-link-primary-color text-sm font-light">
                Sign in with phone
              </h5>
            </div>
            <Button
              className="btn btn-primary w-full"
              type="button"
              text="Sigh in"
            /> */}
            <EnterToggleLink
              text="Create account"
              className="sm:hidden h-[6vh] sm:h-6 md:h-12 flex items-end md:items-center hover:underline cursor-pointer text-link-primary-color text-sm font-light"
            />
          </div>
        </div>
        <div
          id="reg-window"
          className="hidden py-10 px-unit-sm justify-center w-full sm:px-unit-xl lg:px-unit-2xl sm:flex flex-col  h-full bg-gradient-to-b from-text-reg-primary-color to-reg-gradient-down relative"
        >
          <h4 className="h-16 md:h-24 md:py-3 text-center font-extralight  text-text-reg-white-color">
            Register to have more functionality and post photos
          </h4>
          <div className="w-full flex flex-col">
            <hr className="mx-auto w-2/6 md:h-6 sm:h-4 h-5" />
            <h3
              id="create-acc-link"
              className="h-12 md:h-16 sm:h-12 text-center text-2xl text-text-reg-white-color"
            >
              Create account!
            </h3>
            <RegForm>
              <Checkbox
                classNames={{
                  base: "m-0 md:mb-2 md:mt-8 sm:h-14 sm:mb-1 md:h-auto px-1 mb-2 flex items-center",
                  wrapper: "checkbox-wrapper-secondary",
                  icon: "checkbox-icon-secondary",
                  label:
                    "text-text-reg-white-color text-sm font-light hover:text-place-holder-color my-auto",
                }}
                radius="none"
                size="sm"
              >
                Accept confident will push to all people
              </Checkbox>
            </RegForm>
            {/* <div className="flex flex-col gap-4 ">
              <PhoneNumberInput className="phone phone-secondary" />
              <div>
                <Input
                  type="text"
                  placeholder="Login"
                  className="input input-secondary w-full"
                />
              </div>
            </div> */}
            {/* <Checkbox
              classNames={{
                base: "test m-0 md:mb-2 md:mt-8 sm:h-14 sm:mb-1 md:h-auto px-1 mb-2 flex items-end",
                wrapper: "checkbox-wrapper-secondary",
                icon: "checkbox-icon-secondary",
                label:
                  "text-text-reg-white-color text-sm font-light hover:text-place-holder-color",
              }}
              radius="none"
              size="sm"
            >
              Accept confident will push to all people
            </Checkbox>
            <Button
              text="Sign up"
              type="button"
              className="btn btn-secondary w-full"
            /> */}
            <EnterToggleLink
              text="Login"
              className="sm:hidden h-[6vh] flex sm:h-6 md:h-12 items-end md:items-center hover:underline cursor-pointer text-text-reg-white-color  text-sm font-light"
            />
          </div>
        </div>
      </div>
    </>
  );
}
