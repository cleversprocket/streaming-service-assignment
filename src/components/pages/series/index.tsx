import shows from "@/data/shows.json";
import { ShowConfig, Show, Season } from "@/types/show";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { EpisodeTray } from "./sub-components/episode-tray";
import classNames from "classnames";

export type Props = {
  data: Show & {
    seasons: Season[];
  };
};

const EPISODE_TRAY_CLASSES = {
  li: "w-[201px]",
};

export default function SeriesPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const {
    title,
    description,
    seasons: [seasonOne],
  } = data;
  const selectedEpisode = seasonOne.episodes[selectedEpisodeIndex];

  const handleEpisodeClick = useCallback((index: number) => {
    setSelectedEpisodeIndex(index);
    setIsDrawerOpen(true);
  }, []);

  return (
    <main className="overflow-hidden relative xl:grid xl:[grid-template-columns:64%_36%]">
      <section className="relative [height:100vh] flex flex-col justify-around xl:grid xl:[grid-template-rows:66%_1fr] xl:[grid-template-columns:1fr] xl:pl-20">
        <header className="relative z-10 text-white p-6 xl:self-center">
          <hgroup className="flex flex-col">
            <h1 className="font-bold text-3xl md:[font-size:74px] md:[line-height:87px]">
              {title}
            </h1>
            <p className="order-first md:[font-size:23px] md:[line-height:27px] font-light">
              Season 1
            </p>
          </hgroup>
          <p className="font-light md:[font-size:23px] md:[line-height:27px] w-full max-w-[491px]">
            {description}
          </p>
        </header>
        <Image
          className="object-cover w-full h-full absolute inset-0 z-0 pointer-events-none"
          src={seasonOne.image.src}
          width={300}
          height={300}
          alt={seasonOne.image.alt}
        />
        <EpisodeTray
          classes={EPISODE_TRAY_CLASSES}
          selectedIndex={selectedEpisodeIndex}
          isOpen={isDrawerOpen}
          controls="episode-drawer"
          className="overflow-x-scroll pl-6"
          handleClick={handleEpisodeClick}
          episodes={seasonOne.episodes}
        />
      </section>
      <article
        id="episode-drawer"
        aria-live="polite"
        className={classNames(
          "absolute z-20 inset-0 w-[100vw] h-[100vh] lg:w-1/2 xl:transform-none xl:relative xl:w-full duration-300 xl:visible",
          {
            "translate-x-0 lg:translate-x-full ease-in-out xl:transform-none":
              isDrawerOpen,
            "invisible translate-x-full lg:translate-x-[200%] ease-out xl:transform-none lg:right-0":
              !isDrawerOpen,
          }
        )}
      >
        <header className="absolute top-6 left-6 z-50 xl:hidden">
          <button
            className="font-bold text-white "
            type="button"
            onClick={() => {
              setIsDrawerOpen(false);
              setTimeout(() => {
                (drawerRef.current as HTMLDivElement).scrollTop = 0;
              }, 300);
            }}
          >
            close
          </button>
        </header>
        <div
          ref={drawerRef}
          className={classNames(
            "[height:100vh] w-full fixed flex flex-col justify-end xl:static inset-0 bg-white z-30 overflow-scroll"
          )}
        >
          <Image
            className="object-cover w-full h-2/3"
            src={selectedEpisode.image.src}
            width={300}
            height={300}
            alt={selectedEpisode.image.alt}
          />
          <div className="h-1/3 bg-white">
            <div className="flex items-center pt-[50px] pb-[42px] px-[38px] border-b-2">
              <h2 className="mr-auto">
                {`Episode ${selectedEpisode.number} — `}
                <time dateTime={selectedEpisode.date}>
                  {selectedEpisode.date}
                </time>
              </h2>
              <Image
                className="mr-4 block"
                src="/assets/images/star-rating.svg"
                width={28}
                height={28}
                alt="star rating"
              />
              <p aria-label={`${selectedEpisode.rating} out of 10 stars`}>
                <b>{selectedEpisode.rating}</b>/10
              </p>
            </div>
            <h1 className="px-[38px] mt-[45px] mb-1.5 font-bold text-[27px] leading-[32px]">
              {selectedEpisode.title}
            </h1>
            <p className="px-[38px] pb-6">{selectedEpisode.description}</p>
          </div>
        </div>
      </article>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = shows.map((show) => ({
    params: {
      name: show.name,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

type Params = {
  name: string;
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { params } = context;
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&t=${params?.name}&type=series&plot=short`
  );
  const date = new Date();

  // OMDB doesn't return episode data :(
  const showData = await res.json();

  const matchedShow = shows.find(
    (show) => show.name === params?.name
  ) as ShowConfig;
  const numberOfSeasons = 1;
  let episodeImage = 0;

  // Mocking season data
  const seasons = [...Array(numberOfSeasons)].map((_, seasonIndex) => {
    const season = seasonIndex + 1;

    return {
      number: seasonIndex + 1,
      image: {
        src: `/assets/series/${matchedShow.name}/seasons/${season}/cover.jpg`,
        alt: showData.Title,
      },
      episodes: [...Array(10)].map((__, episodeIndex) => {
        const formattedDate =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();

        // mock the date by incrementing it by one week
        date.setDate(date.getDate() + 7);

        episodeImage = episodeImage === 5 ? 1 : episodeImage + 1;

        return {
          title: `${showData.Title} episode ${episodeIndex + 1}`,
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum?`,
          // Only the best shows on my streaming service!
          rating: (9 + Math.random()).toFixed(1),
          date: formattedDate,
          image: {
            src: `/assets/series/${matchedShow.name}/seasons/${season}/${episodeImage}.jpg`,
            alt: `${showData.Title} season one, episode ${episodeIndex + 1}`,
          },
          number: episodeIndex + 1,
        };
      }),
    };
  });

  return {
    props: {
      data: {
        title: showData.Title,
        description: showData.Plot,
        rating: showData.imdbRating,
        seasons,
      },
    },
  };
};
