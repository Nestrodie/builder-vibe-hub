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
  type: 'basic' | 'counter' | 'timer' | 'progress';
  title: string;
  color: string;
  icon: string;
  value: number;
  target: number;
  lastUpdated: string;
}

export interface WidgetsResponse {
  widgets: WidgetData[];
}
