import React from "react";
import RegDataForm from "@/components/reg-data-form/reg-data-form";
import Button from "@/components/ui/button/Button";

export default function page() {
  return (
    <div>
      <p className="text-text-primary-color h-20 font-light">
        Enter additional information, it will help other people to find you.
      </p>
      <h2 className="text-text-primary-color h-14 text-xl">
        Additional information
      </h2>
      <RegDataForm>
        <Button
          type="submit"
          text="Create account"
          className="btn btn-primary"
        />
      </RegDataForm>
    </div>
  );
}
