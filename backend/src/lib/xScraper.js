import Parser from "rss-parser";

const parser = new Parser();
const NITTER_INSTANCES = [
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.cz",
  "https://nitter.it",
  "https://nitter.net",
];

export const fetchXFeedback = async (handle) => {
  const cleanHandle = handle.replace("@", "");
  
  for (const instance of NITTER_INSTANCES) {
    try {
      console.log(`Trying Nitter instance: ${instance}`);
      const feed = await parser.parseURL(`${instance}/${cleanHandle}/rss`);
      
      return feed.items.map(item => ({
        id: item.guid || item.link,
        text: item.contentSnippet || item.content,
        author: handle,
        timestamp: new Date(item.pubDate),
        link: item.link,
        source: "X"
      }));
    } catch (error) {
      console.warn(`Failed to fetch from ${instance}: ${error.message}`);
    }
  }
  
  throw new Error("Failed to fetch X data from all available Nitter instances.");
};
