import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  sendPasswordResetEmail 
} from "firebase/auth";

import { auth, googleProvider, githubProvider } from "@/firebase";
import axios from "@/services/api";

/* ---------------- EMAIL LOGIN ---------------- */
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const forgotPassword = async (email) => {
  if (!email) {
    throw new Error("Please enter your email");
  }

  await sendPasswordResetEmail(auth, email);
};

/* ---------------- GOOGLE LOGIN ---------------- */
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const token = await result.user.getIdToken();

  await axios.post(
    "/users",
    { provider: "google" },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return result.user;
};

/* ---------------- GITHUB LOGIN ---------------- */
export const loginWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const token = await result.user.getIdToken();

    await axios.post(
      "/users",
      { provider: "github" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return result.user;
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData.email;
      const pendingCred =
        GithubAuthProvider.credentialFromError(error);

      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.includes("google.com")) {
        const googleResult = await signInWithPopup(auth, googleProvider);

        await linkWithCredential(
          googleResult.user,
          pendingCred
        );

        const token = await googleResult.user.getIdToken();

        await axios.post(
          "/users",
          { provider: "google+github" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        return googleResult.user;
      }

      alert("Please login using your original method.");
    } else {
      throw error;
    }
  }
};

/* ---------------- EMAIL SIGNUP ---------------- */
export const signupWithEmail = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await result.user.getIdToken();

  await axios.post(
    "/users",
    {
      name,
      provider: "password",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return result.user;
};

/* ---------------- LOGOUT ---------------- */
export const logout = async () => {
  await auth.signOut();
};
