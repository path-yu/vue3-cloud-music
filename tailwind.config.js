module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'black': '#1a1a1a'
      }
    },
  },
  darkMode: 'class',
  plugins: [],
  corePlugins: {
    // 解决组件库中的组件样式冲突
    preflight: false,
  },
};
