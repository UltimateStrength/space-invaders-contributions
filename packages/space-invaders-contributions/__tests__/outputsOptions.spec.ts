import { parseEntry } from "../outputsOptions";
import { it, expect } from "bun:test";

it("should parse options as json", () => {
  expect(
    parseEntry(`/out.svg       {"color_ship":"yellow"}`)?.drawOptions,
  ).toHaveProperty("colorShip", "yellow");

  expect(
    parseEntry(`/out.svg?{"color_ship":"yellow"}`)?.drawOptions,
  ).toHaveProperty("colorShip", "yellow");

  expect(
    parseEntry(`/out.svg?{"color_dots":["#000","#111","#222","#333","#444"]}`)
      ?.drawOptions.colorDots,
  ).toEqual(["#000", "#111", "#222", "#333", "#444"]);
});

it("should parse options as searchparams", () => {
  expect(parseEntry(`/out.svg?color_ship=yellow`)?.drawOptions).toHaveProperty(
    "colorShip",
    "yellow",
  );

  expect(
    parseEntry(`/out.svg?color_dots=#000,#111,#222,#333,#444`)?.drawOptions
      .colorDots,
  ).toEqual(["#000", "#111", "#222", "#333", "#444"]);
});

it("should parse filename", () => {
  expect(parseEntry(`/a/b/c.svg?{"color_ship":"yellow"}`)).toHaveProperty(
    "filename",
    "/a/b/c.svg",
  );
  expect(
    parseEntry(`/a/b/out.svg?.foo.svg?{"color_ship":"yellow"}`),
  ).toHaveProperty("filename", "/a/b/out.svg?.foo.svg");

  expect(
    parseEntry(`/a/b/{[-1].svg?.foo.svg?{"color_ship":"yellow"}`),
  ).toHaveProperty("filename", "/a/b/{[-1].svg?.foo.svg");
});

it("should reject unsupported formats", () => {
  expect(parseEntry("path/to/out.gif")).toBeNull();
});

[
  // overwrite colors (search params)
  "/out.svg?color_ship=orange&color_dots=#000,#111,#222,#333,#444",

  // overwrite colors (json)
  `/out.svg?{"color_ship":"yellow","color_dots":["#000","#111","#222","#333","#444"]}`,
].forEach((entry) =>
  it(`should parse ${entry}`, () => {
    expect(parseEntry(entry)).toMatchSnapshot();
  }),
);
