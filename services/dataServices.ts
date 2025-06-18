import type { ArticApiResponse } from '@/types/api.types';

const API_BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const getArtworks = async (page: number = 1, limit: number = 20): Promise<ArticApiResponse> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      fields: 'id,title,image_id,artist_display,date_display,thumbnail,config',
    });
    
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      next: { revalidate: 3600 } // Cache por 1 hora (3600 segundos)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArticApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

export const getArtworkImageUrl = (
  imageId: string | null,
  iiifUrl: string = 'https://www.artic.edu/iiif/2',
): string => {
  if (!imageId) {
    return '/login-rafiki.svg';
  }
  return `${iiifUrl}/${imageId}/full/400,/0/default.jpg`;
};
