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
  Checkbox,
  FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, formatTime, isUrgent } from '../utils/dateUtils';

const HomeworkSection = () => {
  const { homework, subjects, addHomework, updateHomework, deleteHomework } = useAcademicTasks();
  const [open, setOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [filters, setFilters] = useState({
    subject: 'all',
    deadline: 'all',
    status: 'all'
  });

  const handleOpen = (homework = null) => {
    setEditingHomework(homework);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingHomework(null);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const homeworkData = {
      subject: formData.get('subject'),
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      dueTime: formData.get('dueTime'),
      notification: formData.get('notification'),
      completed: formData.get('completed') === 'true'
    };

    if (editingHomework) {
      updateHomework(editingHomework.id, homeworkData);
    } else {
      addHomework(homeworkData);
    }
    handleClose();
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredHomework = homework.filter(hw => {
    if (filters.subject !== 'all' && hw.subject !== filters.subject) return false;
    if (filters.status !== 'all') {
      if (filters.status === 'completed' && !hw.completed) return false;
      if (filters.status === 'pending' && hw.completed) return false;
    }
    return true;
  });

  return (
    <Box className="homework-section">
      <Box className="section-header">
        <Typography variant="h5">Домашние задания</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Добавить задание
        </Button>
      </Box>

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

        <FormControl size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            label="Статус"
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="completed">Выполненные</MenuItem>
            <MenuItem value="pending">Ожидающие</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {filteredHomework.map(hw => (
          <Grid item xs={12} sm={6} md={4} key={hw.id}>
            <Card className={`homework-card ${hw.completed ? 'completed' : ''} ${isUrgent(hw.dueDate) ? 'urgent' : ''}`}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hw.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {hw.subject}
                </Typography>
                <Typography variant="body2" className="due-date">
                  Срок: {formatDate(hw.dueDate)}
                  {hw.dueTime && ` ${formatTime(hw.dueTime)}`}
                </Typography>
                {hw.description && (
                  <Typography variant="body2" className="description">
                    {hw.description}
                  </Typography>
                )}
                <Box className="card-actions">
                  <IconButton onClick={() => handleOpen(hw)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteHomework(hw.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingHomework ? 'Редактировать задание' : 'Добавить задание'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="subject"
              label="Предмет"
              fullWidth
              margin="normal"
              defaultValue={editingHomework?.subject}
              required
            />
            <TextField
              name="title"
              label="Название"
              fullWidth
              margin="normal"
              defaultValue={editingHomework?.title}
              required
            />
            <TextField
              name="description"
              label="Описание"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              defaultValue={editingHomework?.description}
            />
            <TextField
              name="dueDate"
              label="Срок сдачи (дата)"
              type="date"
              fullWidth
              margin="normal"
              defaultValue={editingHomework?.dueDate}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="dueTime"
              label="Срок сдачи (время)"
              type="time"
              fullWidth
              margin="normal"
              defaultValue={editingHomework?.dueTime}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Напоминание</InputLabel>
              <Select
                name="notification"
                defaultValue={editingHomework?.notification || 'none'}
                label="Напоминание"
              >
                <MenuItem value="none">Нет</MenuItem>
                <MenuItem value="1h">За 1 час</MenuItem>
                <MenuItem value="3h">За 3 часа</MenuItem>
                <MenuItem value="1d">За 1 день</MenuItem>
                <MenuItem value="3d">За 3 дня</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  name="completed"
                  defaultChecked={editingHomework?.completed || false}
                />
              }
              label="Выполнено"
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

export default HomeworkSection; 