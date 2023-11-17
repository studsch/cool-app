import { useEffect, useState } from "react";
import Countdown from "react-countdown";

interface ITimer {
  time: number;
  className?: string;
}

interface IRenderer {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const Completionist = () => <span>You are good to go!</span>;

const renderer = ({ hours, minutes, seconds, completed }: IRenderer) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span className="flex justify-center !m-0">
        {minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}:
        {seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
      </span>
    );
  }
};

export default function Timer(props: ITimer) {
  return (
    <>
      <Countdown
        className={props.className}
        date={Date.now() + props.time * 1000}
        renderer={renderer}
      ></Countdown>
    </>
  );
}
