import plugin = require("./eleventy");
import { mkdir, writeFile, rm } from "fs/promises";
import { EventEmitter } from "stream";

beforeAll(async () => {
  await mkdir("example");
  await Promise.all([
    writeFile("example/t-prod.md", "---\ntitle: t-production\n---"),
    writeFile("example/t-ignore.md", "---\ntitle: t-ignore\nignore: true\n---"),
    writeFile("example/t-draft.md", "---\ntitle: t-draft\ndraft: true\n---"),
  ]);
});

afterAll(() => rm("example", { recursive: true }));

let eleventyConfig: EventEmitter & {
  dir: {
    input: string;
  };
  ignores: Set<string> & { add: jest.Mock<unknown, [string]> };
};

const getIgnoresSet = () =>
  new Set(eleventyConfig.ignores.add.mock.calls.map((c) => c[0]));

beforeEach(() => {
  eleventyConfig = Object.assign(new EventEmitter(), {
    dir: {
      input: "example",
    },
    ignores: Object.assign(new Set<string>(), { add: jest.fn() }),
  });
});

test("production frontmatter", () => {
  process.env["NODE_ENV"] = "production";
  jest.resetModules();
  const nPlugin: typeof plugin = require("./eleventy");
  nPlugin(eleventyConfig);
  expect(getIgnoresSet()).toEqual(
    new Set(["example/t-ignore.md", "example/t-draft.md"])
  );
  process.env["NODE_ENV"] = "test";
});

test("ignore frontmatter", () => {
  plugin(eleventyConfig);
  expect(getIgnoresSet()).toEqual(new Set(["example/t-ignore.md"]));
});

// TODO add a test for before build event (may eventually just run a real eleventy build)
