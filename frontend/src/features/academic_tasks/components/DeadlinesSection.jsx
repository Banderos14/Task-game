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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, formatTime, isUrgent } from '../utils/dateUtils';

const DeadlinesSection = () => {
  const { deadlines, subjects, addDeadline, updateDeadline, deleteDeadline } = useAcademicTasks();
  const [open, setOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [filters, setFilters] = useState({
    priority: 'all',
    period: 'all'
  });

  const handleOpen = (deadline = null) => {
    setEditingDeadline(deadline);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingDeadline(null);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const deadlineData = {
      subject: formData.get('subject'),
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      dueTime: formData.get('dueTime'),
      priority: formData.get('priority'),
      type: formData.get('type')
    };

    if (editingDeadline) {
      updateDeadline(editingDeadline.id, deadlineData);
    } else {
      addDeadline(deadlineData);
    }
    handleClose();
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredDeadlines = deadlines.filter(dl => {
    if (filters.priority !== 'all' && dl.priority !== filters.priority) return false;
    return true;
  });

  return (
    <Box className="deadlines-section">
      <Box className="section-header">
        <Typography variant="h5">Дедлайны</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Добавить дедлайн
        </Button>
      </Box>

      <Box className="filters">
        <FormControl size="small">
          <InputLabel>Приоритет</InputLabel>
          <Select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            label="Приоритет"
          >
            <MenuItem value="all">Все приоритеты</MenuItem>
            <MenuItem value="high">Срочный</MenuItem>
            <MenuItem value="medium">Важный</MenuItem>
            <MenuItem value="low">Обычный</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {filteredDeadlines.map(dl => (
          <Grid item xs={12} sm={6} md={4} key={dl.id}>
            <Card className={`deadline-card ${dl.priority}`}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    {dl.title}
                  </Typography>
                  <Chip
                    label={dl.priority === 'high' ? 'Срочный' : dl.priority === 'medium' ? 'Важный' : 'Обычный'}
                    color={getPriorityColor(dl.priority)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {dl.subject}
                </Typography>
                <Typography variant="body2" className="type">
                  {dl.type}
                </Typography>
                <Typography variant="body2" className={`due-date ${isUrgent(dl.dueDate) ? 'urgent' : ''}`}>
                  Срок: {formatDate(dl.dueDate)}
                  {dl.dueTime && ` ${formatTime(dl.dueTime)}`}
                </Typography>
                {dl.description && (
                  <Typography variant="body2" className="description">
                    {dl.description}
                  </Typography>
                )}
                <Box className="card-actions">
                  <IconButton onClick={() => handleOpen(dl)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteDeadline(dl.id)}>
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
          {editingDeadline ? 'Редактировать дедлайн' : 'Добавить дедлайн'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="subject"
              label="Предмет"
              fullWidth
              margin="normal"
              defaultValue={editingDeadline?.subject}
              required
            />
            <TextField
              name="title"
              label="Название"
              fullWidth
              margin="normal"
              defaultValue={editingDeadline?.title}
              required
            />
            <TextField
              name="description"
              label="Описание"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              defaultValue={editingDeadline?.description}
            />
            <TextField
              name="dueDate"
              label="Срок (дата)"
              type="date"
              fullWidth
              margin="normal"
              defaultValue={editingDeadline?.dueDate}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="dueTime"
              label="Срок (время)"
              type="time"
              fullWidth
              margin="normal"
              defaultValue={editingDeadline?.dueTime}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Приоритет</InputLabel>
              <Select
                name="priority"
                defaultValue={editingDeadline?.priority || 'medium'}
                label="Приоритет"
                required
              >
                <MenuItem value="high">Срочный</MenuItem>
                <MenuItem value="medium">Важный</MenuItem>
                <MenuItem value="low">Обычный</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Тип</InputLabel>
              <Select
                name="type"
                defaultValue={editingDeadline?.type || 'assignment'}
                label="Тип"
                required
              >
                <MenuItem value="assignment">Задание</MenuItem>
                <MenuItem value="project">Проект</MenuItem>
                <MenuItem value="exam">Экзамен</MenuItem>
                <MenuItem value="other">Другое</MenuItem>
              </Select>
            </FormControl>
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

export default DeadlinesSection; 