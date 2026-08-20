import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

export function useSSEStream(
  slug: string,
  url: string,
  queryKey: readonly unknown[],
  options?: EventSourceInit
) {
  const queryClient = useQueryClient();
  const queryKeyJson = JSON.stringify(queryKey);

  useEffect(() => {
    if (!slug) return;

    let retries = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let eventSource: EventSource | null = null;

    function connect() {
      eventSource = new EventSource(url, options);

      eventSource.onmessage = () => {
        retries = 0;
        queryClient.invalidateQueries({ queryKey });
      };

      eventSource.onerror = () => {
        eventSource?.close();

        if (retries < MAX_RETRIES) {
          const delay = BASE_DELAY * 2 ** retries;
          retries++;
          timer = setTimeout(connect, delay);
        }
      };
    }

    connect();

    return () => {
      if (timer) clearTimeout(timer);
      eventSource?.close();
    };
  }, [slug, url, queryClient, queryKeyJson, options]);
}
