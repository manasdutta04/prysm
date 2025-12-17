const cron = require("node-cron");
const { fetchAndStoreReviews } = require("./playstoreService");

const APP_ID = "com.spotify.music";

// Runs every day at 2 AM
cron.schedule("0 2 * * *", async () => {
  console.log("Running Play Store auto-fetch job");
  await fetchAndStoreReviews(APP_ID, 200);
});
