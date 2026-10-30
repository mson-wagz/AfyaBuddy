import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// tailwind.config.js
export const content = [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {},
};
export const plugins = [];