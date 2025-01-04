import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const profile = location.state?.profile;
  const userId = location.state?.userID;

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/user/profile/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        navigate("/signin");
      } else {
        setError(response.data.message || "Logout failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during logout.");
    }
  };

  const handleUpdateProfile = async (userid) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      console.log(userid);

      const response = await axios.post(`http://localhost:8000/user/updateprofile/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        navigate(`/update-profile/${userid}`, { state: { profileInput: response.data, userId: userid } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while updating profile.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="container mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className='bg-white rounded-full px-10 py-11'>Image</div>
          <div>
            <p className="font-bold text-gray-100 italic hover:not-italic text-5xl">
              <span className='font-semibold text-3xl non-italic' >Hello, </span>{" "}
              {profile.firstName} {profile.lastName}
            </p>
          </div>
          <button onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
            Logout
          </button>
        </div>
        <div className="flex justify-between items-center mb-8">
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
            Change Photo
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => handleUpdateProfile(userId)}>
            Edit Profile
          </button>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg my-10">

          <p>
            <span className="font-semibold text-gray-100">Email:</span>{" "}
            {profile.email}
          </p>
          <p>
            <span className="font-semibold text-gray-100">Roll No:</span>{" "}
            {profile.rollNo}
          </p>
          <p>
            <span className="font-semibold text-gray-100">Branch:</span>{" "}
            {profile.branch}
          </p>
          <p>
            <span className="font-semibold text-gray-100">Semester:</span>{" "}
            {profile.semester}
          </p>
          <p>
            <span className="font-semibold text-gray-100">Section:</span>{" "}
            {profile.section}
          </p>
          <p>
            <span className="font-semibold text-gray-100">Contact:</span>{" "}
            {profile.contact}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;
