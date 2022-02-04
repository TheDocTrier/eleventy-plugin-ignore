import { join } from "path";
import { readFileSync } from "fs";
import fg = require("fast-glob");
import matter = require("gray-matter");

const isProd = process.env["NODE_ENV"] === "production";

interface Front {
  ignore?: boolean;
  draft?: boolean;
}

interface Options<Data = Front> {
  /** Function to call on frontmatter data, if it returns true, ignore */
  ignore(data: Data): boolean;
  /** Template formats to search for inside input directory */
  templateFormats: string[];
}

const defaultOpts: Options = {
  ignore: (data) => Boolean(data.ignore || (data.draft && isProd)),
  // poor solution until plugins are able to get the templates
  templateFormats: ["html", "liquid", "md", "njk"],
};

export = function (
  eleventyConfig: { dir: { input: string }; ignores: Set<string> },
  opts = defaultOpts
) {
  for (const path of fg.sync(
    opts.templateFormats.map((fmt) =>
      join(eleventyConfig.dir.input, `**/*.${fmt}`)
    )
  )) {
    const data = matter(readFileSync(path, "utf-8")).data;
    if (opts.ignore(data)) {
      eleventyConfig.ignores.add(path);
    }
  }
};
