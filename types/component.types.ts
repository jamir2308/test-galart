import type { Artwork } from './api.types';

export interface ArtworkCardProps {
  artwork: Artwork;
  iiifBaseUrl: string;
  isPriority?: boolean;
}
