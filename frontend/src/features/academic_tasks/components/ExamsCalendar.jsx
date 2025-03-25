import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Paper,
  Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { formatDate, isToday, isThisMonth } from '../utils/dateUtils';

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const ExamsCalendar = ({ exams, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getExamsForDate = (date) => {
    return exams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Добавляем пустые ячейки для дней до первого дня месяца
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayExams = getExamsForDate(date);
      const isCurrentDay = isToday(date);
      const isCurrentMonth = isThisMonth(date);

      days.push(
        <Box
          key={day}
          className={`calendar-day ${isCurrentDay ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${dayExams.length > 0 ? 'has-exam' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <Typography variant="body2" className="date-number">
            {day}
          </Typography>
          {dayExams.length > 0 && (
            <Box className="exam-indicators">
              {dayExams.map(exam => (
                <Tooltip key={exam.id} title={exam.title}>
                  <Box className="exam-indicator" />
                </Tooltip>
              ))}
            </Box>
          )}
        </Box>
      );
    }

    return days;
  };

  const getMonthName = (date) => {
    return date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
  };

  return (
    <Paper className="calendar-container">
      <Box className="calendar-header">
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {getMonthName(currentDate)}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Grid container className="calendar-grid">
        <Grid item xs={12} className="calendar-days">
          {DAYS_OF_WEEK.map(day => (
            <Typography key={day} variant="body2" className="day-name">
              {day}
            </Typography>
          ))}
        </Grid>
        <Grid item xs={12} className="calendar-dates">
          {renderCalendarDays()}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExamsCalendar; 