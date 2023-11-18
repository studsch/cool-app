"use client";
import { time } from "console";
import Button from "../ui/button/Button";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { render } from "react-dom";
import { LegacyRef } from "react";

interface ITimer {
  time: number;
  className?: string;
  needReload: boolean;
  setNeedReload?: React.Dispatch<React.SetStateAction<boolean>>;
  ref?: any;
}

interface IRenderer {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
  needReload: boolean;
  setNeedReload?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICompletionist {
  completed: boolean;
  needReload: boolean;
  setNeedReload?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Completionist = (props: ICompletionist) => {
  const onSubmite = () => {
    if (props.setNeedReload && props.completed) {
      props.setNeedReload(true);
      console.log(props.completed);
    } else {
      console.log(props.completed);
    }
  };

  return (
    <div className="sm:h-[60px] h-[40px] flex items-end">
      <Button
        type="button"
        text="Resent"
        className="btn btn-secondary"
        onClick={onSubmite}
      />
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
}: IRenderer) => {
  return (
    <>
      {completed && (
        <Completionist
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
