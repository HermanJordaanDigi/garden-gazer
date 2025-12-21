import { useState } from "react";
import { Plant } from "@/types/plant";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
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

  const getInitials = () => {
    const common = plant.common_name || "";
    const scientific = plant.scientific_name || "";
    const name = common || scientific;
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const imageCount = plant.images?.length || 0;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-woodland-border-light">
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-woodland-surface-light">
        {plant.images?.[0] ? (
          <img
            src={plant.images[0]}
            alt={plant.common_name || "Plant"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-woodland-text-muted/30">
              {getInitials()}
            </span>
          </div>
        )}

        {/* Gallery Badge */}
        {imageCount > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <MaterialIcon name="photo_library" size="sm" />
            {imageCount}
          </div>
        )}

        {/* Upload Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-3 right-3 shadow-lg bg-white/90 hover:bg-white"
              onClick={() => setImageUrl(plant.images?.[0] || "")}
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
              {(selectedFile || imageUrl) && (
                <div className="grid gap-2">
                  <Label>Preview</Label>
                  <div className="relative h-48 bg-muted rounded-md overflow-hidden">
                    <img
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : imageUrl
                      }
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
