import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserUploads from "../components/UserUploads";

function UserPage({ user }) {
  console.log(user);
  return (
    <div>
      <h3>UserPage</h3>
      <UserUploads user={user} />
    </div>
  );
}

export default UserPage;
