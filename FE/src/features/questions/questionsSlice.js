import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, authHeader } from '../../api/client';

export const fetchQuestions = createAsyncThunk('questions/fetchQuestions', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const response = await api.get('/question', {
      headers: authHeader(state),
    });
    return response.data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load questions');
  }
});

export const fetchQuestionsByAuthor = createAsyncThunk('questions/fetchQuestionsByAuthor', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const authorId = state.auth.user?.id || state.auth.user?._id;

    if (!authorId) {
      return [];
    }

    const response = await api.get(`/question/createdQuestions/${authorId}`, {
      headers: authHeader(state),
    });
    return response.data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load author questions');
  }
});

export const fetchQuestionById = createAsyncThunk('questions/fetchQuestionById', async (questionId, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const response = await api.get(`/question/${questionId}`, {
      headers: authHeader(state),
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load question');
  }
});

export const createQuestion = createAsyncThunk('questions/createQuestion', async (payload, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const response = await api.post('/question', payload, {
      headers: authHeader(state),
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create question');
  }
});

export const updateQuestion = createAsyncThunk('questions/updateQuestion', async ({ questionId, payload }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const response = await api.put(`/question/${questionId}`, payload, {
      headers: authHeader(state),
    });
    return response.data.updatedData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update question');
  }
});

export const deleteQuestion = createAsyncThunk('questions/deleteQuestion', async (questionId, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    await api.delete(`/question/${questionId}`, {
      headers: authHeader(state),
    });
    return questionId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete question');
  }
});

const initialState = {
  items: [],
  selectedQuestion: null,
  status: 'idle',
  detailStatus: 'idle',
  mutateStatus: 'idle',
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearQuestionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchQuestionsByAuthor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestionsByAuthor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuestionsByAuthor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchQuestionById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedQuestion = action.payload;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(createQuestion.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updateQuestion.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.items = state.items.map((q) => (q._id === action.payload._id ? action.payload : q));
        if (state.selectedQuestion?._id === action.payload._id) {
          state.selectedQuestion = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.items = state.items.filter((q) => q._id !== action.payload);
        if (state.selectedQuestion?._id === action.payload) {
          state.selectedQuestion = null;
        }
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearQuestionError } = questionsSlice.actions;
export default questionsSlice.reducer;
