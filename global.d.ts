declare module 'swr' {
  import { Key, MutatorOptions, SWRConfiguration, SWRResponse } from 'swr/dist/types';

  export * from 'swr/dist/types';
  export default function useSWR<Data = any, Error = any>(
    key: Key,
    fetcher?: ((...args: any) => any) | null,
    config?: SWRConfiguration<Data, Error>
  ): SWRResponse<Data, Error>;
}