import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFeedbackQuestions, addFeedbackQuestion, updateFeedbackQuestion } from './FeedbackQuestionsThunks';
import { FeedbackQuestion } from './FeeadbackQuestionsMetadata';

export interface FeedbackQuestionsState {
  questions: FeedbackQuestion[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackQuestionsState = {
  questions: [],
  loading: false,
  error: null,
};

const feedbackQuestionsSlice = createSlice({
  name: 'feedbackQuestions',
  initialState,
  reducers: {
    setFeedbackQuestions: (state, action: PayloadAction<FeedbackQuestion[]>) => {
      state.questions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbackQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchFeedbackQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFeedbackQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedbackQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(addFeedbackQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFeedbackQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedbackQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(updateFeedbackQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFeedbackQuestions } = feedbackQuestionsSlice.actions;
export default feedbackQuestionsSlice.reducer;
