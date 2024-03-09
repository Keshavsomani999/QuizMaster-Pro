import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: {},
  error:null
};

const quizState = {
  isQuiz:false,
  quiz:{},
  isLoading: false,
  error:null
};


export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('login_Request', (state) => {
      state.isAuthenticated = false;
      state.isLoading = true;
    })
    .addCase('Load_User_Request', (state) => {
      state.isAuthenticated = false;
      state.isLoading = true;
    })
    .addCase('login_Success', (state, action) => {
      
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
    })
    .addCase('Load_User_Success', (state, action) => {
      
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
    })
    .addCase('logout', (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    })
    .addCase('Login_Fail',(state,action)=>{
        return {
            ...state,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: action.payload,
          };
    })
    .addCase('Clear_Errors',(state)=>{
        return{
            ...state,
            error:null
        }
    })
    .addCase('Load_User_Fail',(state,action)=>{
      state.isAuthenticated = false;
      state.user = action.payload;
      state.isLoading = false;
      state.error=action.payload
    })
});


export const QuizReducer = createReducer(quizState, (builder) => {
  builder
    .addCase('createQuiz_Request', (state) => {
      state.isLoading = true;
    })
    .addCase('createQuiz_Success', (state) => {
      state.isLoading = false;
    })
    .addCase('Quiz_Success', (state,action) => {
      state.isLoading = false;
      state.isQuiz = true;
      state.quiz = action.payload;
    })
    .addCase('createQuiz_Fail',(state,action)=>{
      return {
          ...state,        
          isLoading: false,   
          error: action.payload,
        };
    })
    .addCase('Clear_Errors',(state)=>{
      return{
          ...state,
          error:null
      }
  })
});