import React from "react";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "@/store/useAuthStore";

export default function FetchEmailsButton() {
  const { authUser } = useAuthStore();

  const fetchEmails = async () => {
    if (!authUser || !authUser._id) {
      console.error("User not available in store");
      return alert("User not loaded. Refresh the page.");
    }

    try {
      const res = await axiosInstance.get(
        `/auth/google/emails?state=${authUser._id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );

      console.log("Emails:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={fetchEmails}
      style={{
        backgroundColor: "blue",
        padding: "5px",
        margin: "10px",
        borderRadius: "5px",
      }}
    >
      Fetch Emails
    </button>
  );
}
