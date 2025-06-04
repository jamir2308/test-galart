"use client";

import Image from 'next/image';
import { getArtworkImageUrl } from '@/services/dataServices';
import { Artwork } from '@/types/api.types';

export interface ArtworkCardProps {
  artwork: Artwork;
  iiifBaseUrl: string;
}

const ArtworkCard = ({ artwork, iiifBaseUrl }: ArtworkCardProps) => {
  const imageUrl = getArtworkImageUrl(artwork.image_id, iiifBaseUrl);
  const placeholderImage = artwork.thumbnail?.lqip || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={artwork.thumbnail?.alt_text || artwork.title}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={placeholderImage}
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={artwork.title}>{artwork.title}</h3>
        <p className="text-sm text-gray-600 mb-1 truncate" title={artwork.artist_display}>{artwork.artist_display || 'Artista desconocido'}</p>
        <p className="text-xs text-gray-500 mb-3">{artwork.date_display || 'Fecha desconocida'}</p>
      </div>
    </div>
  );
};

export default ArtworkCard; 