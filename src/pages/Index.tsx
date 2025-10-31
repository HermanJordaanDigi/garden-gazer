import { useState, useEffect } from "react";
import { usePlantsQuery } from "@/hooks/usePlantsQuery";
import { PlantCard } from "@/components/PlantCard";
import { PlantSkeleton } from "@/components/PlantSkeleton";
import { FilterChips } from "@/components/FilterChips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, ChevronUp, ChevronDown, Leaf } from "lucide-react";
import { useInView } from "react-intersection-observer";
const typeOptions = ["Perennial", "Evergreen", "Deciduous"];
const sunOptions = ["Full Sun", "Partial Shade", "Shade"];
const windOptions = ["High", "Moderate", "Low"];
export default function Index() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    sunExposure: undefined as string | undefined,
    windTolerance: undefined as string | undefined,
    floweringSeason: undefined as string | undefined
  });
  const [sort, setSort] = useState<{
    field: 'common_name' | 'price' | 'id';
    direction: 'asc' | 'desc';
  }>({
    field: 'common_name',
    direction: 'asc'
  });
  const {
    ref: loadMoreRef,
    inView
  } = useInView();

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
    filters: {
      search: debouncedSearch,
      ...filters
    },
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

  const getSortLabel = () => {
    if (sort.field === 'common_name') {
      return sort.direction === 'asc' ? 'Common Name (A-Z)' : 'Common Name (Z-A)';
    }
    if (sort.field === 'price') {
      return sort.direction === 'asc' ? 'Price: Low → High' : 'Price: High → Low';
    }
    return 'Recently Added';
  };

  return <div className="min-h-screen bg-background">
      {/* Header - Green background like screenshot */}
      <header className="sticky top-0 z-10 shadow-md" style={{ backgroundColor: '#738678' }}>
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-white text-xl">Plants</h1>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for a plant..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-white/90 border-0"
              />
            </div>

            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sort and Filters Section */}
      <div className="sticky top-[60px] z-10 bg-background border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between mb-3 h-12 text-base">
                <span>Sort by: {getSortLabel()}</span>
                <div className="flex flex-col">
                  <ChevronUp className="w-4 h-4 -mb-2" />
                  <ChevronDown className="w-4 h-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] max-w-[calc(1536px-2rem)]">
              <DropdownMenuItem onClick={() => setSort({ field: 'common_name', direction: 'asc' })}>
                Common Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort({ field: 'common_name', direction: 'desc' })}>
                Common Name (Z-A)
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

          {/* Filter Chips */}
          <div className="space-y-2">
            <FilterChips
              label="Type"
              options={typeOptions}
              selected={filters.type}
              onSelect={value => setFilters(prev => ({ ...prev, type: value }))}
            />
            <FilterChips
              label="Sun Exposure"
              options={sunOptions}
              selected={filters.sunExposure}
              onSelect={value => setFilters(prev => ({ ...prev, sunExposure: value }))}
            />
            <FilterChips
              label="Wind Tolerance"
              options={windOptions}
              selected={filters.windTolerance}
              onSelect={value => setFilters(prev => ({ ...prev, windTolerance: value }))}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({
          length: 6
        }).map((_, i) => <PlantSkeleton key={i} />)}
          </div> : allPlants.length === 0 ? <div className="text-center py-16">
            <Leaf className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No plants found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search</p>
          </div> : <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPlants.map(plant => <PlantCard key={plant.id} plant={plant} />)}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isFetchingNextPage && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {Array.from({
              length: 3
            }).map((_, i) => <PlantSkeleton key={i} />)}
                  </div>}
              </div>}
          </>}
      </main>
    </div>;
}