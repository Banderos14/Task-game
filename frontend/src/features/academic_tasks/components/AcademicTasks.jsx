import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import HomeworkSection from './HomeworkSection';
import DeadlinesSection from './DeadlinesSection';
import ExamsSection from './ExamsSection';
import UserStats from './UserStats';
import NotificationSystem from './NotificationSystem';
import { useAcademicTasks } from '../context/AcademicTasksContext';
import '../styles/AcademicTasks.css';

const AcademicTasks = () => {
  const [currentTab, setCurrentTab] = useState('homework');
  const { loadData } = useAcademicTasks();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="academic-tasks-container">
      <NotificationSystem />
      <header className="academic-tasks-header">
        <h1>Академические задачи</h1>
        <UserStats />
      </header>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        className="academic-tasks-tabs"
      >
        <Tab value="homework" label="Домашние задания" />
        <Tab value="deadlines" label="Дедлайны" />
        <Tab value="exams" label="Экзамены" />
      </Tabs>

      <div className="academic-tasks-content">
        {currentTab === 'homework' && <HomeworkSection />}
        {currentTab === 'deadlines' && <DeadlinesSection />}
        {currentTab === 'exams' && <ExamsSection />}
      </div>
    </div>
  );
};

export default AcademicTasks; 