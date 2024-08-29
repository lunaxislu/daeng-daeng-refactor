import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useFetchGalleryDetail from '@/hooks/server/galleryRefactor/detail-hook/useFetchGalleryDetail';
import { Post, PostQueryKey } from '@/types/galleryRefactor/galleryRefactor';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { handleDetailApiRouter } from '../api/handler';
import GallerySkeleton from '../skeleton/GallerySkeleton';
const CSRPaginationComponent = dynamic(() => import('./GalleryPagination'), {
  ssr: false,
  loading: () => <GallerySkeleton />,
});
const GalleryDetail = () => {
  const router = useRouter();
  const id = router.query.postId as string;
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useFetchGalleryDetail({
    handleDetailApiRouter,
    id,
    queryKey: [PostQueryKey.posts],
    useQueryClient: queryClient,
  });
  const [specificData, setSpecificData] = useState<Post | undefined>(data ?? undefined);

  const updateSpecificData = (newData: Post | undefined) => {
    if (newData) {
      setSpecificData(preData => {
        if (!preData) return newData;
        if (preData) {
          const updatedData: Post = { ...preData };

          // keyof Post로 typedKey의 타입을 보장
          (Object.keys(newData) as (keyof Post)[]).forEach(key => {
            if (updatedData[key]) {
              const a = newData[key] as any;
              (updatedData[key] as unknown) = a as any;
            }
          });
          return updatedData;
        }
      });
    }
  };

  useEffect(() => {
    updateSpecificData(data);
  }, [data]);

  return (
    <div className=" flex flex-col items-center justify-center">
      <Carousel className="w-[84.6rem] h-[56rem] mb-8 cursor-pointer">
        <CarouselContent>
          {specificData?.images?.map((image, index) => (
            <CarouselItem key={`${nanoid()} `}>
              <div className="w-[84.6rem] h-[56rem] flex justify-center items-center rounded-3xl">
                <Image
                  src={image.image}
                  alt={`Slide ${index + 1}`}
                  style={{ objectFit: 'cover' }}
                  width={846}
                  height={560}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 w-[4rem] h-[3.7rem]" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[4rem] h-[3.7rem]" />
      </Carousel>
      <div className="mt-4 flex justify-between w-[84.6rem]">
        <h2 className="text-2xl font-bold">{specificData?.title}</h2>
        <span className="text-gray-500">{dayjs(specificData?.updatedAt).format('yyyy-mm-dd')}</span>
      </div>
      <h1 className="font-bold text-4xl">{specificData?.id}</h1>
      <p className="mt-2 w-[84.6rem]">{specificData?.content}</p>
      <div className="mt-4 w-[84.6rem] flex space-x-2">
        {specificData?.postcategory?.map(category => (
          <span key={nanoid()} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
            {category.category}
          </span>
        ))}
      </div>
      <CSRPaginationComponent useQueryClient={queryClient} id={id} />
    </div>
  );
};

export default React.memo(GalleryDetail);
