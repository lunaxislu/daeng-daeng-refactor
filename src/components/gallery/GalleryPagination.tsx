import usePaginationQueries from '@/hooks/server/galleryRefactor/pagination-hook/usePaginationQueries';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { handleDetailApiRouter } from '../galleryRefactor/api/handler';
import Skeleton from '../ui/skeleton';

const GalleryPagination = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { results } = usePaginationQueries({
    handleDetailApiRouter,
    queryKey: ['galleryUpload'],
    id,
    useQueryClient: queryClient,
  });
  const router = useRouter();
  const handleNavigate = (id: string) => {
    router.push(`/gallery/detail/${id}`);
  };

  return (
    <div className="flex justify-center gap-[20px] p-11">
      {results.map((query, i) => {
        return (
          <div key={nanoid()} className="w-[240px] h-[240px]">
            {query.isLoading ? (
              <Skeleton className="w-[240px] h-[240px]" type="picture" />
            ) : query.data ? (
              <div
                onClick={() => handleNavigate(`${query.data.id}`)}
                className="flex flex-col items-center bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
                key={nanoid()}
              >
                <span className=" w-[100%] h-[10rem] object-cover mb-6 relative">
                  <Image
                    src={query.data.thumbnail ?? ''}
                    alt={query.data.title}
                    style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
                    width={500}
                    height={100}
                  />
                </span>
                <h3 className="text-xl font-bold mb-2">{query.data?.title}</h3>
                <h3 className="text-xl font-bold mb-2">{query.data?.id}</h3>
                <p className="text-gray-500 mb-4">{query.data?.content}</p>
                <div className="flex space-x-2">
                  {query.data.postcategory.map(category => (
                    <span key={nanoid()} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                      {category.category}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default GalleryPagination;
