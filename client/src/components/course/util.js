import { gradeScale } from "../util";

const getMostPopularTags = (comments) => {
  if (!comments.length) {
    return [];
  }
  const extractedTags = comments.map((comment) => comment.tags);
  let tags = [];
  for (const extractedTag of extractedTags) {
    tags = tags.concat(extractedTag);
  }

  let tagCount = {};
  for (const tag of tags) {
    if (!tagCount[tag]) {
      tagCount[tag] = 0;
    }
    tagCount[tag]++;
  }
  const tagCountArr = [];
  for (const tagKey of Object.keys(tagCount)) {
    tagCountArr.push({ str: tagKey, count: tagCount[tagKey] });
  }
  tagCountArr.sort((a, b) => b.count - a.count);
  if (tagCountArr.length < 4) {
    return tagCountArr;
  }
  return tagCountArr.slice(0, 3);
};

const getAverageRating = (comments) => {
  if (!comments.length) {
    return 0;
  }
  const ratings = comments.map((comment) => comment.rating);

  let sum = 0;
  for (const rating of ratings) {
    sum += rating;
  }
  const averageRating = Math.floor((sum / ratings.length) * 10) / 10;
  return averageRating;
};

const getAverageGrade = (comments) => {
  const grades = comments
    .filter((comment) => comment.grade && comment.grade != "F")
    .map((comment) => comment.grade);

  if (!grades.length) {
    return { letterAvg: "N/A" };
  }
  let lowerSum = 0;
  let higherSum = 0;

  for (const letterGrade of grades) {
    lowerSum += gradeScale.filter((scale) => scale.letter === letterGrade)[0]
      .number[0];
    higherSum += gradeScale.filter((scale) => scale.letter === letterGrade)[0]
      .number[1];
  }

  const lowerAvg = lowerSum / grades.length;
  const higherAvg = higherSum / grades.length;
  const lowerLetterAvg = gradeScale.filter(
    (scale) => scale.number[0] <= lowerAvg && scale.number[1] >= lowerAvg
  )[0].letter;

  const higherLetterAvg = gradeScale.filter(
    (scale) => scale.number[0] <= higherAvg && scale.number[1] >= higherAvg
  )[0].letter;

  if (lowerLetterAvg === higherLetterAvg) {
    return { letterAvg: lowerLetterAvg };
  }

  return { lowerLetterAvg: lowerLetterAvg, higherLetterAvg: higherLetterAvg };
};

const getFilterOptions = (comments) => {
  let filterOptions = [];
  const seasonToNum = { Spring: 1, Summer: 2, Fall: 3, Winter: 4 };
  const numToSeason = { 1: "Spring", 2: "Summer", 3: "Fall", 4: "Winter" };
  for (const comment of comments) {
    const encodedSemester =
      comment.semester.split(" ")[0] +
      " " +
      seasonToNum[comment.semester.split(" ")[1]];

    if (!filterOptions.includes(encodedSemester)) {
      filterOptions.push(encodedSemester);
    }
  }
  filterOptions = filterOptions.sort();

  filterOptions = filterOptions.map(
    (semester) =>
      semester.split(" ")[0] + " " + numToSeason[semester.split(" ")[1]]
  );

  filterOptions.unshift("All Semesters");
  return filterOptions;
};

export {
  getMostPopularTags,
  getAverageRating,
  getAverageGrade,
  getFilterOptions,
};
