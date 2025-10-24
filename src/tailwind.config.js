import plugin from 'tailwindcss/plugin'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: { extend: {} },
  plugins: [
    plugin(({ addVariant }) => {
       addVariant('dark', '&:where([data-theme=dark], [data-theme=dark] *)')
    }),
  ],
}