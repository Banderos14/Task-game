import React, { useState } from 'react';
import { useAcademicTasks } from '../context/AcademicTasksContext';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TableChartIcon from '@mui/icons-material/TableChart';
import { formatDate, formatTime, isUrgent } from '../utils/dateUtils';
import ExamsCalendar from './ExamsCalendar';

const ExamsSection = () => {
  const { exams, subjects, addExam, updateExam, deleteExam } = useAcademicTasks();
  const [open, setOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [view, setView] = useState('calendar');
  const [filters, setFilters] = useState({
    subject: 'all',
    period: 'all'
  });

  const handleOpen = (exam = null) => {
    setEditingExam(exam);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingExam(null);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const examData = {
      subject: formData.get('subject'),
      title: formData.get('title'),
      description: formData.get('description'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      notes: formData.get('notes')
    };

    if (editingExam) {
      updateExam(editingExam.id, examData);
    } else {
      addExam(examData);
    }
    handleClose();
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleDateClick = (date) => {
    const examOnDate = exams.find(exam => {
      const examDate = new Date(exam.date);
      return examDate.toDateString() === date.toDateString();
    });
    if (examOnDate) {
      handleOpen(examOnDate);
    } else {
      handleOpen({ date: date.toISOString().split('T')[0] });
    }
  };

  const filteredExams = exams.filter(exam => {
    if (filters.subject !== 'all' && exam.subject !== filters.subject) return false;
    return true;
  });

  const renderCalendarView = () => {
    return (
      <Box className="calendar-view">
        <Typography variant="h6" gutterBottom>
          Календарь экзаменов
        </Typography>
        <ExamsCalendar
          exams={filteredExams}
          onDateClick={handleDateClick}
        />
      </Box>
    );
  };

  const renderTableView = () => {
    return (
      <Box className="table-view">
        <Box className="filters">
          <FormControl size="small">
            <InputLabel>Предмет</InputLabel>
            <Select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              label="Предмет"
            >
              <MenuItem value="all">Все предметы</MenuItem>
              {subjects.map(subject => (
                <MenuItem key={subject} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Предмет</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Время</TableCell>
                <TableCell>Место</TableCell>
                <TableCell>Заметки</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams.map(exam => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{formatDate(exam.date)}</TableCell>
                  <TableCell>{formatTime(exam.time)}</TableCell>
                  <TableCell>{exam.location}</TableCell>
                  <TableCell>{exam.notes}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(exam)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteExam(exam.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box className="exams-section">
      <Box className="section-header">
        <Typography variant="h5">Экзамены</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Добавить экзамен
        </Button>
      </Box>

      <Box className="view-toggle">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="вид отображения"
        >
          <ToggleButton value="calendar" aria-label="календарь">
            <CalendarMonthIcon />
          </ToggleButton>
          <ToggleButton value="table" aria-label="таблица">
            <TableChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {view === 'calendar' ? renderCalendarView() : renderTableView()}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingExam ? 'Редактировать экзамен' : 'Добавить экзамен'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="subject"
              label="Предмет"
              fullWidth
              margin="normal"
              defaultValue={editingExam?.subject}
              required
            />
            <TextField
              name="title"
              label="Название"
              fullWidth
              margin="normal"
              defaultValue={editingExam?.title}
              required
            />
            <TextField
              name="description"
              label="Описание"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              defaultValue={editingExam?.description}
            />
            <TextField
              name="date"
              label="Дата"
              type="date"
              fullWidth
              margin="normal"
              defaultValue={editingExam?.date}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="time"
              label="Время"
              type="time"
              fullWidth
              margin="normal"
              defaultValue={editingExam?.time}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="location"
              label="Место проведения"
              fullWidth
              margin="normal"
              defaultValue={editingExam?.location}
              required
            />
            <TextField
              name="notes"
              label="Заметки"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              defaultValue={editingExam?.notes}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              Сохранить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ExamsSection; 