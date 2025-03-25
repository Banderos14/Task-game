export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateObj = new Date(date);
    return tomorrow.toDateString() === dateObj.toDateString();
};

export const isThisWeek = (date) => {
    const today = new Date();
    const dateObj = new Date(date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    return dateObj >= weekStart && dateObj <= today;
};

export const isThisMonth = (date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
};

export const getDaysUntil = (date) => {
    const today = new Date();
    const dateObj = new Date(date);
    const diffTime = dateObj - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isUrgent = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
};

export const getDaysWord = (days) => {
    if (days === 1) return 'день';
    if (days >= 2 && days <= 4) return 'дня';
    return 'дней';
};

export const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
};
