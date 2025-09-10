import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { QuestionStats, RatingStats } from "./FeedbackAnswersSlice";

const BASE_URL = process.env.REACT_APP_API_URL;


export const fetchAnswersStats = createAsyncThunk(
  "feedback/fetchAnswersStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<QuestionStats[]>(`${BASE_URL}/feedbackAnswers/statusAnswers`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);

export const fetchRatingStats = createAsyncThunk(
  "feedback/fetchRatingStats",
  async (question_text: string, { rejectWithValue }) => {
    try {      
      const res = await axios.get<RatingStats[]>(`${BASE_URL}/feedbackAnswers/statusRating/${encodeURIComponent(question_text)}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);
