import { fetchXFeedback } from "../lib/xScraper.js";

export const getXFeedback = async (req, res) => {
  const { handle } = req.params;

  if (!handle) {
    return res.status(400).json({ message: "Handle is required" });
  }

  try {
    const feedback = await fetchXFeedback(handle);
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error in getXFeedback:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
