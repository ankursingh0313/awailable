"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Logo() {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.classList.add("animate-typing");
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 10ch;
          }
        }

        @keyframes blink-caret {
          0%,
          100% {
            border-color: transparent;
          }
          50% {
            border-color: #00c029;
          }
        }

        .animate-typing {
          overflow: hidden;
          white-space: nowrap;
          border-right: 0.15em solid orange;
          width: 10ch;
          animation: typing 1.5s steps(9, end),
            blink-caret 0.75s step-end infinite;
        }
      `}</style>

      <div className="text-[#4e60c6]">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-[30px] fill-[#4e60c6]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
          </svg>
          <span
            ref={textRef}
            className="text-[30px] font-semibold inline-block"
          >
            AVAILABLE
          </span>
        </Link>
      </div>
    </>
  );
}
