import { Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Stack spacing={3} maxWidth={1000}>
      <Stack spacing={1}>
        <Typography variant="h3">Welcome to Hunter Elective Forum</Typography>
        <Typography>
          <b>Our mission</b>: to simplify the elective search process for all
          students.
        </Typography>
        <Typography>
          We are a platform that allows students to openly discuss and share
          information about electives
        </Typography>
        <Typography>
          If you have any question/comment/concern/feedback, please email us at{" "}
          <u>hunterschoolforum@gmail.com</u>
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight="bold">
            Q&A
          </Typography>
          <Typography>Q: Is this website secure?</Typography>
          <Typography>
            A: Yes, we used Google's service to manage authentication and store
            our data.
          </Typography>
        </Stack>
        <hr />
        <Stack spacing={1}>
          <Typography>Q: How to navigate through the site?</Typography>
          <Typography>
            A: You can use the navbar to search for electives that exist in our
            database or use the sidebar to look for electives that are
            categorized under majors.
          </Typography>
        </Stack>
        <hr />
        <Stack spacing={1}>
          <Typography>Q: What do I do if I can't find an elective?</Typography>
          <Typography>
            A: You can let us know by clicking on the "Didn't find your
            major/elective?" link on the sidebar and filling out the form.
          </Typography>
        </Stack>
        <hr />
        <Stack spacing={1}>
          <Typography>Q: How do I sign up?</Typography>
          <Typography>
            A: You can click on the "log in" button on the right of the nav bar,
            then click sign up on the bottom of that interface. Note: only
            Hunter emails are allowed, we do that to verify that all comments
            are made by Hunter students.
          </Typography>
        </Stack>
        <hr />
        <Stack spacing={1}>
          <Typography>Q: How do I make a comment?</Typography>
          <Typography>
            A: You will need to go to an elective page via sidebar/navbar, and
            click the "rate this class" button and fill out the form!
          </Typography>
        </Stack>
      </Stack>
    </Stack>
    // <div>
    //   <h1>About This Site</h1>
    //   <p style={{ fontSize: "24px" }}>
    //     Welcome to the Hunter College Elective Forum!
    //   </p>
    //   <p style={{ fontSize: "24px" }}>
    //     This forum is designed for students to chat with each other, share
    //     information about electives.
    //   </p>
    //   <p style={{ fontSize: "24px" }}>Feel free to ask questions,</p>
    //   <p style={{ fontSize: "24px" }}>Share your experiences,</p>
    //   <p style={{ fontSize: "24px" }}>
    //     And help fellow students make informed decisions about their electives
    //     and professors.
    //   </p>
    // </div>
  );
}
