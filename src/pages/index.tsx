import shows from "@/data/shows.json";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center">
      <header className="mt-12">
        <h1 className="font-bold text-3xl md:[font-size:74px] md:[line-height:87px]">
          Shows
        </h1>
        <nav>
          {shows.map((show) => (
            <Link
              className="text-[27px] leading-[32px] underline font-light"
              href={`/series/${show.name}`}
              key={show.name}
            >
              {show.name}
            </Link>
          ))}
        </nav>
      </header>
    </main>
  );
}
