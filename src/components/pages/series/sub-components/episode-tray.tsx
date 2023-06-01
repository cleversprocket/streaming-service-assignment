import { Episodes } from "@/types/show";
import classNames from "classnames";
import Image from "next/image";
import { FC } from "react";

type Props = {
  episodes: Episodes;
  handleClick: (index: number) => void;
  controls: string;
  selectedIndex: number;
  isOpen: boolean;
  className?: string;
};

export const EpisodeTray: FC<Props> = ({
  episodes,
  handleClick,
  className,
  controls,
  selectedIndex,
  isOpen,
}) => {
  return (
    <div className={classNames(className, "flex")}>
      <ol className="flex [counter-reset:list]">
        {episodes.map((episode, i) => {
          return (
            <li
              key={episode.title}
              className={classNames(
                `relative w-[201px] [counter-increment:list] before:absolute before:flex before:justify-center before:items-center before:content-[counter(list)] before:font-bold before:bg-white before:w-[30px] before:h-[30px]`,
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
      <nav>
        <button type="button">previous</button>
        <button type="button">next</button>
      </nav>
    </div>
  );
};
