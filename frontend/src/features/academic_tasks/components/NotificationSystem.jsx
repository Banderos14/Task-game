import React, { useEffect } from 'react';
import { useAcademicTasks } from '../context/AcademicTasksContext';
import {
  Snackbar,
  Alert,
  IconButton,
  Box,
  Typography,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateTime } from '../utils/dateUtils';

const NotificationSystem = () => {
  const { notifications, removeNotification, addNotification } = useAcademicTasks();

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      notifications.forEach(notification => {
        if (!notification.shown) {
          const notificationTime = new Date(notification.date);
          if (notificationTime <= now) {
            showNotification(notification);
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Проверка каждую минуту
    return () => clearInterval(interval);
  }, [notifications]);

  const showNotification = (notification) => {
    // Здесь можно добавить логику для показа нативных уведомлений
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/path/to/icon.png'
          });
        }
      });
    }
  };

  const handleClose = (id) => {
    removeNotification(id);
  };

  const handleViewDetails = (notification) => {
    // Здесь можно добавить логику для просмотра деталей уведомления
    console.log('View details:', notification);
  };

  return (
    <Box className="notification-system">
      {notifications.map(notification => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={notification.urgent ? 'error' : 'info'}
            action={
              <Box>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => handleClose(notification.id)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => handleViewDetails(notification)}
                >
                  Подробнее
                </Button>
              </Box>
            }
          >
            <Typography variant="subtitle2" gutterBottom>
              {notification.title}
            </Typography>
            <Typography variant="body2">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatDateTime(notification.date)}
            </Typography>
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default NotificationSystem; 