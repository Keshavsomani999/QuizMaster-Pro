import {configureStore} from "@reduxjs/toolkit";
import { QuizReducer, userReducer } from "./Reducers";

const store = configureStore({
    reducer:{
        user:userReducer,
        quiz:QuizReducer,
        
    },
});



export default store