/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins");
const nextTranslate = require("next-translate");
const withOptimizedImages = require("next-optimized-images");
const sharp = require("responsive-loader/sharp");
const path = require("path"); // why do we need this?
// const withPWA = require("next-pwa");

const date = new Date();

const nextConfig = {
  images: {
    disableStaticImages: true,
  },
  env: {
    NEXT_PUBLIC_APP_BUILD_TIME: date.toString(),
    NEXT_PUBLIC_APP_BUILD_TIMESTAMP: +date,
  },
  reactStrictMode: true,
  // use "@svgr/webpack" to load SVG as react components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: {
              // prevent the viewBox prop of SVGs to be stripped
              removeViewBox: false,
            },
          },
        },
      }],
    });
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias = {
      ...config.resolve.alias,
      img: path.resolve(__dirname, "./public/img"),
    }
    return config;
  },
};

// module.exports = {
//   ...nextTranslate(),
// };



module.exports = withPlugins([nextTranslate, [withOptimizedImages, {
  optimizeImagesInDev: true,
  responsive: {
    adapter: sharp
  },
  handleImages: ["jpeg", "png", "webp", "gif"],
}]], nextConfig);
