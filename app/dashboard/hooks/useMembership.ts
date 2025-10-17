'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useMembership() {
  const { data, error } = useSWR('/api/user/membership', fetcher);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  return { membership: data, isError, isLoading, error };
}
