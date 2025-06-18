"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Artwork } from "@/types/api.types";
import { getArtworks } from "@/services/dataServices";
import ArtworkCard from "@/components/ui/ArtworkCard";
import { ArtworkGridProps } from "@/types/component.types";

export default function ArtworkGrid({ initialArtworks, totalPages, iiifBaseUrl }: ArtworkGridProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchMoreArtworks = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);
    setError(null);
    const nextPage = currentPage + 1;

    try {
      const response = await getArtworks(nextPage, 20);
      setArtworks((prevArtworks) => [...prevArtworks, ...response.data]);
      setCurrentPage(response.pagination.current_page);
    } catch (err) {
      setError("Error al cargar más obras de arte.");
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, totalPages, isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreArtworks();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [fetchMoreArtworks]);

  return (
    <>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      
      {artworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {artworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              iiifBaseUrl={iiifBaseUrl}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-slate-600">
          No hay obras de arte para mostrar. 🤔
        </p>
      )}

      {currentPage < totalPages && (
        <div ref={observerRef} style={{ height: '1px' }} />
      )}

      {isLoadingMore && (
        <div className="text-center py-8">
          <p className="text-lg text-slate-600">Cargando más obras...</p>
        </div>
      )}
    </>
  );
} 