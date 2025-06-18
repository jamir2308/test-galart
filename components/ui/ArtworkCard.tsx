"use client";

import Image from 'next/image';
import { getArtworkImageUrl } from '@/services/dataServices';
import { ArtworkCardProps } from '@/types/component.types';

const ArtworkCard = ({ artwork, iiifBaseUrl, priority = false }: ArtworkCardProps) => {
  const placeholderImage = artwork.thumbnail?.lqip || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

  const imageUrl = getArtworkImageUrl(artwork.image_id, iiifBaseUrl);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={artwork.thumbnail?.alt_text || artwork.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={placeholderImage}
          priority={priority}
        />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={artwork.title}>{artwork.title}</h2>
        <p className="text-sm text-gray-600 mb-1 truncate" title={artwork.artist_display}>{artwork.artist_display || 'Artista desconocido'}</p>
        <p className="text-xs text-gray-500 mb-3">{artwork.date_display || 'Fecha desconocida'}</p>
      </div>
    </div>
  );
};

export default ArtworkCard; 