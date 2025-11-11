import "./index.css";

export default function Login(){

    return(
        <>
            <div className="flex justify-center items-center h-full ">
                <div className="flex flex-col justify-center border border-white text-white p-16">
                    <h1 className=" text-center text-5xl pb-5">Enter Your Username</h1>
                    <input type="text" placeholder="Username" className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 p-0.5 pl-2"/>
                    <div className="flex justify-center pt-5">
                        <button className="p-1 pl-2 pr-2 border rounded-md bg-[#3a3939] hover:cursor-pointer hover:scale-110">Join</button>
                    </div>
                </div>
            </div>
        </>
    )
}