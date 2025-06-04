export interface Artwork {
  id: number;
  title: string;
  image_id: string | null;
  artist_display: string;
  date_display: string;
  thumbnail?: {
    lqip: string;
    alt_text: string;
  };
}

export interface ArticApiResponse {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url?: string;
  };
  data: Artwork[];
  config: {
    iiif_url: string;
  };
} 