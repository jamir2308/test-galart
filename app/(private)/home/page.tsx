import { getArtworks } from "@/services/dataServices";
import ArtworkGrid from "@/components/layout/ArtworkGrid";

export default async function HomePage() {
  const initialArtworksResponse = await getArtworks(1, 20);
  const initialArtworks = initialArtworksResponse.data;
  const totalPages = initialArtworksResponse.pagination.total_pages;
  const iiifBaseUrl = initialArtworksResponse.config?.iiif_url || "https://www.artic.edu/iiif/2";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-teal-700">
          Galería de Arte del Mundo
        </h1>
        <ArtworkGrid 
          initialArtworks={initialArtworks} 
          totalPages={totalPages}
          iiifBaseUrl={iiifBaseUrl}
        />
      </div>
    </div>
  );
}