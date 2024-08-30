import { Post } from '@/types/galleryRefactor/galleryRefactor';
import { nanoid } from 'nanoid';

import Image from 'next/image';
import Link from 'next/link';

interface IPostProps {
  posts: Post[] | undefined;
}
const GalleryListItem = ({ posts }: IPostProps) => {
  const uniqueId = () => nanoid();
  return (
    <div className="flex flex-wrap justify-start w-[128rem] h-auto gap-[0.8rem] mx-auto">
      {posts?.map((post: Post) => (
        <Link
          href={{
            href: `/galleryRefactor/${post.id}`,
            query: { postId: post.id },
          }}
          shallow={true}
          prefetch={false}
          className="flex flex-col items-center w-[30.2rem] h-[32.5rem] bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
          key={uniqueId() + post.id}
        >
          <span className="w-[30.2rem] h-[20rem] object-cover mb-6 relative">
            <Image
              src={post.thumbnail ?? ''}
              alt={post.title}
              style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
              width={500}
              height={100}
            />
          </span>
          <h3 className="text-xl font-bold mb-2">{post?.title}</h3>
          <p className="text-gray-500 mb-4">{post?.content}</p>
          <div className="flex space-x-2">
            {post.postcategory.map(category => (
              <span key={uniqueId()} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                {category.category}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GalleryListItem;
