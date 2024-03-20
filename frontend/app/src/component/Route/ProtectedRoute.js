import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({isAdmin,component:Component,...rest}) => {
    const {isLoading,isAuthenticated} = useSelector((state)=>state.user)
    
    const navigate = useNavigate(); 
    


    if (isLoading === false) {
        if(!isAuthenticated){
            return navigate("/")
        }

        // if(isAdmin === true && user.role !== "admin"){
        //     return navigate("/login")
        // }
        
        return <Component />
        
    }


}

export default ProtectedRoute