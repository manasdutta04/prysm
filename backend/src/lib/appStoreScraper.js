import appStore from "app-store-scraper";

export const fetchAppStoreReviews = async (appId) => {
  try {
    const reviews = await appStore.reviews({
      id: appId,
      sort: appStore.sort.RECENT,
      page: 1
    });

    return reviews.map(review => ({
      id: review.id,
      text: review.text,
      author: review.userName,
      rating: review.score,
      timestamp: new Date(), // Scraper doesn't always provide full timestamp for all reviews
      source: "App Store",
      title: review.title
    }));
  } catch (error) {
    console.error("App Store Scraper Error:", error.message);
    throw new Error(`Failed to fetch App Store reviews: ${error.message}`);
  }
};

export const searchAppStore = async (term) => {
  try {
    const results = await appStore.search({
      term: term,
      num: 5
    });

    return results.map(app => ({
      id: app.id,
      name: app.title,
      icon: app.icon,
      bundleId: app.appId,
      developer: app.developer
    }));
  } catch (error) {
    console.error("App Store Search Error:", error.message);
    throw new Error(`Failed to search App Store: ${error.message}`);
  }
};
