import type { User } from '@supabase/supabase-js';

export const getLocalDateTime = (date: Date | string) => {
  const d = new Date(date);

  const padDate = (n: number) => (n < 10 ? `0${n}` : n);

  //   just format it to YYYY/MM/DD HH:mm
  return `${d.getFullYear()}/${padDate(d.getMonth() + 1)}/${padDate(d.getDate())} ${d.getHours()}:${d.getMinutes()}`;
};

export const getUserName = (user: User): string => {
  // first_name
  return user.user_metadata?.first_name || getUserFullName(user);
};
export const getUserFullName = (user: User): string => {
  const first_name = user.user_metadata?.first_name;
  const last_name = user.user_metadata?.last_name;
  if (first_name && last_name) {
    return `${first_name} ${last_name}`;
  }

  return user.user_metadata?.full_name || user.email || 'Anonymous';
};

export const getUserInitials = (user: User): string => {
  return getUserFullName(user)
    .split(' ')
    .map((n) => n[0])
    .join('');
};

export const getUserAvatarUrl = (user: User): string | null => {
  const url = user.user_metadata?.avatar_url;
  return user.user_metadata?.avatar_url;
};
