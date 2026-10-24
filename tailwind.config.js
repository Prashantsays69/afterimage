/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        surface: 'var(--color-white)',
        'signal-red': 'var(--color-signal-red)',
        'acid-lime': 'var(--color-acid-lime)',
        'electric-blue': 'var(--color-electric-blue)',
        muted: 'var(--color-muted)',
        rule: 'var(--color-rule)',
        'rule-dark': 'var(--color-rule-dark)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Arial', 'sans-serif'],
        body: ['"Inter"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"SFMono-Regular"', 'Consolas', 'monospace'],
      },
      maxWidth: {
        'content': '1440px',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '2px',
        md: '4px',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '140ms',
        standard: '180ms',
        panel: '260ms',
        reveal: '520ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
      },
      spacing: {
        'gutter': 'var(--page-gutter)',
      },
    },
  },
  plugins: [],
}
