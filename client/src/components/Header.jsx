import React from "react";
import Navbar from "./Navbar";

function Header({ token, handleLogout }) {
  return (
    <div>
      <Navbar token={token} handleLogout={handleLogout} />
    </div>
  );
}

export default Header;
