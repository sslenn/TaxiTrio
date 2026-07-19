import api from "../lib/axios";

export const submitReview = (data) => api.post("/reviews", data);
export const getMyReviews = () => api.get("/reviews/my-reviews");
