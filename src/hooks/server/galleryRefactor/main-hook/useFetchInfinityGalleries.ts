import { Post } from '@/types/galleryRefactor/galleryRefactor';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

interface IProps {
  queryKey: string[];
  handleApiRouter: ({ pageParam }: { pageParam: number }) => Promise<any>;
}
interface IQueryData {
  pageParams: number[];
  pages: Post[][];
}
const useFetchInfinityGalleries = (props: IProps) => {
  const client = useMemo(() => useQueryClient(), []);
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    {
      queryKey: props.queryKey,
      queryFn: ({ pageParam }) => props.handleApiRouter({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
      select: (data: IQueryData) => {
        const res = data.pages.map(pageData => pageData).flat();

        res.forEach(data => {
          const queryKey = [...props.queryKey, `${data.id}`];
          client.setQueryData(queryKey, data);
          //client.fetchQuery({
          //queryKey,
          //queryFn: () => data,
          //staleTime:...
          // gcTime:...
          // });
        });

        return res;
      },
    },
  );
  return {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};

export default useFetchInfinityGalleries;
