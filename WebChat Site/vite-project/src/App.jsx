import { useState, useRef } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login'
import Chat from './Chat'

function App() {
  const [msg, setMessage] = useState([])
  const [User, setUser] = useState("")

  const stompClient = useRef(null);

  return (
    <>
    <BrowserRouter>
      <div className="flex justify-center items-center h-screen w-screen">
        <div className='flex justify-center h-screen w-110'>
          <Routes>
            <Route path="/" element={<Login SetMessage={setMessage} SetUser={setUser} StompClient={stompClient} />} />
            <Route path="/chat" element={<Chat SetMessage={setMessage} Message={msg} name={User} StompClient={stompClient}/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
