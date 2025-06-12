import dynamic from "next/dynamic";

export const ArtworkCard = dynamic(() => import("@/components/ui/ArtworkCard"), {
  loading: () => <ArtworkCardSkeleton />,
  ssr: false,
});

export const ArtworkCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="relative w-full h-64 bg-gray-300"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-1/3 mb-3"></div>
      </div>
    </div>
);