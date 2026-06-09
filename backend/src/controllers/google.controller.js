import querystring from "querystring";
import axios from "axios";
import User from "../models/users/user.model.js";
import Feedback from "../models/raw feedbacks/feedback.model.js";

import { fetchEmails, fetchEmailDetails } from "../lib/fetchemail.js";

export const connectGoogle = (req, res) => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

  const scope = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "openid",
    "email",
    "profile",
  ];

  const params = querystring.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: scope.join(" "),
    state: req.user._id.toString(),
  });
  // console.log(
  //   "OAuth URL: https://accounts.google.com/o/oauth2/v2/auth?" + params
  // );
  res.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + params);
};

export const googleCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token, expires_in } = response.data;

    const userId = req.query.state;
    const user = await User.findById(userId);

    user.gmail = {
      accessToken: access_token,
      refreshToken: refresh_token || user.gmail.refreshToken, // Google sometimes returns null refresh_token
      tokenExpiry: new Date(Date.now() + expires_in * 1000),
    };

    await user.save();

    res.redirect(`http://localhost:5173/dashboard?gmail=connected`);
  } catch (err) {
    console.error("Google OAuth Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to connect Gmail" });
  }
};

// export const getUserEmails = async (req, res) => {
//   try {
//     const userId = req.query.state;
//     const user = await User.findById(userId);

//     if (!user.gmail || !user.gmail.accessToken) {
//       return res.status(400).json({ error: "Gmail account not connected" });
//     }

//     const emails = await fetchEmails(user);

//     res.json({ emails });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error fetching user emails" });
//   }
// };
export const getUserEmails = async (req, res) => {
  try {
    const userId = req.query.state;
    const user = await User.findById(userId);

    if (!user.gmail || !user.gmail.accessToken) {
      return res.status(400).json({ error: "Gmail account not connected" });
    }

    // 1) Fetch list of email message IDs
    const emailList = await fetchEmails(user);

    if (!emailList.messages || emailList.messages.length === 0) {
      return res.json({ emails: [] });
    }

    let savedEmails = [];

    // 2) Process each email
    for (const msg of emailList.messages) {
      const fullEmail = await fetchEmailDetails(user, msg.id);

      // Extract useful fields
      const headers = fullEmail.payload.headers;

      const subject =
        headers.find((h) => h.name === "Subject")?.value || "No Subject";

      const from =
        headers.find((h) => h.name === "From")?.value || "Unknown Sender";

      const date =
        headers.find((h) => h.name === "Date")?.value ||
        new Date().toISOString();

      const snippet = fullEmail.snippet;

      // 3) Prepare Feedback entry

      const feedbackData = {
        userId,
        source: "gmail",
        externalId: msg.id, // Gmail message ID
        content: snippet || subject, // fallback if snippet missing
        metadata: {
          subject,
          from,
          threadId: msg.threadId,
          rawHeaders: headers,
        },
        timestamp: new Date(date),
      };

      // 4) Prevent duplicates — Gmail message IDs never change
      const existing = await Feedback.findOne({
        userId,
        externalId: msg.id,
      });

      if (!existing) {
        const saved = await Feedback.create(feedbackData);
        savedEmails.push(saved);
      } else {
        savedEmails.push(existing);
      }
    }

    res.json({ savedEmails });
  } catch (err) {
    console.error("Email Save Error:", err);
    res.status(500).json({ error: "Failed to save emails" });
  }
};
