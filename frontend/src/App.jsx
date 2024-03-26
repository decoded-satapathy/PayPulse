import { Routes, Route, BrowserRouter } from "react-router-dom";
import { SignUp } from "./components/SignUp"
import { SignIn } from "./components/SignIn"
import { Dashboard } from "./components/Dashboard"
import { Send } from "./components/Send"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/signin" element={<SignIn></SignIn>}></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path="/send" element={<Send></Send>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
