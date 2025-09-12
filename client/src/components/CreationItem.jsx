import React, { useState } from "react";
import MarkDown from "react-markdown";
import { Trash2 } from "lucide-react";

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => setExpanded(!expanded);

  return (
    <div
      onClick={handleClick}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer"
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <h2>{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Group type button and trash icon */}
        <div className="flex items-center gap-2">
          <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full cursor-default">
            {item.type}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent the click to reach the parent click(expand). prevent expanding
              onDelete(item.id);
            }}
            className="text-red-500 hover:text-red-700 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div>
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="image"
                className="mt-3 w-full max-w-md"
              />
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700">
              <div className="reset-tw">
                <MarkDown>{item.content}</MarkDown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
