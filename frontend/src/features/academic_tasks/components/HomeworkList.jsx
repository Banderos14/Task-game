import React from 'react';
import { useAcademicTasks } from '../context/AcademicTasksContext';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const HomeworkList = () => {
  const { homework, deleteHomework } = useAcademicTasks();

  const handleDelete = (id) => {
    deleteHomework(id);
  };

  if (!homework || homework.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Нет домашних заданий
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mt: 2 }}>
      <List>
        {homework.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={item.title}
              secondary={`${item.subject} • Срок: ${new Date(item.dueDate).toLocaleDateString()}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 

export default HomeworkList;