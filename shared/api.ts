/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Widget-related types
 */
export interface WidgetData {
  id: string;
  type: 'timeblock' | 'habit' | 'countdown' | 'progress';
  title: string;
  color: string;
  icon: string;
  darkMode: boolean;

  // TimeBlock specific
  hours?: number;
  minutes?: number;

  // Habit/Wall Block specific
  value?: number;
  target?: number;
  increment?: number;

  // Countdown specific
  countdownMinutes?: number;
  countdownSeconds?: number;

  // Progress specific
  startDate?: string;
  endDate?: string;
  currentProgress?: number;

  lastUpdated: string;
}

export interface WidgetsResponse {
  widgets: WidgetData[];
}
