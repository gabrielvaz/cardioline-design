/**
 * Prefixes a path in `public/` with the deployment's base path.
 *
 * `next/image` applies `basePath` through the image optimizer, but the static
 * export runs with `unoptimized: true` and passes `src` straight to the `<img>`
 * — so on GitHub Pages, where the site lives under a repository subpath, a
 * bare `/brand/...` resolves to the domain root and 404s. Anything referencing
 * `public/` by literal path has to go through here.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
