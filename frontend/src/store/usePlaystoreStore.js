import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const usePlaystoreStore = create((set) => ({
  isConnected: false,
  appId: null,
  appName: null,
  isLoading: false,
  isFetching: false,

  // Check connection status on page load
  checkStatus: async () => {
    try {
      const res = await axiosInstance.get("/playstore/status");
      set({
        isConnected: res.data.isConnected,
        appId: res.data.appId || null,
        appName: res.data.appName || null,
      });
    } catch (error) {
      console.log("Error in checkStatus", error.message);
    }
  },

  // Connect Play Store app
  connect: async (appId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/playstore/connect", { appId });
      set({
        isConnected: true,
        appId: res.data.appId,
        appName: res.data.appName,
      });
      toast.success(`Connected — ${res.data.appName}`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to connect");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Disconnect
  disconnect: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/playstore/disconnect");
      set({ isConnected: false, appId: null, appName: null });
      toast.success("Play Store disconnected");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to disconnect");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch & save reviews
  fetchReviews: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/playstore/reviews");
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
    } finally {
      set({ isFetching: false });
    }
  },
}));