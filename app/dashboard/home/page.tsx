"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { getArtworks } from "@/services/dataServices";
import { Artwork } from "@/types/api.types";
import { ArtworkCard } from "@/lib/utils";

export default function HomePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iiifBaseUrl, setIiifBaseUrl] = useState(
    "https://www.artic.edu/iiif/2"
  );
  const itemsPerPage = 20;

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchArtworksData = useCallback(
    async (pageToFetch: number) => {
      if (pageToFetch === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      try {
        const response = await getArtworks(pageToFetch, itemsPerPage);
        setArtworks((prevArtworks) =>
          pageToFetch === 1
            ? response.data
            : [...prevArtworks, ...response.data]
        );
        setCurrentPage(response.pagination.current_page);
        setTotalPages(response.pagination.total_pages);
        if (response.config?.iiif_url) {
          setIiifBaseUrl(response.config.iiif_url);
        }
      } catch (err) {
        setError(
          "Error al cargar las obras de arte. Intenta de nuevo más tarde."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchArtworksData(1);
  }, [fetchArtworksData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && currentPage < totalPages && !isLoadingMore) {
          fetchArtworksData(currentPage + 1);
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
  }, [currentPage, totalPages, isLoadingMore, fetchArtworksData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
        <p className="text-xl text-slate-600">Cargando obras de arte... 🎨</p>
      </div>
    );
  }

  if (error && artworks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
        <p className="text-xl text-red-500">Error: {error} 😥</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-teal-700">
          Galería de Arte del Mundo
        </h1>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                iiifBaseUrl={iiifBaseUrl}
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-center text-xl text-slate-600">
              No hay obras de arte para mostrar. 🤔
            </p>
          )
        )}

        {!isLoading && currentPage < totalPages && artworks.length > 0 && (
          <div ref={observerRef} style={{ height: '1px' }} />
        )}

        {isLoadingMore && (
          <div className="text-center py-8">
            <p className="text-lg text-slate-600">Cargando más obras...</p>
          </div>
        )}
      </div>
    </div>
  );
}