export const mockedCommentsDatabase = [
  // 5 comments in total
  // Includes everything
  {
    attendance: true,
    commentBody:
      "Professor has a really bad WiFi connection and it's online, be careful of taking this class.",
    commentHeader: "Eh",
    courseId: "e11111",
    displayName: "John Doe",
    grade: "A+",
    professor: "Alexis Edwards",
    rating: 3,
    semester: "2022 Spring",
    tags: ["Beware of Pop Quizzes", "Test Heavy", "Online Savvy"],
    textbook: true,
    userId: "a11111",
  },
  // Missing all optional fields
  {
    courseId: "e11114",
    userId: "a11112",
    displayName: "Anonymous",
    semester: "2023 Spring",
    professor: "Nikolas Knapp",
    commentHeader: "A Header",
    commentBody: "Don't take this class!",
    tags: [],
    rating: 1,
  },
  // Missing some optional fields (attendance, textbook)
  {
    courseId: "e11114",
    userId: "a11111",
    displayName: "John Doe",
    semester: "2022 Fall",
    grade: "A+",
    professor: "Nikolas Knapp",
    commentHeader: "My take",
    commentBody: "John Doe's comment about Corporate Finance",
    tags: ["Lecture Heavy"],
    rating: 4,
  },
  {
    courseId: "e11112",
    userId: "a11111",
    displayName: "Anonymous",
    semester: "2023 Spring",
    grade: "A-",
    attendance: true,
    textbook: false,
    professor: "Delores Curry",
    commentHeader: "Interesting class",
    commentBody:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
      "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in " +
      "reprehenderit in voluptate velit esse cillum dolore eu fugiat " +
      "nulla pariatur. Excepteur sint occaecat cupidatat non proident, " +
      "sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: ["Beware of Pop Quizzes", "Test Heavy"],
    rating: 3,
  },
  {
    courseId: "e11113",
    userId: "a11112",
    displayName: "Anonymous",
    semester: "2023 Spring",
    grade: "B+",
    attendance: false,
    textbook: true,
    professor: "Remi Estrada",
    commentHeader: "Interesting class",
    commentBody:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
      "sed do eiusmod tempor incididunt ut labore et dolore magna " +
      "aliqua. Ut lectus arcu bibendum at varius vel pharetra vel " +
      "turpis. Arcu non sodales neque sodales ut etiam sit.",
    tags: ["Beware of Pop Quizzes", "Interesting", "Online Savvy"],
    rating: 3,
  },
];
