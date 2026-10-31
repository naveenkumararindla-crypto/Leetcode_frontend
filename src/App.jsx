import { useState ,useEffect} from 'react'
// import { Routes,Route } from 'react-router'
import HomePage from './Pages/Homepage';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import './App.css'
import { checkAuth } from './Pages/authslice';
import {useDispatch,useSelector} from "react-redux"
import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from './Pages/Adminpanel';
function App() {
  
     const {isAuthenticated,user} = useSelector((state)=>state.auth) ;
const dispatch = useDispatch();

useEffect(()=>{
dispatch(checkAuth());

},[])
               return(
                <>
                <Routes>
           <Route path="/" element={isAuthenticated?<HomePage></HomePage>:<Navigate to="/signup"></Navigate>}></Route>
           <Route path="/login" element={<Login></Login>}></Route>
           <Route path="/signup" element={<Signup></Signup>}></Route>
           <Route
path="/admin"
element={
isAuthenticated && user?. role === 'admin' ?
<AdminPanel /> :
<Navigate to="/" />
}
/>

</Routes>
                </>
               )
}

export default App
