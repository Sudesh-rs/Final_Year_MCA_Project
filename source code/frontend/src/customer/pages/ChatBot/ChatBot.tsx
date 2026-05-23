import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  askProductQuestion,
  resetChatState,
} from "../../../Redux Toolkit/Customer/AiChatBotSlice";
import { Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PromptMessage from "./PromptMessage";
import ResponseMessage from "./ResponseMessage";
import CloseIcon from '@mui/icons-material/Close';

interface ChatBotProps{
    handleClose:(e:any)=>void;
    productId:string | number
}

const ChatBot = ({handleClose,productId}:ChatBotProps) => {
    const dispatch = useAppDispatch();
    const [prompt, setPrompt] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
  
    const {aiChatBot}=useAppSelector(store=>store);

    const handleGivePrompt = (e:any) => {
        e.stopPropagation();
        if (!prompt.trim()) return;

        dispatch(
            askProductQuestion({
                productId,
                question: prompt,
            })
        );

        setPrompt("");
    };

    const handlePromptChange = (e: any) => {
        setPrompt(e.target.value);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [aiChatBot.messages]);

    useEffect(() => {
        dispatch(resetChatState());
    }, [dispatch, productId]);

    return (
        <div className="rounded-lg">
            <div className="w-full lg:w-[40vw] h-[82vh] shadow-2xl bg-white z-50 rounded-lg">
                <div className=" h-[12%] flex justify-between items-center px-5 bg-slate-100 rounded-t-lg">
                    <div className="flex items-center gap-3 ">
                        <h1 className="logo">IntelliMart</h1>
                        <div>
                            <p className="font-semibold">AI Assistant</p>
                            <p className="text-xs text-slate-600">
                                {`📦 Product Query (ID: ${productId})`}
                            </p>
                        </div>
                    </div>
                    <div>
                        <IconButton 
                        onClick={handleClose}
                        color="primary"
                        >
                            <CloseIcon/>
                        </IconButton>
                    </div>
                </div>

                <div className="h-[78%] p-5 flex flex-col py-5 px-5 overflow-y-auto  custom-scrollbar">

                    <div className="mb-4 pb-4 border-b border-slate-200">
                        <p className="text-sm text-slate-700 font-medium mb-2">
                            📦 Product Assistant
                        </p>
                        <p className="text-sm text-slate-600">
                            Ask questions about this product for detailed information.
                        </p>
                    </div>

                    { aiChatBot.messages.map((item:any, index:number) =>
                        item.role == "user" ? (
                            <div ref={chatContainerRef} className="self-end" key={index}>
                                <PromptMessage message={item.message} index={index} />
                                {aiChatBot.loading && <h1 className=" font-bold">Thinking ...</h1>}
                            </div>
                        ) : (
                            <div
                                ref={chatContainerRef}
                                className="self-start"
                                key={index}
                            >
                                <ResponseMessage message={item.message} />
                            </div>
                        )
                    )}
                    {aiChatBot.loading && <p>fetching data...</p>}
                    {aiChatBot.error && (
                        <div className="text-sm text-red-600 mt-2">
                            {aiChatBot.error}
                        </div>
                    )}

                </div>

                <div className=" h-[10%] flex items-center">
                    <input
                        onChange={handlePromptChange}
                        value={prompt}
                        type="text"
                        placeholder="give your prompt"
                        className="rounded-bl-lg pl-5 h-full w-full bg-slate-100 border-none outline-none"
                    />
                    <Button
                        sx={{ borderRadius: "0 0 0.5rem 0" }}
                        className="h-full "
                        onClick={handleGivePrompt}
                        variant="contained"
                    >
                        <SendIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
