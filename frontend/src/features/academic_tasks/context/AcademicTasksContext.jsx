import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const AcademicTasksContext = createContext(null);

export const useAcademicTasks = () => {
  const context = useContext(AcademicTasksContext);
  if (!context) {
    throw new Error('useAcademicTasks must be used within an AcademicTasksProvider');
  }
  return context;
};

export const AcademicTasksProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [homework, setHomework] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [exams, setExams] = useState([]);
  const [userStats, setUserStats] = useState({
    level: 1,
    points: 0,
    achievements: []
  });
  const [notifications, setNotifications] = useState([]);

  // Загрузка данных
  const loadData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Загрузка предметов
      const subjectsResponse = await fetch(`http://localhost:5000/api/subjects/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!subjectsResponse.ok) {
        throw new Error('Ошибка загрузки предметов');
      }
      
      const subjectsData = await subjectsResponse.json();
      setSubjects(subjectsData);
      
      // Загрузка задач
      const tasksResponse = await fetch(`http://localhost:5000/api/academic-tasks/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!tasksResponse.ok) {
        throw new Error('Ошибка загрузки задач');
      }
      
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, [user?.id]);

  // Сохранение данных
  const saveData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Сохранение предметов
      await fetch(`http://localhost:5000/api/subjects/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subjects)
      });
      
      // Сохранение задач
      await fetch(`http://localhost:5000/api/academic-tasks/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tasks)
      });
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
    }
  }, [subjects, tasks, user?.id]);

  // Загрузка данных при монтировании и изменении пользователя
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Автосохранение при изменении данных
  useEffect(() => {
    if (user?.id) {
      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [saveData, user?.id]);

  // Проверка уведомлений
  const checkNotifications = useCallback(() => {
    if (!user?.id) return;
    
    const now = new Date();
    const urgentTasks = tasks.filter(task => {
      const deadline = new Date(task.deadline);
      const timeDiff = deadline - now;
      return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000; // 24 часа
    });
    
    if (urgentTasks.length > 0) {
      console.log('Есть срочные задачи:', urgentTasks);
    }
  }, [tasks, user?.id]);

  // Проверка уведомлений каждые 5 минут
  useEffect(() => {
    if (user?.id) {
      checkNotifications();
      const intervalId = setInterval(checkNotifications, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [checkNotifications, user?.id]);

  // Функции для работы с домашними заданиями
  const addHomework = (homework) => {
    setHomework(prev => [...prev, { ...homework, id: Date.now() }]);
    addPoints(10, 'Добавлено домашнее задание');
    checkAchievements();
  };

  const updateHomework = (id, updatedHomework) => {
    setHomework(prev => prev.map(hw => 
      hw.id === id ? { ...hw, ...updatedHomework } : hw
    ));
  };

  const deleteHomework = (id) => {
    setHomework(prev => prev.filter(hw => hw.id !== id));
  };

  // Функции для работы с дедлайнами
  const addDeadline = (deadline) => {
    setDeadlines(prev => [...prev, { ...deadline, id: Date.now() }]);
    addPoints(15, 'Добавлен дедлайн');
    checkAchievements();
  };

  const updateDeadline = (id, updatedDeadline) => {
    setDeadlines(prev => prev.map(dl => 
      dl.id === id ? { ...dl, ...updatedDeadline } : dl
    ));
  };

  const deleteDeadline = (id) => {
    setDeadlines(prev => prev.filter(dl => dl.id !== id));
  };

  // Функции для работы с экзаменами
  const addExam = (exam) => {
    setExams(prev => [...prev, { ...exam, id: Date.now() }]);
    addPoints(20, 'Добавлен экзамен');
  };

  const updateExam = (id, updatedExam) => {
    setExams(prev => prev.map(exam => 
      exam.id === id ? { ...exam, ...updatedExam } : exam
    ));
  };

  const deleteExam = (id) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  // Обновление списка предметов
  const updateSubjects = () => {
    const allSubjects = new Set([
      ...homework.map(item => item.subject),
      ...deadlines.map(item => item.subject),
      ...exams.map(item => item.subject),
      ...subjects
    ].filter(Boolean));
    setSubjects(Array.from(allSubjects));
  };

  // Добавление очков
  const addPoints = (amount, reason) => {
    setUserStats(prev => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      
      if (newLevel > prev.level) {
        showNotification(
          'Новый уровень!',
          `Поздравляем! Вы достигли ${newLevel} уровня!`,
          true
        );
      }

      return {
        ...prev,
        points: newPoints,
        level: newLevel
      };
    });
  };

  // Система достижений
  const checkAchievements = () => {
    const newAchievements = [...userStats.achievements];
    let hasNewAchievements = false;

    // Проверка достижений
    if (homework.length >= 10 && !newAchievements.find(a => a.id === 'homework_master')) {
      newAchievements.push({
        id: 'homework_master',
        title: 'Мастер домашних заданий',
        description: 'Создано 10 домашних заданий',
        unlocked: true,
        date: new Date().toISOString()
      });
      hasNewAchievements = true;
    }

    if (deadlines.length >= 5 && !newAchievements.find(a => a.id === 'deadline_master')) {
      newAchievements.push({
        id: 'deadline_master',
        title: 'Мастер дедлайнов',
        description: 'Создано 5 дедлайнов',
        unlocked: true,
        date: new Date().toISOString()
      });
      hasNewAchievements = true;
    }

    if (hasNewAchievements) {
      setUserStats(prev => ({
        ...prev,
        achievements: newAchievements
      }));
      showNotification(
        'Новое достижение!',
        'Вы получили новое достижение! Проверьте свой профиль.',
        true
      );
    }
  };

  // Система уведомлений
  const showNotification = (title, message, isUrgent = false) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      isUrgent,
      date: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [...prev, newNotification]);

    if (isUrgent) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/path/to/icon.png'
        });
      }
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    tasks,
    setTasks,
    subjects,
    setSubjects,
    userStats,
    setUserStats,
    notifications,
    setNotifications,
    loadData,
    saveData,
    updateSubjects,
    addPoints,
    checkAchievements,
    showNotification,
    removeNotification,
    checkNotifications,
    // Функции для работы с задачами
    addHomework,
    updateHomework,
    deleteHomework,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    addExam,
    updateExam,
    deleteExam
  };

  return (
    <AcademicTasksContext.Provider value={value}>
      {children}
    </AcademicTasksContext.Provider>
  );
};