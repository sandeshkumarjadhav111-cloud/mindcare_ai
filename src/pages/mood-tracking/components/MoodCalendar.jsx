import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const MoodCalendar = ({ moodData, selectedDate, onDateSelect, currentMonth, onMonthChange }) => {
  const moodColors = {
    happy: 'bg-green-400',
    calm: 'bg-blue-400', 
    neutral: 'bg-gray-400',
    anxious: 'bg-yellow-400',
    sad: 'bg-purple-400',
    stressed: 'bg-red-400'
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(day);
    }
    
    return days;
  };

  const getMoodForDate = (day) => {
    if (!day) return null;
    const dateKey = `${currentMonth?.getFullYear()}-${String(currentMonth?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return moodData?.[dateKey];
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (day === today?.getDate() &&
    currentMonth?.getMonth() === today?.getMonth() && currentMonth?.getFullYear() === today?.getFullYear());
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    return (day === selectedDate?.getDate() &&
    currentMonth?.getMonth() === selectedDate?.getMonth() && currentMonth?.getFullYear() === selectedDate?.getFullYear());
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(newDate);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    onMonthChange(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Mood Calendar
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-muted/50 therapeutic-transition"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <h4 className="text-base font-medium text-foreground min-w-[140px] text-center">
            {currentMonth?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-muted/50 therapeutic-transition"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays?.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days?.map((day, index) => {
          const mood = getMoodForDate(day);
          const todayClass = isToday(day) ? 'ring-2 ring-primary' : '';
          const selectedClass = isSelected(day) ? 'bg-primary text-primary-foreground' : '';
          
          return (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  onClick={() => handleDateClick(day)}
                  className={`
                    w-full h-full rounded-lg flex flex-col items-center justify-center
                    therapeutic-transition hover:bg-muted/50 relative
                    ${todayClass} ${selectedClass}
                  `}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {mood && (
                    <div className={`w-2 h-2 rounded-full mt-1 ${moodColors?.[mood?.type] || 'bg-gray-400'}`} />
                  )}
                </button>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(moodColors)?.map(([mood, colorClass]) => (
            <div key={mood} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${colorClass}`} />
              <span className="text-muted-foreground capitalize">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;