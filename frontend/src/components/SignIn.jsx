import { useRef } from "react";
import { useNavigate } from "react-router-dom";
export function SignIn() {
  const navigate = useNavigate();
  const inputFields = {
    username: "",
    password: "",
  }

  const emailRef = useRef();
  const passwordRef = useRef();

  return <div className="flex  justify-center  items-center h-screen w-max  sm:w-screen ">
    <div className="pl-5  border-0 border-white  sm:border-2 sm:border-gray-100 hover:border-black w-screen h-max sm:w-96 pr-5 sm:h-max rounded-md pb-5 shadow-none sm:shadow-xl hover:shadow-2xl">
      <div>
        <div className="mb-7 flex flex-col justify-center items-center">
          <div className="font-black text-4xl">Sign In</div>
          <div className="text-gray-500">Enter your credentials to access your account</div>
        </div>


        <div className="mb-5">
          <div className="font-light text-md mb-2">
            Email
          </div>
          <input type="text" ref={emailRef} onChange={() => { inputFields.username = emailRef.current.value }} placeholder="Enter First name" className="border-2 rounded-md px-3 py-2 w-full"></input>
        </div>

        <div className="mb-5">
          <div className="font-bold text-md mb-2">
            Password
          </div>
          <input type="text" ref={passwordRef} onChange={() => { inputFields.password = passwordRef.current.value; }} placeholder="Enter First name" className="border-2 rounded-md px-3 py-2 w-full"></input>
        </div>

        <div className="w-full ">
          <button onClick={() => { signInButtonOnClick() }} className="bg-black text-white text-md font-bold border-2 rounded-md px-10  py-2 w-full mr-5 ">Sign Up</button>
        </div>

        <div className="flex justify-center font-lightbold mt-3">
          Don't have an acount?
          <a href="/signup" className="hover:underline pl-2 hover:text-blue-500">Sign Up</a>
        </div>
      </div>

    </div>
  </div>

  async function signInButtonOnClick() {
    if (inputFields.email === "" || inputFields.password === "") {
      return alert("Enter all the details")
    }

    const res = await fetch("http://localhost:3000/api/v1/user/signin", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputFields)
    });
    const ans = await res.json();
    if (res.status === 411) {
      return alert(ans.msg)

    }
    alert("Login is successfully")

    navigate("/dashboard", { state: ans })
  }
}
