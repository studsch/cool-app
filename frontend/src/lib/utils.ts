import { type ClassValue, clsx } from "clsx";
import exp from "constants";
import { promises } from "dns";
import { twMerge } from "tailwind-merge";
import { FetchReplyComments } from "@/fetch/comment";

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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toNormalDateTime(dateString: string) {
  const date = new Date(dateString);
  const separator = "/";
  let formattedDate =
    date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("ru-RU", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  formattedDate = formattedDate.replace(/\./g, separator);
  return formattedDate;
}

export function getMeta(url: any, cb: any) {
  const img = new Image();
  img.onload = () => cb(null, img);
  img.onerror = err => cb(err);
  img.src = url;
}

export function toYyyyMmDdDateTime(date: Date) {
  let year = date.getFullYear().toString(); // Get last two digits of the year
  let month = (date.getMonth() + 1).toString(); // Get month (0-based index, add 1)
  let day = date.getDate().toString(); // Get day of the month

  // Add leading zeros to month and day if needed
  month = month.padStart(2, "0");
  day = day.padStart(2, "0");

  return `${year}-${month}-${day}`; // Format as "yy-mm-dd"
}

export async function refreshAndRepeat(
  fetchFunc: any,
  fetchArgs: any,
  refreshFetch: any,
  refreshArgs: any,
) {
  let res = await fetchFunc(...fetchFunc);
  if (res == 401 || res?.status == 401) {
    refreshFetch(...refreshArgs);
    res = await fetchFunc(...fetchFunc);
  }
  return res;
}

export async function getAllReplys(
  args: string,
  id: string,
  comments: any[] = [],
) {
  const val = await FetchReplyComments(args, id);

  if (!val.status && val.comments && val.comments.length > 0) {
    comments.push(...val.comments);

    await Promise.all(
      val.comments.map(async (element: any) => {
        await getAllReplys(args, element.id, comments);
      }),
    );
  }
  const sortedComments = comments
    .filter(comment => comment.author)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  return sortedComments;
}
