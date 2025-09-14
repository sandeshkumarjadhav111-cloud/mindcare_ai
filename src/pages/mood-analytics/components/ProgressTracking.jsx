import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressTracking = ({ progressData, goals }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const periodOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const goalTypes = {
    mood_stability: { 
      icon: 'Activity', 
      label: 'Mood Stability',
      color: 'var(--color-primary)',
      description: 'Maintain consistent emotional balance'
    },
    stress_reduction: { 
      icon: 'Shield', 
      label: 'Stress Reduction',
      color: 'var(--color-success)',
      description: 'Reduce overall stress levels'
    },
    anxiety_management: { 
      icon: 'Heart', 
      label: 'Anxiety Management',
      color: 'var(--color-warning)',
      description: 'Better control over anxiety episodes'
    },
    emotional_awareness: { 
      icon: 'Eye', 
      label: 'Emotional Awareness',
      color: 'var(--color-secondary)',
      description: 'Increase understanding of emotions'
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">{entry?.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'var(--color-success)';
    if (progress >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Progress Tracking
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor your therapeutic goals and achievements
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
          {periodOptions?.map(option => (
            <button
              key={option?.value}
              onClick={() => setSelectedPeriod(option?.value)}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium therapeutic-transition
                ${selectedPeriod === option?.value
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Goals Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {goals?.map((goal, index) => {
          const goalType = goalTypes?.[goal?.type];
          const progress = calculateProgress(goal?.current, goal?.target);
          
          return (
            <div key={index} className="bg-surface rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: `${goalType?.color}20` }}
                  >
                    <Icon 
                      name={goalType?.icon} 
                      size={16} 
                      style={{ color: goalType?.color }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {goalType?.label}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {goalType?.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">
                    {progress?.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {goal?.current}/{goal?.target}
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full rounded-full therapeutic-transition"
                  style={{ 
                    backgroundColor: getProgressColor(progress),
                    width: `${progress}%`
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Target: {goal?.deadline}
                </span>
                <span 
                  className="font-medium"
                  style={{ color: getProgressColor(progress) }}
                >
                  {progress >= 80 ? 'On Track' : progress >= 60 ? 'Needs Focus' : 'Behind'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Progress Chart */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-4">
          Progress Over Time
        </h4>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="period" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="mood_stability" 
                fill="var(--color-primary)" 
                name="Mood Stability"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="stress_reduction" 
                fill="var(--color-success)" 
                name="Stress Reduction"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="anxiety_management" 
                fill="var(--color-warning)" 
                name="Anxiety Management"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="emotional_awareness" 
                fill="var(--color-secondary)" 
                name="Emotional Awareness"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Achievement Badges */}
      <div className="pt-6 border-t border-border">
        <h4 className="font-medium text-foreground mb-4">
          Recent Achievements
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { 
              title: '7-Day Streak', 
              description: 'Consistent mood tracking',
              icon: 'Calendar',
              earned: true,
              date: '2025-09-10'
            },
            { 
              title: 'Stress Warrior', 
              description: 'Reduced stress by 25%',
              icon: 'Shield',
              earned: true,
              date: '2025-09-08'
            },
            { 
              title: 'Mindful Moments', 
              description: 'Completed 50 journal entries',
              icon: 'BookOpen',
              earned: false,
              progress: 42
            },
            { 
              title: 'Emotional Intelligence', 
              description: 'Improved emotion recognition',
              icon: 'Brain',
              earned: false,
              progress: 78
            }
          ]?.map((achievement, index) => (
            <div 
              key={index}
              className={`
                p-3 rounded-lg border text-center therapeutic-transition
                ${achievement?.earned 
                  ? 'bg-success/10 border-success/20' :'bg-surface border-border'
                }
              `}
            >
              <div 
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-2
                  ${achievement?.earned 
                    ? 'bg-success/20' :'bg-muted/20'
                  }
                `}
              >
                <Icon 
                  name={achievement?.icon} 
                  size={20} 
                  className={achievement?.earned ? 'text-success' : 'text-muted-foreground'}
                />
              </div>
              
              <h5 className="text-sm font-medium text-foreground mb-1">
                {achievement?.title}
              </h5>
              
              <p className="text-xs text-muted-foreground mb-2">
                {achievement?.description}
              </p>
              
              {achievement?.earned ? (
                <div className="text-xs text-success font-medium">
                  Earned {new Date(achievement.date)?.toLocaleDateString()}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {achievement?.progress}% complete
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;