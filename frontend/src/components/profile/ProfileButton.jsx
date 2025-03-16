import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProfileButton = ({ user, progress }) => {
  const navigate = useNavigate();

  if (!user || !user.username) {
    return null; // Возвращаем null, если user или user.username не определены
  }

  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
        {initial}
      </div>
      <div className="absolute inset-0">
        <CircularProgressbar
          value={progress}
          maxValue={100}
          styles={buildStyles({
            pathColor: `rgba(0, 123, 255, ${progress / 100})`, // Более яркий синий цвет
            trailColor: '#d6d6d6',
          })}
        />
      </div>
    </div>
  );
};

export default ProfileButton;