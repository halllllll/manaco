// import { useSuspenseQuery } from '@tanstack/react-query';

import useSWR from "swr";

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchFunc = async (val: unknown) => {
  console.log(`target id: ${val}`);
  await sleep(1000); // 一応
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${val}`);
  if (!res.ok) throw `${res.status} ${res.statusText}`;
  const obj = await res.json();

  return JSON.stringify(obj);
};

export const MyFetch = (val: number) => {
  // const { isError, error, data, refetch } = useSuspenseQuery({
  //   queryKey: ['myfetch', val],
  //   queryFn: ({ pageParam = val }) => fetchFunc(pageParam),
  //   retry: 0,
  // });

  // return { isError, error, data, refetch };

  // keyの使い方がわからないのでとりあえず無視
  const {data, error, isLoading} = useSWR(`https://jsonplaceholder.typicode.com/todos/${val}`, () => fetchFunc(val), {
    suspense: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    shouldRetryOnError: false,
    errorRetryInterval: 0,
    errorRetryCount: 0,
  });

  return {data, isError: error, error, isLoading}
};
