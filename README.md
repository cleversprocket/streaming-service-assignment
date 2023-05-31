This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First add a `.env.local` file with the following:

```env
# This is used to revalidate the cache
# for the statically generated pages.
REVALIDATE_TOKEN=<this-can-be-anything>

# Public vars (accessible in the browser)
NEXT_PUBLIC_OMDB_API_KEY=<your-omdb-api-key>
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding more seasons

To add more seasons, update the array in `src/data/shows.ts` with the show name, then add 5 episode images to `public/assets/series/<show-name>/seasons/<season-number>` (the show images are repeated to make life easier 😎)
