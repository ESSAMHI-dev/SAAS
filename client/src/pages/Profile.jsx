import { useUser, useClerk } from '@clerk/clerk-react';
import { useState, useRef, useEffect } from 'react';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={user.imageUrl || 'https://www.gravatar.com/avatar?d=mp'}
          alt="avatar"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-3 px-4 border-b">
            <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
            <p className="text-sm text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
