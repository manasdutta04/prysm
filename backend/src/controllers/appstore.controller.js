import { fetchAppStoreReviews, searchAppStore } from "../lib/appStoreScraper.js";

export const searchApps = async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const apps = await searchAppStore(term);
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await fetchAppStoreReviews(id);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
