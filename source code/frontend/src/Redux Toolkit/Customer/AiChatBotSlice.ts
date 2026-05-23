import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

// Define the initial state using an interface
interface AiChatBotState {
  response: string | null;
  loading: boolean;
  error: string | null;
  messages: any[];
}

const initialState: AiChatBotState = {
  response: null,
  loading: false,
  error: null,
  messages: [],
};

// Define the async thunk for sending the message to the chatbot
export const chatBot = createAsyncThunk<
  any,
  { message: string; productId?: number | null; userId?: number | null; context?: string | null }
>(
  "aiChatBot/generateResponse",
  async ({ message, productId, userId, context }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/chat",
        { message, context },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          params: {
            userId,
            productId,
          },
        }
      );
      console.log("response ", productId, response.data);
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate chatbot response"
      );
    }
  }
);

export const askProductQuestion = createAsyncThunk<
  any,any
>(
  "aiChatBot/askProductQuestion",
  async ({ productId, question }, { rejectWithValue }) => {
    try {
      const response = await api.post<{ answer: string }>(
        `/chat/product/${productId}`,
        { question }
      );
      console.log("chat answer ----- ",response.data)
      return response.data.answer;
      
    } catch (error: any) {
      console.log("error --- ",error)
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to get answer";
      return rejectWithValue(message);
    }
  }
);

// Create the slice
const aiChatBotSlice = createSlice({
  name: "aiChatBot",
  initialState,
  reducers: {
    resetChatState(state) {
      state.response = null;
      state.loading = false;
      state.error = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatBot.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        const { message } = action.meta.arg;

        const userPrompt = { message, role: "user" };
        state.messages = [...state.messages, userPrompt];
      })
      .addCase(chatBot.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload?.answer ?? null;
        state.messages = [
          ...state.messages,
          { role: "res", message: action.payload?.answer ?? action.payload },
        ];
      })
      .addCase(chatBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.messages.push({
          role: "res",
          message: action.payload as string || "Failed to generate chatbot response",
        });
      })
      .addCase(askProductQuestion.pending, (state,action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({role:"user",message:action.meta.arg.question})
      })
      .addCase(
        askProductQuestion.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;
          console.log("ans - ", action.payload)
          state.messages.push({role:'res',message:action.payload})
        }
      )
      .addCase(askProductQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.messages.push({
          role: "res",
          message: action.payload as string || "Failed to get answer",
        });
      });
  },
});

export const { resetChatState } = aiChatBotSlice.actions;

// Export the reducer
export default aiChatBotSlice.reducer;
