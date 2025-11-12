import "./index.css"
import ChatBox from "./Component/ChatBox"
import { useRef } from "react"

export default function Chat({ Message, name, StompClient }) {
    const messageInput = useRef();

    const SendMessage = () => {

        if (messageInput.current && StompClient.current) {
            const chatMessage = {
                sender: name,
                message: messageInput.current.value,
                type: 'CHAT'
            };
            console.log("sendmessage");
            // Send the message to the server
            StompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));

            // Clear the input
            messageInput.current.value = '';
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-full w-full text-white">
            <p className="flex items-center font-semibold mb-2">Group Chat</p>

            <div className="w-full h-[80%] overflow-y-auto flex flex-col gap-2">
                {Message.map((msg, index) => (
                    
                    <ChatBox
                        key={index}
                        User={msg.sender}
                        Message={msg.content}
                    />
                ))}
            </div>

            <div className="flex gap-2 justify-center w-full mt-2">
                <input
                    type="text"
                    ref={messageInput}
                    placeholder="Type a Message"
                    className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 p-0.5 pl-2"
                    onKeyDown={(e) => e.key === 'Enter' && SendMessage()}
                />
                <button
                    className="p-1 pl-2 pr-2 border rounded-md bg-[#3a3939] hover:cursor-pointer hover:scale-105"
                    onClick={SendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    )
}
