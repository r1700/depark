import { createSlice } from "@reduxjs/toolkit";
import { fetchAnswersStats, fetchRatingStats } from "./FeedbackAnswersThunks";

export interface QuestionStats {
  id: string,
  question_text: string;
  count: number;
}

export interface RatingStats {
  question_text: string;
  rating: number;
  count: number;
}

interface FeedbackState {
  questionStats: QuestionStats[];
  ratingStats: RatingStats[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  questionStats: [],
  ratingStats: [],
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswersStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswersStats.fulfilled, (state, action) => {
        state.loading = false;
        state.questionStats = action.payload;
      })
      .addCase(fetchAnswersStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


      
    builder
      .addCase(fetchRatingStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.ratingStats = action.payload;
      })
      .addCase(fetchRatingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default feedbackSlice.reducer;
