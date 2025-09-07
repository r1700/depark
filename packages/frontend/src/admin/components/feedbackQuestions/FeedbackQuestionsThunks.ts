import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FeedbackQuestion } from './FeeadbackQuestionsMetadata';

const BASE_URL = process.env.REACT_APP_API_URL;


export const fetchFeedbackQuestions = createAsyncThunk(
  'feedbackQuestions/fetchFeedbackQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<FeedbackQuestion[]>(`${BASE_URL}/feedbackQuestions`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addFeedbackQuestion = createAsyncThunk(
  'feedbackQuestions/addFeedbackQuestion',
  async (newQuestion: Omit<FeedbackQuestion, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post<FeedbackQuestion>(
        `${BASE_URL}/feedbackQuestions`,
        newQuestion
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateFeedbackQuestion = createAsyncThunk(
  'feedbackQuestions/updateFeedbackQuestion',
  async ( question: FeedbackQuestion, { rejectWithValue }) => {
    try {      
      const response = await axios.put<FeedbackQuestion>(
        `${BASE_URL}/feedbackQuestions/${question.id}`,
        {question_text: question.question_text, is_active: question.is_active}
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
