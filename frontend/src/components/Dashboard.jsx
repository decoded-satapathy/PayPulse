import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export function Dashboard() {
  const [userList, setUserList] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();
  const currentUserInfo = location.state.userInfo;
  const currentUserToken = location.state.token;
  const currentUserPersonalInfo = currentUserInfo.personalDetails;
  const currentUserAccountInfo = currentUserInfo.accountDetails;
  useEffect(() => {
    async function fetchingAllUsers() {
      console.log("auth token is :" + currentUserToken)
      const response = await fetch("http://localhost:3000/api/v1/user/bulk")
      const jsonResposne = await response.json();
      const allUsersList = jsonResposne.users;
      let usersListExceptCurrentUser = [];
      for (let i = 0; i < allUsersList.length; i++) {
        if ((allUsersList[i].firstName === currentUserPersonalInfo.firstName) && (allUsersList[i]._id === currentUserPersonalInfo._id)) {
          continue;
        }
        usersListExceptCurrentUser.push(allUsersList[i]);
      }
      setUserList(usersListExceptCurrentUser);
    }
    fetchingAllUsers();
  }, [])

  function goToSendMoneyPage(toId, receiverFirstName) {
    navigate("/send", { state: { fromId: currentUserPersonalInfo._id, toId: toId, receiverFirstName: receiverFirstName, senderToken: currentUserToken } })
  }

  async function fuzzyFindingUsers(filter) {
    const response = await fetch("http://localhost:3000/api/v1/user/bulk?filter=" + filter);
    const jsonResposne = await response.json();
    const allUsersList = jsonResposne.users;
    let usersListExceptCurrentUser = [];
    for (let i = 0; i < allUsersList.length; i++) {
      if ((allUsersList[i].firstName === currentUserPersonalInfo.firstName) && (allUsersList[i]._id === currentUserPersonalInfo._id)) {
        continue;
      }
      usersListExceptCurrentUser.push(allUsersList[i]);
    }
    setUserList(usersListExceptCurrentUser);



  }

  const inputRef = useRef();
  return <div className="w-11/12 sm:w-11/12 flex justify-center items-center h-screen">
    <div className="h-max w-full ml-5">
      <div className="flex justify-between items-center my-5 ">
        <div className="font-extrabold text-3xl">
          Payments App
        </div>
        <div className="flex items-center justify-between">
          <div className="mx-2">
            Hello, {currentUserPersonalInfo.firstName}
          </div>
          <div className="rounded-full border-2 bg-gray-200 border-black text-lg w-10 h-10 flex justify-center items-center font-extrabold mr-3 ">
            {currentUserPersonalInfo.firstName.split("")[0]}
          </div>
        </div>
      </div>

      <div className="font-extrabold text-xl">
        <div>
          Your Balance is ${currentUserAccountInfo.balance}
        </div>
        <div>
          Users
        </div>
      </div>


      <input ref={inputRef} onChange={() => { fuzzyFindingUsers(inputRef.current.value) }} type="text" placeholder="Search users...." className="border-2 border-gray-400 rounded-md w-full mx-3 my-3 px-2 py-2"></input>

      <div>
        {userList.map((user) => {
          return <UserListing userId={user._id} firstName={user.firstName} lastName={user.lastName}></UserListing>
        })
        }
      </div>

    </div>
  </div>
  function UserListing(props) {
    const firstLetter = props.firstName.split("")[0]
    return <div className="flex justify-around items-center my-3 mx-2">
      <div className="flex w-full  items-center">
        <div className="rounded-full border-2 bg-gray-200 border-black text-lg w-10 h-10 flex justify-center items-center font-extrabold">{firstLetter}</div>
        <div className="mx-2 text-lg">
          {props.firstName + " " + props.lastName}
        </div>
      </div>

      <button onClick={() => {
        goToSendMoneyPage(props.userId, props.firstName);
      }} className="bg-black rounded-xl text-white flex justify-center items-center px-5 py-2 w-60 sm:w-40">Send Money</button>

    </div>
  }
}

