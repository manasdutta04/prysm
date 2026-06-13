export const cleanEmailText = (text) => {
  if (!text) return "";

  return text
    .replace(/\b\d{10}\b/g, "[PHONE]")
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[EMAIL]")
    .replace(/https?:\/\/\S+/g, "[URL]")
    .replace(/\s+/g, " ")
    .trim();
};
