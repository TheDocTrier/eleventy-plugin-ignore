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
  ignore(data: Data): boolean;
}

const defaultOpts: Options = {
  ignore: (data) => Boolean(data.ignore || (data.draft && isProd)),
};

export = function (eleventyConfig: any, opts = defaultOpts) {
  for (const path of fg.sync(
    (eleventyConfig.templateFormats as string[]).map((fmt) =>
      join(eleventyConfig.dir.input, `**/*.${fmt}`)
    )
  )) {
    const data = matter(readFileSync(path, "utf-8")).data;
    if (opts.ignore(data)) {
      eleventyConfig.ignores.add(path);
    }
  }
};
