import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function rafAsync() {
  return new Promise(resolve => {
      requestAnimationFrame(resolve); //faster than set time out
  });
}

export function checkElement(selector: string): any {
  if (document.querySelector(selector) === null) {
      return rafAsync().then(() => checkElement(selector));
  } else {
      return Promise.resolve(true);
  }
}
