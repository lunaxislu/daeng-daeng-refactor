import { Post } from '@/types/galleryRefactor/galleryRefactor';
import axios from 'axios';
// api 주소
const ApiURL = process.env.NEXT_PUBLIC_GALLERY_API_BASE_URL;

const APInstance = axios.create({
  baseURL: ApiURL,
});

// Client InfinityScroll Fn
export const handleApiRouter = async ({ pageParam = 1 }) => {
  try {
    const { data } = await APInstance.get(`gallery/handler`, {
      params: {
        type: 'infinity',
        find: pageParam,
      },
    });

    return data as Post[];
  } catch (err) {
    throw err;
  }
};

export const handleDetailApiRouter = async (id: string) => {
  try {
    const { data } = await APInstance.get(`gallery/handler`, {
      params: {
        type: 'specific',
        find: `${id}`,
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
};

// 서버주소
const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const instance = axios.create({
  baseURL,
});
// SSR infinity
export const fetchInfinityGalleries = async ({ pageParam = 1 }) => {
  try {
    const { data } = await instance.get(`post/All/${pageParam}`);

    return data;
  } catch (err) {
    throw err;
  }
};

// SSR Find One
export const fetchGalleryDetail = async (id: string) => {
  try {
    const { data } = await instance.get(`post/${id}`);
    return data;
  } catch (err) {
    throw err;
  }
};
