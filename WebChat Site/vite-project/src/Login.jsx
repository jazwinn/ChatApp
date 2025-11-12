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

        if (message.type === 'JOIN') {
            console.log("New member joined:", message.sender);
            SetMessage(prevMessages => [...(prevMessages || []), { type: message.type, sender: message.sender }]);
        } else if (message.type === 'LEAVE') {
            console.log("Member left:", message.sender);
            SetMessage(prevMessages => [...(prevMessages || []), { type: message.type, sender: message.sender }]);
        } else {
            // Normal chat message
            SetMessage(prevMessages => [
                ...(prevMessages || []),
                { type: message.type, sender: message.sender, content: message.message }
            ]);
        }
    };


    const OnConnect = (Name)=>{
        StompClient.current.subscribe('/topic/public', OnMessageReceived);

        // Tell your username to the server
        StompClient.current.send("/app/chat.addUser",
            {},
            JSON.stringify({sender: Name, type: 'JOIN'})
        )
        SetUser(Name)
        navigate("/chat");
    }

    const OnError = (error)=>{
        console.error('WebSocket connection failed:', error);
        alert('Could not connect to WebSocket server. Please try again!');
    }

    const Connect = (Name)=>{
        if(Name) {

            var socket = new SockJS("http://localhost:8080/ws");
            StompClient.current = Stomp.over(socket); // assign to ref

            StompClient.current.connect({}, () => OnConnect(Name), OnError);
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


