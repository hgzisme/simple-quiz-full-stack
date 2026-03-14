import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, authHeader } from '../../api/client';

export const fetchQuizzes = createAsyncThunk('quizzes/fetchQuizzes', async (_, thunkAPI) => {
  try {
    const response = await api.get('/quizzes');
    return response.data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load quizzes');
  }
});

export const fetchQuizById = createAsyncThunk('quizzes/fetchQuizById', async (quizId, thunkAPI) => {
  try {
    const quizResponse = await api.get(`/quizzes/${quizId}`);
    const quiz = quizResponse.data.data;

    // Backward compatibility: if API returns only IDs, keep shape safe.
    const questions = (quiz.questions || []).filter((item) => typeof item === 'object');
    return { ...quiz, questions };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load quiz details');
  }
});

export const createQuiz = createAsyncThunk('quizzes/createQuiz', async (payload, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const response = await api.post('/quizzes', payload, {
      headers: authHeader(state),
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create quiz');
  }
});

export const updateQuiz = createAsyncThunk('quizzes/updateQuiz', async ({ quizId, payload }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const response = await api.put(`/quizzes/${quizId}`, payload, {
      headers: authHeader(state),
    });
    return response.data.updatedQuiz;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update quiz');
  }
});

export const deleteQuiz = createAsyncThunk('quizzes/deleteQuiz', async (quizId, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    await api.delete(`/quizzes/${quizId}`, {
      headers: authHeader(state),
    });
    return quizId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete quiz');
  }
});

export const addQuestionToQuiz = createAsyncThunk(
  'quizzes/addQuestionToQuiz',
  async ({ quizId, payload }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      await api.post(`/quizzes/${quizId}/question`, payload, {
        headers: authHeader(state),
      });
      return quizId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add question to quiz');
    }
  }
);

export const addManyQuestionsToQuiz = createAsyncThunk(
  'quizzes/addManyQuestionsToQuiz',
  async ({ quizId, payload }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      await api.post(`/quizzes/${quizId}/questions`, payload, {
        headers: authHeader(state),
      });
      return quizId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add questions in batch');
    }
  }
);

const initialState = {
  items: [],
  selectedQuiz: null,
  status: 'idle',
  detailStatus: 'idle',
  mutateStatus: 'idle',
  error: null,
};

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearQuizError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(createQuiz.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updateQuiz.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.items = state.items.map((quiz) => (quiz._id === action.payload._id ? action.payload : quiz));
        if (state.selectedQuiz?._id === action.payload._id) {
          state.selectedQuiz = {
            ...state.selectedQuiz,
            ...action.payload,
          };
        }
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteQuiz.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.items = state.items.filter((quiz) => quiz._id !== action.payload);
        if (state.selectedQuiz?._id === action.payload) {
          state.selectedQuiz = null;
        }
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(addQuestionToQuiz.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(addQuestionToQuiz.fulfilled, (state) => {
        state.mutateStatus = 'succeeded';
      })
      .addCase(addQuestionToQuiz.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(addManyQuestionsToQuiz.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(addManyQuestionsToQuiz.fulfilled, (state) => {
        state.mutateStatus = 'succeeded';
      })
      .addCase(addManyQuestionsToQuiz.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearQuizError } = quizzesSlice.actions;
export default quizzesSlice.reducer;
