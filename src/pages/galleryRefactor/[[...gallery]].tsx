import { withCSR } from '@/api/withCsr';
import { fetchGalleryDetail, fetchInfinityGalleries } from '@/components/galleryRefactor/api/handler';
import { Post, PostQueryKey } from '@/types/galleryRefactor/galleryRefactor';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const LazyInfinityComponent = dynamic(() => import('@/components/galleryRefactor/main/GalleryList'));
const LazyDetailComponent = dynamic(() => import('@/components/galleryRefactor/detail/GalleryDetail'));
const BASE_PATH = '/galleryRefactor';

const GalleryRefactorPage = () => {
  const router = useRouter();
  return <div>{router.asPath === BASE_PATH ? <LazyInfinityComponent /> : <LazyDetailComponent />}</div>;
};

export default GalleryRefactorPage;

export const getServerSideProps = withCSR(async (ctx: GetServerSidePropsContext) => {
  const queryKey = ctx.query.postId;
  const queryClient = new QueryClient();

  if (queryKey) {
    try {
      const result = await queryClient.fetchQuery<Post>({
        queryKey: [PostQueryKey.posts, queryKey],
        queryFn: () => fetchGalleryDetail(queryKey as string),
      });

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
      };
    } catch (err) {
      return {
        redirect: {
          destination: '/404',
          permanent: true,
        },
      };
    }
  } else {
    try {
      const results = await queryClient.fetchInfiniteQuery({
        queryKey: [PostQueryKey.posts],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => fetchInfinityGalleries({ pageParam }),
        staleTime: 60 * 1000,
      });

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
      };
    } catch (err) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }
  }
});
