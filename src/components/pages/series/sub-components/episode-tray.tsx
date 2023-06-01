import { TailRight } from "@/components/atoms/tail-right";
import { Episodes } from "@/types/show";
import classNames from "classnames";
import Image from "next/image";
import { FC, useCallback, useState } from "react";

type Props = {
  episodes: Episodes;
  handleClick: (index: number) => void;
  controls: string;
  selectedIndex: number;
  isOpen: boolean;
  className?: string;
  classes?: {
    root?: string;
    li?: string;
  };
};

type ScrollPosition = "start" | "middle" | "end";

// The margin on the first element is 48px
const SCROLL_OFFSET = 48;

const getScrollPosition = (
  left: number,
  amount: number,
  max: number
): ScrollPosition => {
  if (left < SCROLL_OFFSET) {
    return "start";
  }

  if (left + amount >= max) {
    return "end";
  }

  return "middle";
};

export const EpisodeTray: FC<Props> = ({
  episodes,
  handleClick,
  className,
  controls,
  selectedIndex,
  isOpen,
  classes,
}) => {
  const [olElm, setOlElm] = useState<HTMLOListElement>();
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>("start");
  const olRef = useCallback((elm: HTMLOListElement) => {
    setOlElm(elm);
  }, []);

  const handleForwardClick = useCallback(() => {
    if (olElm) {
      const parent = olElm.parentElement as HTMLDivElement;
      const amount = olElm.children[0].clientWidth + SCROLL_OFFSET;
      const scroll = parent.scrollLeft + amount;
      const max = olElm.clientWidth;
      const left = Math.min(scroll, max);

      parent.scrollTo({
        top: 0,
        left,
        behavior: "smooth",
      });

      setScrollPosition(getScrollPosition(left, amount, max));
    }
  }, [olElm]);

  const handlePreviousClick = useCallback(() => {
    if (olElm) {
      const parent = olElm.parentElement as HTMLDivElement;
      const max = olElm.clientWidth;
      const amount = olElm.children[0].clientWidth + SCROLL_OFFSET;
      const scroll = parent.scrollLeft - amount;
      const left = Math.min(scroll, olElm.clientWidth);

      parent.scrollTo({
        top: 0,
        left,
        behavior: "smooth",
      });

      setScrollPosition(getScrollPosition(left, amount, max));
    }
  }, [olElm]);

  return (
    <div
      className={classNames(
        "relative [height:max-content]",
        className || classes?.root
      )}
    >
      <div className={classNames("flex pb-12", className || classes?.root)}>
        <ol ref={olRef} className="flex [counter-reset:list]">
          {episodes.map((episode, i) => {
            return (
              <li
                key={episode.title}
                className={classNames(
                  "relative",
                  classes?.li,
                  `[counter-increment:list] before:absolute before:flex before:justify-center before:items-center before:content-[counter(list)] before:font-bold before:bg-white before:w-[30px] before:h-[30px]`,
                  {
                    "mr-12": i === 0,
                    "mr-7": i === 1,
                    "mr-2": i >= 2,
                  }
                )}
              >
                <button
                  aria-controls={controls}
                  type="button"
                  className={classNames("group flex flex-col text-white")}
                  onClick={() => {
                    handleClick(i);
                  }}
                >
                  <h3 className="leading-[18px] font-bold mt-5 mb-2.5">
                    {episode.title}
                  </h3>
                  <p className="text-ellipsis h-[4.5em] [font-size:13px] text-left overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] [white-space:normal]">
                    {episode.description}
                  </p>
                  <Image
                    className={classNames(
                      "order-first object-cover w-full h-[134px] brightness-50 group-hover:brightness-100",
                      {
                        "brightness-100": i === selectedIndex && isOpen,
                      }
                    )}
                    src={episode.image.src}
                    width={633}
                    height={330}
                    alt={episode.image.alt}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <nav className="absolute bottom-0 right-6">
        <button
          className={classNames("rotate-180 mr-6 text-white", {
            "brightness-50": scrollPosition === "start",
          })}
          aria-label="previous"
          onClick={handlePreviousClick}
          type="button"
          disabled={scrollPosition === "start"}
        >
          <TailRight />
        </button>
        <button
          className={classNames("text-white", {
            "brightness-50": scrollPosition === "end",
          })}
          aria-label="next"
          onClick={handleForwardClick}
          type="button"
          disabled={scrollPosition === "end"}
        >
          <TailRight />
        </button>
      </nav>
    </div>
  );
};
