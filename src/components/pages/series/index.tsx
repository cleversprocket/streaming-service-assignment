import shows from "@/data/shows.json";
import { ShowConfig, Show, Season } from "@/types/show";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EpisodeTray } from "./sub-components/episode-tray";
import { CSSTransition } from "react-transition-group";

export type Props = {
  data: Show & {
    seasons: Season[];
  };
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
    <main className="overflow-hidden relative lg:grid lg:[grid-template-columns:64%_36%]">
      <section className="[height:100vh] relative flex flex-col justify-around">
        <header className="relative z-10 text-white p-6">
          <hgroup className="flex flex-col">
            <h1 className="font-bold [font-size:74px] [line-height:87px]">
              {title}
            </h1>
            <p className="order-first [font-size:23px] [line-height:27px] font-light">
              Season 1
            </p>
          </hgroup>
          <p className="font-light [font-size:23px] [line-height:27px]">
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
          className="overflow-x-scroll pl-6"
          handleClick={handleEpisodeClick}
          episodes={seasonOne.episodes}
        />
      </section>
      <CSSTransition
        in={isDrawerOpen}
        timeout={200}
        nodeRef={drawerRef}
        classNames={{
          enter: "translate-x-0 ease-in-out lg:transform-none",
          enterActive: "translate-x-0 ease-in-out lg:transform-none",
          enterDone: "translate-x-0 lg:transform-none",
          exit: "translate-x-full ease-out lg:transform-none",
          exitActive: "translate-x-full ease-out lg:transform-none",
          exitDone: "translate-x-full lg:transform-none",
        }}
      >
        <article
          ref={drawerRef}
          className="[height:100vh] w-full absolute lg:static inset-0 bg-white z-30 translate-x-full lg:transform-none duration-300"
        >
          <header>
            <button
              className="font-bold"
              type="button"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              close
            </button>
            <h2>
              {`Episode ${selectedEpisode.number} — `}
              <time dateTime={selectedEpisode.date}>
                {selectedEpisode.date}
              </time>
            </h2>
            <div>
              <Image
                src="/assets/images/star-rating.svg"
                width={300}
                height={300}
                alt="star rating"
              />
              <p aria-label={`${selectedEpisode.rating} out of 10 stars`}>
                <b>{selectedEpisode.rating}</b>/10
              </p>
            </div>
          </header>
          <Image
            src={selectedEpisode.image.src}
            width={300}
            height={300}
            alt={selectedEpisode.image.alt}
          />
          <h1>{selectedEpisode.title}</h1>
          <p>{selectedEpisode.description}</p>
        </article>
      </CSSTransition>
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
          rating: (Math.random() * 10).toFixed(1),
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
