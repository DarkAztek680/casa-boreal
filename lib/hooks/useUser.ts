import useSWR, { SWRResponse } from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('API Error');
  return res.json();
};

// Tipos para los datos
export interface Membership {
  type: string;
  creditsLeft: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface UserStats {
  totalBookings: number;
  upcomingBookings: number;
  cancelledBookings: number;
}

export interface Booking {
  id: string;
  class: {
    name: string;
    instructor: string;
    startTime: string;
    level?: string;
  };
  status: string;
}

export function useUserMembership(): {
  membership: Membership | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: SWRResponse<Membership>['mutate'];
} {
  const { data, error, isLoading, mutate } = useSWR<Membership>('/api/user/membership', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000,
  });
  return {
    membership: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useUserStats(): {
  stats: UserStats | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: SWRResponse<UserStats>['mutate'];
} {
  const { data, error, isLoading, mutate } = useSWR<UserStats>('/api/user/stats', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000,
  });
  return {
    stats: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useUpcomingBookings(): {
  bookings: Booking[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: SWRResponse<Booking[]>['mutate'];
} {
  const { data, error, isLoading, mutate } = useSWR<Booking[]>('/api/bookings?filter=upcoming', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 10000,
  });
  return {
    bookings: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}