/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ブランドカラー：深海ネイビー × ゴールド
        brand: {
          navy:    '#0D1B2A',
          'navy-light': '#1A2E42',
          gold:    '#C9A84C',
          'gold-light': '#E8C96A',
          cream:   '#F5F0E8',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'ui-serif', 'Georgia', 'serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray[700]'),
            '--tw-prose-headings': theme('colors.gray[900]'),
            '--tw-prose-links': theme('colors.brand.gold'),
            maxWidth: '70ch',
            lineHeight: '1.85',
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray[300]'),
            '--tw-prose-headings': theme('colors.gray[100]'),
            '--tw-prose-links': theme('colors.brand.gold-light'),
          },
        },
      }),
    },
  },
  plugins: [
    // @tailwindcss/typography は別途インストール必要。インストール後にコメント解除
    // require('@tailwindcss/typography'),
  ],
};
