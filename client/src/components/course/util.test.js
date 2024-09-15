import { getMostPopularTags, getAverageRating, getAverageGrade } from "./util";
import { mockedCommentsDatabase } from "../../mock-data/comments";

describe("getMostPopularTags", () => {
  let comments;
  beforeEach(() => {
    comments = [];
  });
  it("sort tags from more than 3 comments", () => {
    // Test 1
    let tags = [["1", "2", "3"], ["3", "4"], [], ["2"], ["3", "4", "5"]];
    let expectedReturn = [
      { str: "3", count: 3 },
      { str: "2", count: 2 },
      { str: "4", count: 2 },
    ];
    for (const tag of tags) {
      comments.push({ tags: tag });
    }
    expect(getMostPopularTags(comments)).toStrictEqual(expectedReturn);

    // Test 2
    let additionalTags = [["1", "4"], ["1"], ["4", "3"], ["4"]];
    expectedReturn = [
      { str: "4", count: 5 },
      { str: "3", count: 4 },
      { str: "1", count: 3 },
    ];
    for (const tag of additionalTags) {
      comments.push({ tags: tag });
    }
    expect(getMostPopularTags(comments)).toStrictEqual(expectedReturn);
  });
  it("sort tags from less than 3 comments", () => {
    // Test 1
    let tag = ["1", "2", "3"];
    let expectedReturn = [
      { str: "1", count: 1 },
      { str: "2", count: 1 },
      { str: "3", count: 1 },
    ];
    comments.push({ tags: tag });
    expect(getMostPopularTags(comments)).toStrictEqual(expectedReturn);

    // Test 2
    let additionalTag = ["3", "4"];
    expectedReturn = [
      { str: "3", count: 2 },
      { str: "1", count: 1 },
      { str: "2", count: 1 },
    ];
    comments.push({ tags: additionalTag });
    expect(getMostPopularTags(comments)).toStrictEqual(expectedReturn);
  });
  it("sort tags from 0 comments", () => {
    expect(getMostPopularTags(comments)).toStrictEqual([]);
  });
});

describe("getAverageRating", () => {
  let comments;
  beforeEach(() => {
    comments = [];
  });
  it("get average rating from more than 0 comments", () => {
    // Test 1
    comments.push({ rating: 1 });
    expect(getAverageRating(comments)).toBe(1);

    // Test 2
    let ratings = [3, 4, 3];
    let expectedReturn = 2.7;
    for (const rating of ratings) {
      comments.push({ rating: rating });
    }
    expect(getAverageRating(comments)).toBe(expectedReturn);

    // Test 3
    let additionalRatings = [3, 4, 5];
    expectedReturn = 3.2;
    for (const rating of additionalRatings) {
      comments.push({ rating: rating });
    }
    expect(getAverageRating(comments)).toBe(expectedReturn);
  });
  it("get average rating from 0 comment", () => {
    expect(getAverageRating(comments)).toBe(0); // 0 will be rendered as N/A
  });
});

describe("getAverageGrade", () => {
  let comments;
  beforeEach(() => {
    comments = [];
  });
  it("get average grade from more than 0 grade-containing-comments", () => {
    comments.push({ grade: "A" });
    expect(getAverageGrade(comments)).toStrictEqual({ letterAvg: "A" });

    comments.push({ grade: "A" });
    expect(getAverageGrade(comments)).toStrictEqual({ letterAvg: "A" });

    comments.push({ grade: "A+" });
    expect(getAverageGrade(comments)).toStrictEqual({
      lowerLetterAvg: "A",
      higherLetterAvg: "A+",
    });

    comments.push({ grade: "A-" });
    expect(getAverageGrade(comments)).toStrictEqual({ letterAvg: "A" });

    comments.push({ grade: "C" });
    expect(getAverageGrade(comments)).toStrictEqual({
      higherLetterAvg: "A",
      lowerLetterAvg: "B+",
    });
  });
  it("get average grade from 0 grade-containing-comments", () => {
    expect(getAverageGrade(comments)).toStrictEqual({ letterAvg: "N/A" });
    comments.push({}); // mocking a comment with no grade
    expect(getAverageGrade(comments)).toStrictEqual({ letterAvg: "N/A" });
  });
});
