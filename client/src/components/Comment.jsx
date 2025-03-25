import React, { useState } from "react";

const Comment = ({ text, user }) => {
  if (!text) return <p className="text-gray-500 italic">[No content]</p>;

  const words = text.split(" ");
  const isLong = words.length > 10;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full flex items-start space-x-2">
      <span className="font-semibold whitespace-nowrap">
        {user || "Anonymous"}:
      </span>
      <p className="flex-1 break-words">
        {isLong && !expanded ? words.slice(0, 10).join(" ") + "..." : text}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 dark:text-blue-400 ml-2"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </p>
    </div>
  );
};

export default Comment;
