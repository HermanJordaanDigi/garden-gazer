import { useParams, useNavigate } from "react-router-dom";
import {
  usePlantById,
  useUpdatePlantImage,
  useMarkAsBought,
} from "@/hooks/usePlantsQuery";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  PlantHeroImage,
  PlantHeader,
  CharacteristicsGrid,
  DimensionsCard,
  BiologicalTraitsCard,
} from "@/components/plant-detail";
import { formatPrice } from "@/lib/color";

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: plant, isLoading } = usePlantById(id || "");
  const updateImageMutation = useUpdatePlantImage();
  const uploadImageMutation = useImageUpload();
  const markAsBoughtMutation = useMarkAsBought();

  const handleUpdateImage = async (imageUrl: string, file?: File) => {
    if (!plant) return;

    let finalImageUrl = imageUrl;

    // If a file is provided, upload it first
    if (file) {
      try {
        finalImageUrl = await uploadImageMutation.mutateAsync(file);
      } catch {
        toast.error("Failed to upload image. Please try again.");
        return;
      }
    }

    if (!finalImageUrl) {
      toast.error("Please select an image or enter a URL");
      return;
    }

    // Update plant record with the image URL
    try {
      await updateImageMutation.mutateAsync({
        plantId: plant.id,
        imageUrl: finalImageUrl,
      });

      toast.success("Plant image updated successfully");
    } catch {
      toast.error("Failed to update plant image");
    }
  };

  const handleMarkAsBought = async () => {
    if (!plant) return;

    try {
      await markAsBoughtMutation.mutateAsync(plant.id);

      toast.success("Plant added to your collection!");

      // Navigate back to home after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch {
      toast.error("Failed to mark as bought. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-woodland-primary border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    );
  }

  if (!plant) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <MaterialIcon
            name="search_off"
            className="text-woodland-text-muted mb-4"
            size="xl"
          />
          <h2 className="text-2xl font-bold mb-2 text-woodland-text-main">
            Plant not found
          </h2>
          <p className="text-woodland-text-muted mb-4">
            The plant you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>
            <MaterialIcon name="arrow_back" size="sm" className="mr-2" />
            Go back
          </Button>
        </div>
      </MainLayout>
    );
  }

  const breadcrumbItems = [
    { label: "Library", href: "/" },
    { label: plant.common_name || "Plant Details" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center gap-2">
            {plant.price !== null && (
              <span className="text-lg font-semibold text-woodland-primary">
                {formatPrice(plant.price)}
              </span>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Hero Image */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <PlantHeroImage
                plant={plant}
                onUpload={handleUpdateImage}
                isUploading={
                  uploadImageMutation.isPending || updateImageMutation.isPending
                }
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-8 space-y-6">
            <PlantHeader
              plant={plant}
              onMarkAsBought={handleMarkAsBought}
              isMarkingAsBought={markAsBoughtMutation.isPending}
            />

            <CharacteristicsGrid plant={plant} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DimensionsCard plant={plant} />
              <BiologicalTraitsCard plant={plant} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
