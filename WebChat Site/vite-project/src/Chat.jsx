import "./index.css"

export default function Chat(){
    return(
        <>
            <div className="flex justify-center items-center h-full text-white">
                <div className="flex gap-2 justify-center w-full">
                    <input type="text" placeholder="Type a Message" className="w-140 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 p-0.5 pl-2"/>
                    <button className="p-1 pl-2 pr-2 border rounded-md bg-[#3a3939] hover:cursor-pointer hover:scale-110">Send</button>
                </div>
            </div>
        </>
    )
}