import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const fireApp = initializeApp(firebaseConfig);

const auth = getAuth();

function LoginWithEmailAndPassword(email, password) {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        const idToken = user.accessToken;

        // Perform the login API request
        fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ uid, idToken }),
        })
          .then((response) => {
            if (response.ok) {
              resolve(); // Resolve the Promise if the API request is successful
            } else {
              reject(new Error("Login API request failed")); // Reject the Promise if there's an error
            }
          })
          .catch((error) => {
            reject(error); // Reject the Promise in case of any other error
          });
      })
      .catch((error) => {
        // Handle the Firebase authentication error here
        reject(error); // Reject the Promise with the Firebase authentication error
      });
  });
}

async function SendEmailVerificationToCurrentUser() {
  sendEmailVerification(auth.currentUser).catch((error) => {
    console.error("Error sending verification email:", error);
  });
}

async function SendPasswordResetToUserEmail(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
    });
}

export {
  LoginWithEmailAndPassword,
  SendEmailVerificationToCurrentUser,
  SendPasswordResetToUserEmail,
};
