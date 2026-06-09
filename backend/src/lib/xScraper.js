import Parser from "rss-parser";

const parser = new Parser();
const NITTER_INSTANCES = [
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.cz",
  "https://nitter.it",
  "https://nitter.net",
];

export const fetchXFeedback = async (handle, startDate, endDate) => {
  const cleanHandle = handle.replace("@", "");
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  for (const instance of NITTER_INSTANCES) {
    try {
      console.log(`Trying Nitter instance: ${instance}`);
      const feed = await parser.parseURL(`${instance}/${cleanHandle}/rss`);
      
      const items = feed.items.map(item => {
        const timestamp = new Date(item.pubDate);
        return {
          id: item.guid || item.link,
          text: item.contentSnippet || item.content,
          author: handle,
          timestamp: timestamp,
          link: item.link,
          source: "X"
        };
      });

      return items.filter(item => {
        if (start && item.timestamp < start) return false;
        if (end && item.timestamp > end) return false;
        return true;
      });
    } catch (error) {
      console.warn(`Failed to fetch from ${instance}: ${error.message}`);
    }
  }
  
  throw new Error("Failed to fetch X data from all available Nitter instances.");
};
