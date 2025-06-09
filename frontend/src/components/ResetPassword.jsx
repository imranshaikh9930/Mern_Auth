import React,{useState} from 'react'
import "./ForgotPassword.css";
// eslint-disable-next-line react/prop-types
const ResetPassword = ({handleResetPassword,newPassword,setNewPassword}) => {


  return (

   <div className="form-container">
    <div className="logo-container">Reset Password</div>

    <form className="form" onSubmit={handleResetPassword}>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <button className="form-submit-btn" type="submit">
        set Password
      </button>
    </form>

  </div>
  )
}

export default ResetPassword