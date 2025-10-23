type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function now(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const line = JSON.stringify({ ts: now(), level, message, ...(meta || {}) });
  const method: 'log' | 'info' | 'warn' | 'error' =
    level === 'debug' ? 'log' : level;
  console[method](line);
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};


