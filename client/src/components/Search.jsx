import React, { useEffect, useState } from "react";
const URL = "http://localhost:3000/api";
import GetAllUsers from "./ApiCalls/GetAllUsers";
import { Link } from "react-router-dom";

function Search() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAllUsers();
        setAllUsers(data);
        console.log("Fetched Users:", data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter users from search
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <input
        type="text"
        placeholder="Search by username..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Show user list only when searchText is not empty */}
      {searchText && (
        <div className="mt-2 w-full max-w-xs bg-white shadow-md rounded-md border border-gray-200">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link
                key={user.id}
                to={`/user/${user.username}`}
                className="block w-full p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition"
              >
                <p className="text-gray-700">{user.username}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center p-3">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
