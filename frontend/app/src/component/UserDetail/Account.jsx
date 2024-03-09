import React from 'react'
import "./User.css"
import { useSelector } from 'react-redux'
import Loader from '../Loader/Loader'

const Account = () => {

  const {user,isLoading} = useSelector(state => state.user)



  return (
    <>
    {isLoading ? <Loader /> : <>
    <div className='accountBody'>
    <div class="profile-container">
    <h1>Profile Details</h1>

    <div class="profile-info">
      <div class="info-item">
        <span class="info-label">Name:</span>
        <span class="info-value">{user.name}</span>
      </div>

      <div class="info-item">
        <span class="info-label">Email:</span>
        <span class="info-value">{user.email}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Role:</span>
        <span class="info-value">{user.role}</span>
      </div>

      <div class="info-item">
        <span class="info-label">Organized Quizzes:</span>
        <span class="info-value">{user.organizedQuizzes ? user.organizedQuizzes.length: 0}</span>
      </div>
    </div>

  </div>
  </div>
    </>}
    </>
  )
}

export default Account