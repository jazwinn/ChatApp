import "./index.css";
import { useNavigate } from "react-router-dom";
import { useRef } from 'react';
import SockJS from "sockjs-client";
import Stomp from "stompjs";



export default function Login({StompClient, SetMessage, SetUser}){
    const navigate = useNavigate();
    const userName = useRef();
    
    const OnMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        console.log("message receive");
        SetMessage(prevMessages => [
            ...(prevMessages || []),
            { type: message.type, sender: message.sender, content: message.message }
        ]);
    };

    const OnMessagesReceived = (payload) => {
        const messages = JSON.parse(payload.body);
        console.log("messages receive");
        SetMessage(prevMessages => [
            ...(prevMessages || []),
            ...messages.map(msg=>({ type: msg.type, sender: msg.sender, content: msg.message }))
        ]);
    };


    const OnConnect = (Name)=>{
        StompClient.current.subscribe('/topic/public', OnMessageReceived);
        StompClient.current.subscribe("/user/queue/messages", (payload) => {
            const messages = JSON.parse(payload.body);
            console.log("Messages received:", messages);
            SetMessage(messages);
        });

        // Tell your username to the server
        StompClient.current.send("/app/chat.addUser",
            {},
            JSON.stringify({sender: Name, type: 'ENTER'})
        );
        SetUser(Name);
        setTimeout(() => {
            StompClient.current.send("/app/chat.loadMessages", {}, {});
        }, 5000);
        
        navigate("/chat");
    }

    const OnError = (error)=>{
        console.error('WebSocket connection failed:', error);
        alert('Could not connect to WebSocket server. Please try again!');
    }

    const Connect = (Name)=>{
        if(Name) {

            var socket = new WebSocket("http://localhost:8080/ws");
            StompClient.current = Stomp.over(socket); // assign to ref

            StompClient.current.connect({ username: Name }, () => OnConnect(Name), OnError);
        }
    }




    const loginUser = ()=>{
        const name = userName.current.value.trim(); // get the input value
        if (name) {
            //connect socket
            Connect(name);   
        } else {
            alert("Please enter a username");
        }
    }


    return(
        <>
            <div className="flex justify-center items-center h-full ">
                <div className="flex flex-col justify-center border border-white text-white p-16">
                    <h1 className=" text-center text-5xl pb-5">Enter Your Username</h1>
                    <input type="text" placeholder="Username" ref={userName} className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 p-0.5 pl-2"/>
                    <div className="flex justify-center pt-5">
                        <button className="p-1 pl-2 pr-2 border rounded-md bg-[#3a3939] hover:cursor-pointer hover:scale-110"
                        onClick={loginUser}
                        >Join</button>
                    </div>
                </div>
            </div>
        </>
    )
}


