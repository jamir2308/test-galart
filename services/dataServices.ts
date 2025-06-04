import axiosInstance from '@/config/axiosInstance';
import type { Artwork, ArticApiResponse } from '@/types/api.types';

const API_BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const getArtworks = async (page: number = 1, limit: number = 20): Promise<ArticApiResponse> => {
  try {
    const response = await axiosInstance.get<ArticApiResponse>(API_BASE_URL, {
      params: {
        page,
        limit,
        fields: 'id,title,image_id,artist_display,date_display,thumbnail,config',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

export const getArtworkImageUrl = (imageId: string | null, iiifUrl: string = 'https://www.artic.edu/iiif/2'): string => {
  if (!imageId) {
    return '/login-rafiki.svg';
  }
  return `${iiifUrl}/${imageId}/full/400,/0/default.jpg`;
};
