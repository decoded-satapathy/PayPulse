import { useRef } from "react";
import { useLocation } from "react-router-dom"
export function Send() {

  const amountInputRef = useRef();
  const location = useLocation();
  const inputFromDashboard = location.state;
  console.log(inputFromDashboard)
  const { fromId, toId, receiverFirstName, senderToken } = inputFromDashboard;
  return <div className="w-screen h-screen flex justify-center items-center  ">
    <div className="flex flex-col justify-center  border-2 border-gray-100 rounded-xl drop-shadow-2xl shadow-2xl w-96 h-60 sm:w-1/2 sm:h-max hover:border-gray-200 py-5 px-20">
      <div className="text-4xl font-black flex justify-center mb-20" >
        Send Money
      </div>
      <div className="flex justify-start items-center">
        <div className="bg-green-500 text-white  rounded-full border-2 border-white text-2xl w-16 h-16 flex justify-center items-center font-extrabold">{receiverFirstName.split("")[0]}</div>
        <div className="text-2xl font-extrabold mx-5">
          {receiverFirstName}
        </div>
      </div>

      <div className="text-lg font-semibold">
        Amount (in $)
      </div>

      <input ref={amountInputRef} type="number" placeholder="Enter Amount" className="border-2 border-gray-400 rounded-xl px-5 py-2 my-2"></input>
      <button className="bg-green-500  text-white text-xl font-semibold rounded-xl py-2 my-3 " onClick={() => {
        intiateTransfer();
      }}>Intiate Transfer</button>
    </div>
  </div>

  async function intiateTransfer() {
    const authorizationHeader = 'Bearer ' + senderToken;
    console.log("authorization:" + authorizationHeader)
    const response = await fetch("http://localhost:3000/api/v1/account/transfer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorizationHeader
      },
      body: JSON.stringify({
        to: toId,
        amount: amountInputRef.current.value
      })
    });

    const jsonResponse = await response.json();
    return alert(jsonResponse.msg)
  }
}

