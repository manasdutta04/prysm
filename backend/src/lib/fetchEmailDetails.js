export async function fetchEmailDetails(user, messageId) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${user.gmail.accessToken}`,
    },
  });

  return response.data; // Contains subject, from, body, snippet, etc.
}
