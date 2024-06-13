"use client";
import { time } from "console";
import Button from "../ui/button/Button";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { useTranslations } from "next-intl";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useConfirmCode, useConfirmCodeRecovery } from "@/store";
import { auth } from "@/config/firebase.config";
import { any } from "zod";
import { Spinner } from "@nextui-org/react";

interface ITimer {
  time: number;
  className?: string;
  needReload: boolean;
  type: number;
  setNeedReload?: React.Dispatch<React.SetStateAction<boolean>>;
  ref?: any;
}

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    recaptchaWidgetId?: number;
  }
}

interface IRenderer {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
  needReload: boolean;
  type: number;
  setNeedReload?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICompletionist {
  completed: boolean;
  needReload: boolean;
  setNeedReload?: React.Dispatch<React.SetStateAction<boolean>>;
  type: number;
}

const Completionist = (props: ICompletionist) => {
  const [loading, setLoading] = useState<boolean>(false);
  let number = "";
  if (props.type == 1) number = useConfirmCode(state => state.number);
  else number = useConfirmCodeRecovery(state => state.number);
  const t = useTranslations("Completionist");
  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "resent", {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignUp();
          // ...
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        },
      });
    }
  }

  function onSignUp() {
    setLoading(true);
    onCaptchaVerify();
    const appVerifier = window.recaptchaVerifier;
    const auth = getAuth();
    signInWithPhoneNumber(auth, number, appVerifier as RecaptchaVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        updateConfirmResult(confirmationResult);
        updateTime(new Date().getTime());
        // ...
        setLoading(false);
      })
      .catch(error => {
        // Error; SMS not sent
        setLoading(false);

        // ...
      });
  }
  let updateTime = (startTime: any) => {};
  let updateConfirmResult = (confirmResult: any) => {};
  if (props.type == 1) {
    updateTime = useConfirmCode(state => state.updateStartTime);
    updateConfirmResult = useConfirmCode(state => state.updateConfirmResult);
  } else {
    updateTime = useConfirmCodeRecovery(state => state.updateStartTime);
    updateConfirmResult = useConfirmCodeRecovery(
      state => state.updateConfirmResult,
    );
  }
  const onSubmite = () => {
    if (props.setNeedReload && props.completed) {
      props.setNeedReload(true);
      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = undefined;
      onSignUp();
      console.log(props.completed);
    } else {
      console.log(props.completed);
    }
  };
  console.log("loading " + loading);
  return (
    <div className="sm:h-[60px] h-[40px] flex items-end">
      <Button
        id="resent"
        type="button"
        text={t("resentButtonTitle")}
        className="btn btn-secondary"
        onClick={onSubmite}
        disabled={loading}
      >
        {loading && (
          <Spinner
            color="default"
            size="sm"
            className="absolute -translate-x-[140%] "
          ></Spinner>
        )}
      </Button>
    </div>
  );
};

// const renderer = ({
//   hours,
//   minutes,
//   seconds,
//   completed,
//   setNeedReload,
//   needReload,
// }: IRenderer) => {
//   if (completed) {
//     // Render a completed state
//     return (
//       <Completionist
//         setNeedReload={setNeedReload}
//         completed={completed}
//         needReload={needReload}
//       />
//     );
//   } else {
//     // Render a countdown
//     return (
//       <span className="flex justify-center items-start h-[60px]  text-text-primary-color">
//         {minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:
//         {seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
//       </span>
//     );
//   }
// };

const Renderer = ({
  hours,
  minutes,
  seconds,
  completed,
  setNeedReload,
  needReload,
  type,
}: IRenderer) => {
  return (
    <>
      {completed && (
        <Completionist
          type={type}
          setNeedReload={setNeedReload}
          completed={completed}
          needReload={needReload}
        />
      )}
      {!completed && (
        <span className="flex justify-center items-start h-[40px] sm:h-[60px]  text-text-primary-color">
          {minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:
          {seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
        </span>
      )}
    </>
  );
};

export default function Timer(props: ITimer) {
  const [cdRef, setCdRef] = useState<Countdown | null>();
  useEffect(() => {
    console.log(cdRef?.isStarted());
    console.log(props.needReload);
    if (props.needReload) {
      cdRef?.start();
      if (props.setNeedReload) props.setNeedReload(false);
    } else if (!cdRef?.isCompleted() || !cdRef?.isStopped()) {
      cdRef?.start();
    }
  });
  return (
    <>
      <Countdown
        className={`timerClass ${props.className}`}
        date={Date.now() + props.time * 1000}
        ref={ref => {
          setCdRef(ref);
        }}
        renderer={args => {
          return (
            <Renderer
              type={props.type}
              hours={args.hours}
              minutes={args.minutes}
              seconds={args.seconds}
              completed={args.completed}
              needReload={props.needReload}
              setNeedReload={props.setNeedReload}
            />
          );
        }}
      />
    </>
  );
}
