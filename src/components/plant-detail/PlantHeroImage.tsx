import { useState, useEffect, useCallback } from "react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    } else if (imageUrl.trim()) {
      await onUpload(imageUrl.trim());
    }
    setIsDialogOpen(false);
    setSelectedFile(null);
    setImageUrl("");
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
              onClick={() => setImageUrl(plant.images?.[currentImageIndex] || "")}
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
                      setImageUrl("");
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
              {(previewUrl || imageUrl) && (
                <div className="grid gap-2">
                  <Label>Preview</Label>
                  <div className="relative h-48 bg-muted rounded-md overflow-hidden">
                    <img
                      src={previewUrl || imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* URL Input Fallback */}
              <div className="grid gap-2">
                <Label htmlFor="image-url">Or enter image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value) {
                      setSelectedFile(null);
                    }
                  }}
                  disabled={!!selectedFile}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedFile(null);
                  setImageUrl("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Update Image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
