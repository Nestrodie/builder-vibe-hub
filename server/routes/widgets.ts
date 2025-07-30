import { RequestHandler } from "express";

export interface WidgetData {
  id: string;
  type: 'basic' | 'counter' | 'timer' | 'progress';
  title: string;
  color: string;
  icon: string;
  value: number;
  target: number;
  lastUpdated: string;
}

const sampleWidgets: WidgetData[] = [
  {
    id: '1',
    type: 'counter',
    title: 'Pages Read',
    color: '#3B82F6',
    icon: '📚',
    value: 25,
    target: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'progress',
    title: 'Workout Progress',
    color: '#10B981',
    icon: '💪',
    value: 7,
    target: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'timer',
    title: 'Focus Session',
    color: '#EF4444',
    icon: '⏰',
    value: 0,
    target: 3600,
    lastUpdated: new Date().toISOString(),
  },
];

export const getWidgets: RequestHandler = (req, res) => {
  res.json({ widgets: sampleWidgets });
};

export const getWidget: RequestHandler = (req, res) => {
  const { id } = req.params;
  const widget = sampleWidgets.find(w => w.id === id);
  
  if (!widget) {
    return res.status(404).json({ error: 'Widget not found' });
  }
  
  res.json(widget);
};
