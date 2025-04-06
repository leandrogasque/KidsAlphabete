import React from 'react';
import '../styles/StatusBar.css';

interface StatusBarProps {
  level: string;
  score: number;
  completedItems?: number;
  totalItems?: number;
  streak?: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  level, 
  score, 
  streak = 0, 
  completedItems, 
  totalItems 
}) => {
  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">Nível:</span>
        <span className="status-value">{level}</span>
      </div>
      
      <div className="status-item">
        <span className="status-label">Pontuação:</span>
        <span className="status-value">{score}</span>
      </div>
      
      {streak > 0 && (
        <div className="status-item">
          <span className="status-label">Sequência:</span>
          <span className="status-value">{streak}</span>
        </div>
      )}
      
      {completedItems !== undefined && totalItems !== undefined && (
        <div className="status-item progress">
          <span className="status-label">Progresso:</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedItems / totalItems) * 100}%` }}
            ></div>
          </div>
          <span className="status-value">{completedItems}/{totalItems}</span>
        </div>
      )}
    </div>
  );
};

export default StatusBar; 