import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAllUsers from "./ApiCalls/GetAllUsers";

function Search() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const userId = localStorage.getItem("userId"); // Get userId from local storage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAllUsers();
        setAllUsers(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search input
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔎 Search by username..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full md:w-[50%] lg:w-[60%] px-5 py-3 rounded-lg border border-muted dark:border-darkmuted 
                   bg-background text-foreground dark:bg-darkbackground dark:text-darkforeground 
                   focus:ring-2 focus:ring-primary dark:focus:ring-darkprimary transition-all duration-300 
                   placeholder-gray-500 dark:placeholder-gray-400 shadow-md"
      />

      {/* Display users only when there is a search term */}
      {searchText && (
        <div
          className="mt-2 w-full md:w-[50%] lg:w-[60%] bg-white dark:bg-darkbackground shadow-lg 
                        rounded-md border border-gray-200 dark:border-darkmuted"
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const profileLink =
                user.id === userId ? "/account" : `/user/${user.username}`;

              return (
                <Link
                  key={user.id}
                  to={profileLink}
                  className="block w-full p-3 border-b border-gray-200 dark:border-darkmuted 
                             last:border-b-0 hover:bg-gray-100 dark:hover:bg-darkmuted transition"
                >
                  <p className="text-gray-700 dark:text-darkforeground">
                    {user.username}
                  </p>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-darkmuted text-center p-3">
              No users found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
