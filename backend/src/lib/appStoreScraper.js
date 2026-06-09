import appStore from "app-store-scraper";

export const fetchAppStoreReviews = async (appId, startDate, endDate) => {
  try {
    const allReviews = [];
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    for (let page = 1; page <= 10; page++) {
      console.log(`Fetching App Store reviews page ${page} for app ${appId}`);
      const reviews = await appStore.reviews({
        id: appId,
        sort: appStore.sort.RECENT,
        page: page
      });

      if (!reviews || reviews.length === 0) break;

      let hitOlderThanStart = false;

      for (const review of reviews) {
        const reviewDate = review.updated ? new Date(review.updated) : new Date();

        if (start && reviewDate < start) {
          hitOlderThanStart = true;
          continue;
        }

        if (end && reviewDate > end) {
          continue;
        }

        allReviews.push({
          id: review.id,
          text: review.text,
          author: review.userName,
          rating: review.score,
          timestamp: reviewDate,
          source: "App Store",
          title: review.title
        });
      }

      if (hitOlderThanStart) {
        break;
      }
    }

    return allReviews;
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
