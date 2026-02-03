// Environment loader - loads .env variables at runtime
(function(window) {
  // Read environment variables from .env file
  // This is loaded BEFORE Angular initializes
  
  window.__env__ = window.__env__ || {};
  
  // Default values if not set
  window.__env__['NG_APP_API_URL'] = window.__env__['NG_APP_API_URL'] || 'http://localhost:8000';
  window.__env__['NG_APP_EMPLOYEES_API'] = window.__env__['NG_APP_EMPLOYEES_API'] || '/api/employees/';
  window.__env__['NG_APP_ATTENDANCE_API'] = window.__env__['NG_APP_ATTENDANCE_API'] || '/api/attendance/';
  window.__env__['NG_APP_APP_NAME'] = window.__env__['NG_APP_APP_NAME'] || 'HRMS Lite';
  window.__env__['NG_APP_ENV'] = window.__env__['NG_APP_ENV'] || 'development';
})(this);
