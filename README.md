# eleventy-plugin-ignore

```
$ npm i eleventy-plugin-ignore
```

Ignore files based on their front matter.

## Usage

A description of the available options and their defaults are given:

```js
eleventyConfig.addPlugin(
  require("eleventy-plugin-ignore"),
  {
    // template ignored if function returns true
    ignore: (data) =>
      data.ignore ||
      (data.draft && NODE_ENV === "production"),
    // check all templates ending with these extensions
    templateFormats: ["html", "liquid", "md", "njk"]
  }
);
```

## Limitations

This plugin does not delete ignored templates from the output directory.
It is recommended that you clear your output direct before each build.

When using `eleventy --serve`, any change to the front matter of a template will require a second rebuild for the template to be ignored.
This is because eleventy currently processes ignores before running the `beforeBuild` callbacks (see [this issue](https://github.com/11ty/eleventy/issues/2207)).
