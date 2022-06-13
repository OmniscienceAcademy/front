This is the front of omniscience.academy.

You can find the back open-sourced with the instructions to run the website here: https://github.com/OmniscienceAcademy/omniscience-api

# Dev infos

[design](https://www.figma.com/file/kXTJnAvcoeBc9pd5ZsoXxE/Prototype-omniScience-Before-Grant)  
[live version](https://omniscience.academy/fr)  
[preview](https://front-git-dev-omniscienceacademy.vercel.app/fr)

don't forget to setup .env.local with keys:
NEXT_PUBLIC_API_KEY

## commands

install node 14 then: `npm install`

run dev server : `npm run dev`

build a distribution ready server : `npm run build`

launch the server : `npm start`

### locales

For Now all locales are in English, French locales files are here but are just copy of the English one

using [next-translate](https://www.npmjs.com/package/next-translate) for easy translations,
all locales are in the `/locales` directory.

In some translation you will find `<b>some text</b>`, this is to style some part of the text, to be bold for example, it will be parsed after and render according to the page style.

`<p>` tags are juste to facilitate the corresponding html tag insertion,
`<b>` tags are for text highlights
`{{ x }}` is for variables, `x` will take a value
