/* ---------------- EMAIL VALIDATION ---------------- */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/* ---------------- PASSWORD VALIDATION ----------------
 Rules:
 - Minimum 8 characters
 - First letter uppercase
 - At least one number
 - At least one special character
*/
export const isValidPassword = (password) => {
  const pattern =
    /^[A-Z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}[0-9!@#$%^&*]/;
  return pattern.test(password);
};
