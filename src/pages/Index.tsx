import { useState, useEffect } from "react";
import { usePlantsQuery } from "@/hooks/usePlantsQuery";
import { PlantCard } from "@/components/PlantCard";
import { PlantSkeleton } from "@/components/PlantSkeleton";
import { FilterChips } from "@/components/FilterChips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ArrowUpDown, Leaf, RefreshCw } from "lucide-react";
import { useInView } from "react-intersection-observer";

const typeOptions = ["Perennial", "Evergreen", "Deciduous"];
const sunOptions = ["Full Sun", "Partial Shade", "Shade"];
const windOptions = ["High", "Moderate", "Low"];
const seasonOptions = ["Spring", "Summer", "Autumn", "Winter"];

export default function Index() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    sunExposure: undefined as string | undefined,
    windTolerance: undefined as string | undefined,
    floweringSeason: undefined as string | undefined,
  });
  const [sort, setSort] = useState<{ field: 'common_name' | 'price' | 'id'; direction: 'asc' | 'desc' }>({
    field: 'common_name',
    direction: 'asc'
  });

  const { ref: loadMoreRef, inView } = useInView();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    refetch,
    isFetching 
  } = usePlantsQuery({
    filters: { search: debouncedSearch, ...filters },
    sort
  });

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPlants = data?.pages.flatMap(page => page.plants) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const handleRefresh = () => {
    refetch();
  };

  const getSortLabel = () => {
    if (sort.field === 'common_name') {
      return sort.direction === 'asc' ? 'A → Z' : 'Z → A';
    }
    if (sort.field === 'price') {
      return sort.direction === 'asc' ? 'Price: Low → High' : 'Price: High → Low';
    }
    return 'Recently Added';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Plants</h1>
              <p className="text-sm text-muted-foreground">{totalCount} plants in catalog</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="ml-auto"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <FilterChips
              label="Type"
              options={typeOptions}
              selected={filters.type}
              onSelect={(value) => setFilters(prev => ({ ...prev, type: value }))}
            />
            <FilterChips
              label="Sun Exposure"
              options={sunOptions}
              selected={filters.sunExposure}
              onSelect={(value) => setFilters(prev => ({ ...prev, sunExposure: value }))}
            />
            <FilterChips
              label="Wind Tolerance"
              options={windOptions}
              selected={filters.windTolerance}
              onSelect={(value) => setFilters(prev => ({ ...prev, windTolerance: value }))}
            />
            <FilterChips
              label="Season"
              options={seasonOptions}
              selected={filters.floweringSeason}
              onSelect={(value) => setFilters(prev => ({ ...prev, floweringSeason: value }))}
            />
          </div>

          {/* Sort */}
          <div className="mt-4 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  {getSortLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSort({ field: 'common_name', direction: 'asc' })}>
                  A → Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort({ field: 'common_name', direction: 'desc' })}>
                  Z → A
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort({ field: 'price', direction: 'asc' })}>
                  Price: Low → High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort({ field: 'price', direction: 'desc' })}>
                  Price: High → Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort({ field: 'id', direction: 'desc' })}>
                  Recently Added
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlantSkeleton key={i} />
            ))}
          </div>
        ) : allPlants.length === 0 ? (
          <div className="text-center py-16">
            <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No plants found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isFetchingNextPage && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <PlantSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
