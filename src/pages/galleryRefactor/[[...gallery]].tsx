import { withConditionalSSR } from '@/api/withCsr';
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

export const getServerSideProps = withConditionalSSR(async (ctx: GetServerSidePropsContext) => {
  const queryKey = ctx.query.postId;
  const queryClient = new QueryClient();

  if (queryKey) {
    try {
      await queryClient.fetchQuery<Post>({
        queryKey: [PostQueryKey.posts, queryKey],
        queryFn: () => fetchGalleryDetail(queryKey as string),
      });
    } catch (err) {
      return {
        notFound: true,
      };
    }
  } else {
    try {
      await queryClient.fetchInfiniteQuery({
        queryKey: [PostQueryKey.posts],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => fetchInfinityGalleries({ pageParam }),
      });
    } catch (err) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      // SEO하기 위한 동적 데이터 넣으면 굿
    },
  };
});
