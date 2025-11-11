import { useParams, useNavigate } from "react-router-dom";
import { usePlantById, useUpdatePlantImage, useMarkAsBought } from "@/hooks/usePlantsQuery";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { InfoTile } from "@/components/InfoTile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sun, Wind, Sprout, Leaf, ImagePlus, ShoppingBag } from "lucide-react";
import { parseFlowerColors, formatPrice } from "@/lib/color";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
export default function PlantDetail() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    data: plant,
    isLoading
  } = usePlantById(id || "");
  const updateImageMutation = useUpdatePlantImage();
  const uploadImageMutation = useImageUpload();
  const markAsBoughtMutation = useMarkAsBought();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const handleUpdateImage = async () => {
    if (!plant) return;
    let finalImageUrl = imageUrl.trim();

    // If a file is selected, upload it first
    if (selectedFile) {
      try {
        finalImageUrl = await uploadImageMutation.mutateAsync(selectedFile);
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }
    if (!finalImageUrl) {
      toast({
        title: "Error",
        description: "Please select an image or enter a URL",
        variant: "destructive"
      });
      return;
    }

    // Update plant record with the image URL
    try {
      await updateImageMutation.mutateAsync({
        plantId: plant.id,
        imageUrl: finalImageUrl
      });
      toast({
        title: "Success",
        description: "Plant image updated successfully"
      });
      setIsDialogOpen(false);
      setSelectedFile(null);
      setImageUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plant image",
        variant: "destructive"
      });
      console.error("Error updating image:", error);
    }
  };
  const handleMarkAsBought = async () => {
    if (!plant) return;
    try {
      await markAsBoughtMutation.mutateAsync(plant.id);
      toast({
        title: "Success!",
        description: "Plant added to your collection!"
      });

      // Navigate back to home after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as bought. Please try again.",
        variant: "destructive"
      });
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>;
  }
  if (!plant) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Plant not found</h2>
          <Button onClick={() => navigate("/")}>Go back</Button>
        </div>
      </div>;
  }
  const getInitials = () => {
    const common = plant.common_name || "";
    const scientific = plant.scientific_name || "";
    const name = common || scientific;
    return name.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2);
  };
  const flowerColors = parseFlowerColors(plant.flower_colour);
  return <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        {plant.images?.[0] ? <img src={plant.images[0]} alt={plant.common_name || "Plant"} className="w-full h-full object-cover" /> : <div className="text-6xl font-bold text-primary/40">
            {getInitials()}
          </div>}

        {/* Back Button */}
        <Button size="icon" variant="secondary" className="absolute top-4 left-4 shadow-lg" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Edit Image Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="secondary" className="absolute top-4 right-4 shadow-lg" onClick={() => setImageUrl(plant.images?.[0] || "")}>
              <ImagePlus className="w-5 h-5" />
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
                <Input id="image-file" type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setImageUrl("");
                }
              }} className="cursor-pointer" />
                {selectedFile && <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>}
              </div>
              
              {/* Preview Section */}
              {(selectedFile || imageUrl) && <div className="grid gap-2">
                  <Label>Preview</Label>
                  <div className="relative h-48 bg-muted rounded-md overflow-hidden">
                    <img src={selectedFile ? URL.createObjectURL(selectedFile) : imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => {
                  (e.target as HTMLImageElement).style.display = "none";
                }} />
                  </div>
                </div>}
              
              {/* Optional: URL Input Fallback */}
              <div className="grid gap-2">
                <Label htmlFor="image-url">Or enter image URL</Label>
                <Input id="image-url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={e => {
                setImageUrl(e.target.value);
                if (e.target.value) {
                  setSelectedFile(null);
                }
              }} disabled={!!selectedFile} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setSelectedFile(null);
              setImageUrl("");
            }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateImage} disabled={uploadImageMutation.isPending || updateImageMutation.isPending}>
                {uploadImageMutation.isPending ? "Uploading..." : updateImageMutation.isPending ? "Updating..." : "Update Image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4">
        {/* Title Section */}
        <div className="bg-background rounded-t-3xl p-6 mb-4 shadow-lg">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {plant.common_name || "Unknown Plant"}
          </h1>
          <p className="text-xl italic text-muted-foreground mb-4">
            {plant.scientific_name || "—"}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {plant.native_region && <span className="inline-block px-4 py-2 rounded-full inline-block -bottom-0 -bottom-0 -bottom-0.5 ">
                {plant.native_region}
              </span>}
            {!plant.bought && <Button onClick={handleMarkAsBought} disabled={markAsBoughtMutation.isPending} className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                {markAsBoughtMutation.isPending ? "Marking as Bought..." : "Mark as Bought"}
              </Button>}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <InfoTile icon={Leaf} label="Type" value={plant.type} />
          <InfoTile icon={Sun} label="Sun" value={plant.sun_exposure} />
          <InfoTile icon={Wind} label="Wind" value={plant.wind_tolerance} />
          <InfoTile icon={Sprout} label="Habit" value={plant.growth_habit} />
        </div>

        {/* Accordions */}
        <Accordion type="single" collapsible className="space-y-3">
          {/* Basics */}
          <AccordionItem value="basics" className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Basics
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Soil Type</label>
                <p className="text-foreground">{plant.soil_type || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mature Size</label>
                <p className="text-foreground">{plant.mature_height_width || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Price</label>
                <p className="text-foreground font-semibold">{formatPrice(plant.price)}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Flowering */}
          <AccordionItem value="flowering" className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Flowering
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Season</label>
                <p className="text-foreground">{plant.flowering_season || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Flower Colors</label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {flowerColors.length > 0 ? flowerColors.map((color, i) => <div key={i} className="w-10 h-10 rounded-full border-2 border-border shadow-sm" style={{
                  backgroundColor: color
                }} />) : <p className="text-foreground">—</p>}
                </div>
                {plant.flower_colour && <p className="text-sm text-muted-foreground mt-2">{plant.flower_colour}</p>}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Care Notes */}
          <AccordionItem value="care" className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Care / Notes
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <p className="text-muted-foreground italic">No notes added yet.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>;
}