module.exports = () => ({
  //map: process.env.NODE_ENV !== 'production',
  plugins: [
    require('postcss-import'),
    require('tailwindcss')('./themes/paper/tailwind.js'),
    process.env.NODE_ENV === 'production' ? require('@fullhuman/postcss-purgecss')({
      content: [
        './layouts/**/*.html',
      ],
      extractors: [
        {
          extractor: class {
            static extract(content) {
              return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
            }
          },
          extensions: ["html", "js", "md", "toml"],
        }
      ],
      whitelist: require("purgecss-whitelister")([
        './layouts/**/*.html',
        './static/css/**/*.css',
      ])
    }) : undefined,
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' ? require('cssnano') : undefined,
  ].filter(x => x !== undefined),
})
