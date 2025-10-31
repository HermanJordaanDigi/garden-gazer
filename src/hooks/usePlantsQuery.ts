import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plant, SAMPLE_PLANTS } from "@/types/plant";

interface PlantFilters {
  search?: string;
  type?: string;
  sunExposure?: string;
  windTolerance?: string;
  floweringSeason?: string;
}

interface PlantSort {
  field: 'common_name' | 'price' | 'id';
  direction: 'asc' | 'desc';
}

interface UsePlantsQueryOptions {
  filters?: PlantFilters;
  sort?: PlantSort;
  pageSize?: number;
}

const PAGE_SIZE = 20;

export function usePlantsQuery({ 
  filters = {}, 
  sort = { field: 'common_name', direction: 'asc' },
  pageSize = PAGE_SIZE 
}: UsePlantsQueryOptions = {}) {
  
  return useInfiniteQuery({
    queryKey: ['plants', filters, sort],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        let query = supabase
          .from('nurserydb')
          .select('*', { count: 'exact' });

        // Apply search filter
        if (filters.search) {
          query = query.or(`common_name.ilike.%${filters.search}%,scientific_name.ilike.%${filters.search}%`);
        }

        // Apply type filter
        if (filters.type) {
          query = query.ilike('type', `%${filters.type}%`);
        }

        // Apply sun exposure filter
        if (filters.sunExposure) {
          query = query.ilike('sun_exposure', `%${filters.sunExposure}%`);
        }

        // Apply wind tolerance filter
        if (filters.windTolerance) {
          query = query.ilike('wind_tolerance', `%${filters.windTolerance}%`);
        }

        // Apply flowering season filter
        if (filters.floweringSeason) {
          query = query.ilike('flowering_season', `%${filters.floweringSeason}%`);
        }

        // Apply sorting
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });

        // Apply pagination
        const start = pageParam * pageSize;
        const end = start + pageSize - 1;
        query = query.range(start, end);

        const { data, error, count } = await query;

        if (error) throw error;

        return {
          plants: (data as Plant[]) || [],
          nextPage: (data?.length || 0) === pageSize ? pageParam + 1 : undefined,
          totalCount: count || 0
        };
      } catch (error) {
        console.error('Error fetching plants:', error);
        // Fallback to sample data
        const filteredPlants = SAMPLE_PLANTS.filter(plant => {
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
              plant.common_name?.toLowerCase().includes(searchLower) ||
              plant.scientific_name?.toLowerCase().includes(searchLower)
            );
          }
          return true;
        });

        return {
          plants: filteredPlants.slice(pageParam * pageSize, (pageParam + 1) * pageSize),
          nextPage: (pageParam + 1) * pageSize < filteredPlants.length ? pageParam + 1 : undefined,
          totalCount: filteredPlants.length
        };
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}

export function usePlantById(id: string) {
  return useQuery({
    queryKey: ['plant', id],
    queryFn: async () => {
      try {
        const plantId = parseInt(id, 10);
        const { data, error } = await supabase
          .from('nurserydb')
          .select('*')
          .eq('id', plantId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          // Fallback to sample data
          return SAMPLE_PLANTS.find(p => p.id === plantId) || null;
        }

        return data as Plant;
      } catch (error) {
        console.error('Error fetching plant:', error);
        const plantId = parseInt(id, 10);
        return SAMPLE_PLANTS.find(p => p.id === plantId) || null;
      }
    },
  });
}

export function useUpdatePlantImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ plantId, imageUrl }: { plantId: number; imageUrl: string }) => {
      const { data, error } = await supabase
        .from('nurserydb')
        .update({ images: imageUrl })
        .eq('id', plantId)
        .select()
        .single();

      if (error) throw error;
      return data as Plant;
    },
    onSuccess: (data) => {
      // Invalidate and refetch the plant query
      queryClient.invalidateQueries({ queryKey: ['plant', data.id.toString()] });
      // Also invalidate the plants list
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });
}
