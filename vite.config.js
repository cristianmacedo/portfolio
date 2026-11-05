import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import react from '@vitejs/plugin-react';

// Capture real repository activity at build time without a client-side API token.
function portfolioActivity() {
  try {
    const dates = execFileSync("git", ["log", "--format=%as"], {encoding:"utf8"}).trim().split("\n");
    // Some deployment providers supply a shallow clone; prefer the verified
    // snapshot over presenting truncated history as a lifetime total.
    if (execFileSync("git", ["rev-parse","--is-shallow-repository"], {encoding:"utf8"}).trim() === "true") return null;
    const days = new Map();
    for (const date of dates.sort()) days.set(date, (days.get(date) || 0) + 1);
    return {total: dates.length, days: [...days.values()].slice(-11)};
  } catch { return null; }
}

export default defineConfig({
  define: { __PORTFOLIO_ACTIVITY__: JSON.stringify(portfolioActivity()) },
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Keep the standard backdrop-filter declaration in the production CSS.
    // The default CSS minifier emits only the WebKit-prefixed form, which
    // Chromium ignores for these glass surfaces.
    cssMinify: false,
  },
});
