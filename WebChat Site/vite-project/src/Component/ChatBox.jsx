import "../index.css"

export default function ChatBox({User, Message}){



    let initial = User[0]? User[0].toUpperCase() : "X";
    return(
        <>
            <div className="flex flex-col">
                <div className="flex h-auto w-full pt-1 pb-1 gap-1">              
                    <div className="flex flex-col ">
                        <div className="aspect-square rounded-full h-8 bg-red-500 flex justify-center items-center">{initial}</div>
                        <p className="flex justify-center text-[35%] pt-0.5 text-[#b6b6b6] font-semibold">{User}</p>                
                    </div>
                    <p className="pl-3 flex flex-wrap items-center text-[65%]">{Message}</p>
                    
                </div>     
                <hr className="border-t border-gray-700 w-full my-1" />
            </div>
      

        </>
    )
}