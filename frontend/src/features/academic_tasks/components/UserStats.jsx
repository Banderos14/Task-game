import React from 'react';
import { useAcademicTasks } from '../context/AcademicTasksContext';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  IconButton
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import TimelineIcon from '@mui/icons-material/Timeline';
import '../styles/UserStats.css';

const UserStats = () => {
  const { userStats } = useAcademicTasks();

  const calculateLevel = (points) => {
    return Math.floor(points / 1000) + 1;
  };

  const calculateProgress = (points) => {
    const currentLevel = calculateLevel(points);
    const pointsForNextLevel = currentLevel * 1000;
    const progress = (points % 1000) / 10;
    return progress;
  };

  return (
    <Paper className="user-stats" elevation={2}>
      <Box className="stats-container">
        <Box className="level-container">
          <Tooltip title="Уровень">
            <Box className="level-box">
              <StarIcon color="primary" />
              <Typography variant="h6">{calculateLevel(userStats.points)}</Typography>
            </Box>
          </Tooltip>
          <Box className="progress-bar">
            <Box 
              className="progress-fill"
              style={{ width: `${calculateProgress(userStats.points)}%` }}
            />
          </Box>
        </Box>

        <Box className="points-container">
          <Tooltip title="Очки">
            <Box className="points-box">
              <TimelineIcon color="secondary" />
              <Typography variant="h6">{userStats.points}</Typography>
            </Box>
          </Tooltip>
        </Box>

        <Box className="achievements-container">
          <Tooltip title="Достижения">
            <Box className="achievements-box">
              <EmojiEventsIcon color="warning" />
              <Typography variant="h6">{userStats.achievements.length}</Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserStats; 