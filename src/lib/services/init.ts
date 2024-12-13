import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPA_PUBLIC, PUBLIC_SUPA_URL } from '$env/static/public';
import { browser, dev } from '$app/environment';
import type { Database } from '../../../database.types';

export const supabase = createClient<Database>(PUBLIC_SUPA_URL, PUBLIC_SUPA_PUBLIC);
export type Tables = Database['public']['Tables'];
export type Views = Database['public']['Views'];
export const env = dev ? 'dev' : 'prod';

export const CURRENT_URL = new URL(browser ? window.location.href : 'http://localhost:5175');

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  timeout = 1000
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout | null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
