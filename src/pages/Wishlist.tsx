import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePlantsQuery } from "@/hooks/usePlantsQuery";
import { PlantCard } from "@/components/PlantCard";
import { PlantSkeleton } from "@/components/PlantSkeleton";
import { MainLayout } from "@/components/layout/MainLayout";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { AddPlantCard } from "@/components/dashboard/AddPlantCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

const typeOptions = ["Perennial", "Evergreen", "Deciduous"];

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, user } = useUser();

  // Read view mode and search from URL
  const view = searchParams.get("view") || "searches";
  const searchValue = searchParams.get("search") || "";
  const userName = profile?.display_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    sunExposure: undefined as string | undefined,
    windTolerance: undefined as string | undefined,
    floweringSeason: undefined as string | undefined,
  });

  const [sort, setSort] = useState<{
    field: "common_name" | "price" | "id";
    direction: "asc" | "desc";
  }>({
    field: "common_name",
    direction: "asc",
  });

  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePlantsQuery({
    filters: {
      ...filters,
      search: searchValue || undefined,
      bought: view === "collection",
    },
    sort,
  });

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPlants = data?.pages.flatMap((page) => page.plants) || [];

  const getSortLabel = () => {
    if (sort.field === "common_name") {
      return sort.direction === "asc" ? "Name (A-Z)" : "Name (Z-A)";
    }
    if (sort.field === "price") {
      return sort.direction === "asc" ? "Price ↑" : "Price ↓";
    }
    return "Recent";
  };

  // Update type filter
  const handleTypeFilter = (type: string | undefined) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <MainLayout>
      {/* Greeting Section */}
      <section className="max-w-7xl mx-auto w-full pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-woodland-text-main">
              {getGreeting()}, {userName}
            </h1>
            <p className="text-woodland-text-muted mt-2 text-lg font-light">
              Here's what's happening in your jungle today.
            </p>
          </div>
          <WeatherWidget />
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto w-full mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeFilter(undefined)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                filters.type === undefined
                  ? "bg-woodland-primary text-white"
                  : "bg-woodland-surface-light text-woodland-text-main hover:bg-woodland-background-light border border-woodland-border-light"
              )}
            >
              All
            </button>
            {typeOptions.map((type) => (
              <button
                key={type}
                onClick={() =>
                  handleTypeFilter(filters.type === type ? undefined : type)
                }
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  filters.type === type
                    ? "bg-woodland-primary text-white"
                    : "bg-woodland-surface-light text-woodland-text-main hover:bg-woodland-background-light border border-woodland-border-light"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-woodland-border-light bg-woodland-surface-light text-woodland-text-main hover:bg-woodland-background-light"
              >
                <MaterialIcon name="sort" size="sm" className="mr-2" />
                {getSortLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSort({ field: "common_name", direction: "asc" })}
              >
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSort({ field: "common_name", direction: "desc" })}
              >
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSort({ field: "price", direction: "asc" })}
              >
                Price: Low → High
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSort({ field: "price", direction: "desc" })}
              >
                Price: High → Low
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSort({ field: "id", direction: "desc" })}
              >
                Recently Added
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlantSkeleton key={i} />
            ))}
          </div>
        ) : allPlants.length === 0 ? (
          <div className="text-center py-16">
            <MaterialIcon
              name="potted_plant"
              size="xl"
              className="text-woodland-text-muted mx-auto mb-4 opacity-50"
            />
            <h3 className="text-lg font-semibold mb-2 text-woodland-text-main">
              No plants found
            </h3>
            <p className="text-woodland-text-muted">
              Try adjusting your filters or search
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {allPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
              <AddPlantCard />
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isFetchingNextPage && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <PlantSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
}
