import GalleryDetail from '@/components/gallery/GalleryDetail';
import { fetchGalleryDetail, handleDetailApiRouter } from '@/components/galleryRefactor/api/handler';
import useFetchGalleryDetail from '@/hooks/server/galleryRefactor/detail-hook/useFetchGalleryDetail';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

const GalleryDetailPage = () => {
  const { query } = useRouter();
  const { id } = query as { id: string };
  const { data, isLoading, isError } = useFetchGalleryDetail({
    queryKey: ['galleryDetail', id],
    id,
    handleDetailApiRouter: handleDetailApiRouter,
  });

  return (
    <>
      <Head>
        <title>{`${data?.title}`}</title>
        <meta name="author" content="냥댕댕" />
        <meta name="title" content="댕댕냥 - 댕댕냥이 세상을 구한다!!" />
        <meta
          name="description"
          content="누구의 반려동물 또는 자신의 반려동물과 관련해 글을 작성하거나, 좋아요를 표시하며 서로 정보를 교환해보세요"
        />
        <meta name="keywords" content="반려동물, 애완동물, 산책, 동물병원, 동물약국, 산책로," />
      </Head>
      <GalleryDetail gallery={data} isLoading={isLoading} />
    </>
  );
};

export default GalleryDetailPage;
export const getServerSideProps = async (context: NextPageContext) => {
  const { query } = context;
  const { id } = query;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['galleryDetail', id],
    queryFn: () => fetchGalleryDetail(id as string),
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
