import './App.css';
import { BrowserRouter as Router, Route,Routes,Navigate } from "react-router-dom"
import Login from './component/Auth/Login';
import Signup from './component/Auth/Signup';
import Home from './component/Home';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import Account from './component/UserDetail/Account';
import Navbar from './component/Navbar/Navbar';
import CreateQuiz from './component/Quiz/CreateQuiz';
import Quiz from './component/Quiz/Quiz';
import TeacherList from './component/Home/TeacherList';
import ProtectedRoute from './component/Route/ProtectedRoute';
import EditQuiz from './component/Quiz/EditQuiz';
import CameraCapture from './component/Camera/CameraCapture';

function App() {
  
  const dispatch = useDispatch()

  const {isAuthenticated,user} = useSelector(state => state.user)
  const {isQuiz} = useSelector(state => state.quiz)
  const loadUser = async() =>{
    try{
      dispatch({
        type:"Load_User_Request"
      })

    const {data} = await axios.get("http://localhost:4000/api/v1/me",{withCredentials: true,});

      dispatch({
        type:"Load_User_Success",
        payload:data.userDetails.user
      })

    }
    catch (error){
      console.log(error);
      dispatch({
        type:"Load_User_Fail",
        payload:error.response.data.message
      })
    }
  }

  useEffect(() => {
    loadUser()
   
  }, [])
  

  return (
    <div className={isAuthenticated && !isQuiz ? "master" : ""}    >
    <Router>
      {isAuthenticated && !isQuiz && <Navbar />}
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/home' element={user && user.role === "student" ? <TeacherList />: <CreateQuiz />}/> 
        <Route path='/account' element={<ProtectedRoute component={Account}/>}/> 
        <Route path='/create' element={<ProtectedRoute  component={CreateQuiz}/>}/>  
        <Route path='/edit/:quizId' element={<ProtectedRoute  component={EditQuiz}/>}/>  
        <Route path='/quiz' element={<Quiz />}/> 
        <Route path='/startQuiz' element={<Home />}/> 
        <Route path='/camera' element={<CameraCapture />}/> 
        
      </Routes>
    </Router>
    </div>
  );
}

export default App;
