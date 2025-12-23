export function getFirebaseErrorMessage(error) {
  if (!error || !error.code) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    // 🔐 LOGIN ERRORS
    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Email or password is incorrect.";

    // 📝 SIGNUP ERRORS
    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger one.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    default:
      return "Authentication failed. Please try again.";
  }
}
