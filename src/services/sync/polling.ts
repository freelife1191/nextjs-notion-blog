import { logger } from '@/lib/logging';

let timer: NodeJS.Timeout | null = null;

export function startPolling(intervalMs = 10 * 60 * 1000) {
  stopPolling();
  timer = setInterval(() => {
    logger.info('polling.tick');
    // TODO: trigger background sync task
  }, intervalMs);
  logger.info('polling.started', { intervalMs });
}

export function stopPolling() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    logger.info('polling.stopped');
  }
}


