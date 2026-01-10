import api from "./api";

/**
 * Generate code from pseudocode (single or multiple languages)
 * @param {string} pseudocode - The pseudocode / algorithm description
 * @param {array} languages - Target languages (["python"], ["python","java"], etc.)
 * @param {string} level - beginner | intermediate | pro
 * @returns {Promise}
 */
export const generateCode = async (pseudocode, languages, level) => {
  try {
    const response = await api.post("/generate-code", {
      pseudocode,
      languages,
      level
    });

    return response.data;
  } catch (error) {
    console.error("Code generation error:", error);
    throw error;
  }
};
