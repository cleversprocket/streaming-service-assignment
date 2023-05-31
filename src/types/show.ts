import { ImageConfig } from "./general";

export type ShowConfig = {
  name: string,
}

export type Show = {
  title: string;
  description: string;
  rating: string;
};

export type Episode = Show & {
  date: string;
  image: ImageConfig;
  number: number;
};

export type Episodes = Episode[];

export type Season = {
  image: ImageConfig;
  number: number;
  episodes: Episodes;
};
