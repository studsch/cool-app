"use client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export function ShareButton({ shareCount }: { shareCount: string }) {
  const [isShared, setIsShared] = useState(false);
  return (
    <>
      <button
        className="hover:bg-slate-50 p-2 rounded-md"
        type="button"
        onClick={val => {
          setIsShared(!isShared);
        }}
      >
        <div className="flex gap-2 justify-center items-center">
          {isShared ? (
            <svg
              width={23}
              height={23}
              viewBox="0 0 24 24"
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#6a6a6a"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                ></path>{" "}
                <path
                  d="M14 6.5L9 10"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M14 17.5L9 14"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                ></path>{" "}
                <path
                  d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                ></path>{" "}
              </g>
            </svg>
          ) : (
            <svg
              width={23}
              height={23}
              viewBox="0 0 24 24"
              fill="#ff60a3"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ff60a3"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                ></path>{" "}
                <path
                  d="M14 6.5L9 10"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M14 17.5L9 14"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                ></path>{" "}
                <path
                  d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
                  stroke="9B9B9B"
                  strokeWidth="1.5"
                ></path>{" "}
              </g>
            </svg>
          )}
          <p className="text-sm font-medium text-text-primary-color">
            {shareCount} Shares
          </p>
        </div>
      </button>
    </>
  );
}
