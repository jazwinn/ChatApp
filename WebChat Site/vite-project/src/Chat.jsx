import "./index.css"
import ChatBox from "./Component/ChatBox"
import {useEffect, useRef } from "react"

export default function Chat({SetMessage, Message, name, StompClient }) {
    const bottomRef = useRef(null);
    const messageInput = useRef();

      useEffect(() => { //to scroll to bottom
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [Message]);

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

            fetch("http://localhost:5678/webhook/7dd955ab-8144-4fc4-9d9e-7552b10015dd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: name,
                    message: messageInput.current.value
                })
            }) .then(async (response) => {
                if (!response.ok) throw new Error("Request failed");
                
                
                const data = await response.json();
                const messageContent = data.output.message;
                 SetMessage(prevMessages => [
                    ...(prevMessages || []),
                    { type: "CHAT", sender:"n8n", content: messageContent }
                ]);
                console.log("Response from n8n:", messageContent);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

            // Clear the input
            messageInput.current.value = '';
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-full w-full text-white">
            <p className="flex items-center font-semibold mb-2">Group Chat</p>

            <div className="w-full h-[80%] overflow-y-auto flex flex-col gap-2">
                {Message.map((msg, index) => {
                    if(msg.type == "CHAT"){
                        return(
                        <ChatBox
                            key={index}
                            User={msg.sender}
                            Message={msg.content}
                        />
                        )
                    }
                    else if(msg.type == "ENTER"){
                        return(
                            <ChatBox User="" Message={`${msg.sender} have joined the chat.`} />
                        )
                    }
                    else if(msg.type == "LEAVE"){
                        return(
                            <ChatBox User="" Message={`${msg.sender} have left the chat.`} />
                        )
                    }

                })}
                <div ref={bottomRef} />   
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
