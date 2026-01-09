import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plant } from "@/types/plant";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getPlantInitials } from "@/lib/plant-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlantHeroImageProps {
  plant: Plant;
  onUpload: (imageUrl: string, file?: File) => Promise<void>;
  isUploading?: boolean;
}

export function PlantHeroImage({
  plant,
  onUpload,
  isUploading = false,
}: PlantHeroImageProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const imageCount = plant.images?.length || 0;

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Reset image index when plant changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [plant.id]);

  // Gallery navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageCount - 1));
  }, [imageCount]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev < imageCount - 1 ? prev + 1 : 0));
  }, [imageCount]);

  // Keyboard navigation
  useEffect(() => {
    if (imageCount <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageCount, goToPrevious, goToNext]);

  const handleSubmit = async () => {
    if (selectedFile) {
      await onUpload("", selectedFile);
    }
    setIsDialogOpen(false);
    setSelectedFile(null);
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    toast.info("Generating botanical illustration...", { id: "generate-image" });

    try {
      const response = await fetch(
        "https://jordaandigi.app.n8n.cloud/webhook/gen-botanical-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              id: plant.id,
              scientific_name: plant.scientific_name,
              common_name: plant.common_name,
              native_region: plant.native_region,
              type: plant.type,
              soil_type: plant.soil_type,
              sun_exposure: plant.sun_exposure,
              wind_tolerance: plant.wind_tolerance,
              growth_habit: plant.growth_habit,
              mature_height_width: plant.mature_height_width,
              flowering_season: plant.flowering_season,
              flower_colour: plant.flower_colour,
              images: plant.images,
              bought: plant.bought,
              price: plant.price,
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      toast.success("Botanical illustration generated!", { id: "generate-image" });

      setIsDialogOpen(false);

      // Refetch the plant data to show the new image
      await queryClient.refetchQueries({ queryKey: ["plant", plant.id] });
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    } catch (error) {
      toast.error("Failed to generate image. Please try again.", { id: "generate-image" });
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-woodland-border-light">
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-woodland-surface-light">
        {plant.images?.[currentImageIndex] ? (
          <img
            src={plant.images[currentImageIndex]}
            alt={`${plant.common_name || "Plant"} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-woodland-text-muted/30">
              {getPlantInitials(plant.common_name, plant.scientific_name)}
            </span>
          </div>
        )}

        {/* Gallery Navigation */}
        {imageCount > 1 && (
          <>
            {/* Previous Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-3 top-1/2 -translate-y-1/2 shadow-lg bg-white/90 hover:bg-white h-10 w-10"
              onClick={goToPrevious}
            >
              <MaterialIcon name="chevron_left" size="lg" />
            </Button>

            {/* Next Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-3 top-1/2 -translate-y-1/2 shadow-lg bg-white/90 hover:bg-white h-10 w-10"
              onClick={goToNext}
            >
              <MaterialIcon name="chevron_right" size="lg" />
            </Button>

            {/* Image Counter Badge */}
            <div className="absolute top-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <MaterialIcon name="photo_library" size="sm" />
              {currentImageIndex + 1} / {imageCount}
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {plant.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Upload Button - positioned top-left when gallery has nav controls */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className={`absolute shadow-lg bg-white/90 hover:bg-white ${
                imageCount > 1 ? "top-3 left-3" : "bottom-3 right-3"
              }`}
            >
              <MaterialIcon name="add_photo_alternate" size="md" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Update Plant Image</DialogTitle>
              <DialogDescription>
                Upload a new image for {plant.common_name || "this plant"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* File Upload Section */}
              <div className="grid gap-2">
                <Label htmlFor="image-file">Upload Image</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {/* Preview Section */}
              {previewUrl && (
                <div className="grid gap-2">
                  <Label>Preview</Label>
                  <div className="relative h-48 bg-muted rounded-md overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-woodland-border-light" />
                </div>
              </div>

              {/* Generate AI Image */}
              <div className="grid gap-2">
                <Label>Generate with AI</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="w-full border-woodland-primary text-woodland-primary hover:bg-woodland-primary/10"
                >
                  {isGenerating ? (
                    <>
                      <MaterialIcon name="progress_activity" className="mr-2 animate-spin" size="sm" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="auto_awesome" className="mr-2" size="sm" />
                      Generate Botanical Illustration
                    </>
                  )}
                </Button>
                <p className="text-xs text-woodland-text-muted">
                  Uses AI to create a botanical illustration for {plant.common_name || plant.scientific_name}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isUploading || !selectedFile}>
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
