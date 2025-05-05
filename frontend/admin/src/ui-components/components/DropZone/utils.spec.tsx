import { describe, expect, it } from "vitest";

import { fileAccepted } from "./utils";

describe("fileAccepted", () => {
  function createFile(file: Partial<File>): File {
    return file as File;
  }

  const textFile = createFile({
    name: "file1.txt",
    type: "text/plain",
  });

  const pngFile = createFile({
    name: "file2.png",
    type: "image/png",
  });

  const htmlFile = createFile({
    name: "file3.html",
    type: "text/html",
  });

  it("should accepted with no accept", () => {
    expect(fileAccepted(textFile, "")).toBeTruthy();
    expect(fileAccepted(pngFile, "")).toBeTruthy();
  });

  it("should check using file name ext", () => {
    expect(fileAccepted(pngFile, ".png")).toBeTruthy();
    expect(fileAccepted(textFile, ".png")).toBeFalsy();
  });

  it("should check using file mime type wildcard", () => {
    expect(fileAccepted(pngFile, "image/*")).toBeTruthy();
    expect(fileAccepted(textFile, "image/*")).toBeFalsy();
  });

  it("should check using file mime type exact", () => {
    expect(fileAccepted(textFile, "text/plain")).toBeTruthy();
    expect(fileAccepted(htmlFile, "text/plain")).toBeFalsy();
    expect(fileAccepted(pngFile, "text/plain")).toBeFalsy();
  });

  it("should check using with multiple pattern", () => {
    expect(fileAccepted(textFile, ".png,.txt")).toBeTruthy();
    expect(fileAccepted(pngFile, ".png,.txt")).toBeTruthy();
    expect(fileAccepted(htmlFile, ".png,.txt")).toBeFalsy();
  });
});
