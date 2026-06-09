import axios from "axios";
import User from "../models/users/user.model.js";

/**
 * Fetch the user's Gmail messages
 */
export async function fetchEmails(user) {
  try {
    const url =
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10";

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.gmail.accessToken}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gmail Fetch Error:", err.response?.data || err.message);
    throw new Error("Failed to fetch emails");
  }
}
export async function fetchEmailDetails(user, messageId) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${user.gmail.accessToken}`,
    },
  });

  return response.data; // Contains subject, from, body, snippet, etc.
}
