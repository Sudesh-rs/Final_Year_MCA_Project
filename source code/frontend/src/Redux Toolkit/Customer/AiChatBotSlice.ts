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
  { prompt: any; productId: number | null | undefined; userId: number | null }
>(
  "aiChatBot/generateResponse",
  async ({ prompt, productId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/chat", prompt, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        params: {
          userId,
          productId,
        },
      });
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
  any,
  { productId?: string | null; question: string }
>(
  "aiChatBot/askProductQuestion",
  async ({ productId, question }, { rejectWithValue }) => {
    try {
      const url = productId ? `/chat/product/${productId}` : `/chat`;
      const body = productId ? { question } : { message: question };

      const response = await api.post<{ answer: string }>(url, body);
      console.log("chat answer ----- ", response.data);
      return response.data.answer;
    } catch (error: any) {
      console.log("error --- ", error);
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
    resetChat: (state) => {
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
        const { prompt } = action.meta.arg;

        const userPrompt = { message: prompt.prompt, role: "user" };
        state.messages = [...state.messages, userPrompt];
      })
      .addCase(chatBot.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.messages = [...state.messages, action.payload];
      })
      .addCase(chatBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(askProductQuestion.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({ role: "user", message: action.meta.arg.question });
      })
      .addCase(askProductQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: "assistant", message: action.payload });
      })
      .addCase(askProductQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetChat } = aiChatBotSlice.actions;

// Export the reducer
export default aiChatBotSlice.reducer;
