import { useParams, useNavigate } from "react-router-dom";
import { usePlantById } from "@/hooks/usePlantsQuery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoTile } from "@/components/InfoTile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Copy, ExternalLink, Sun, Wind, Sprout, Leaf } from "lucide-react";
import { parseFlowerColors, formatPrice } from "@/lib/color";
import { useToast } from "@/hooks/use-toast";

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: plant, isLoading } = usePlantById(id || "");

  const handleCopyJSON = () => {
    if (plant) {
      navigator.clipboard.writeText(JSON.stringify(plant, null, 2));
      toast({
        title: "Copied to clipboard",
        description: "Plant data copied as JSON",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Plant not found</h2>
          <Button onClick={() => navigate("/")}>Go back</Button>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const common = plant.common_name || "";
    const scientific = plant.scientific_name || "";
    const name = common || scientific;
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const flowerColors = parseFlowerColors(plant.flower_colour);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        {plant.images ? (
          <img 
            src={plant.images} 
            alt={plant.common_name || "Plant"} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl font-bold text-primary/40">
            {getInitials()}
          </div>
        )}
        
        {/* Back Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 left-4 shadow-lg"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 -mt-8">
        {/* Title Section */}
        <div className="bg-background rounded-t-3xl p-6 mb-4 shadow-lg">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {plant.common_name || "Unknown Plant"}
          </h1>
          <p className="text-xl italic text-muted-foreground mb-4">
            {plant.scientific_name || "—"}
          </p>
          {plant.native_region && (
            <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              {plant.native_region}
            </span>
          )}
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
                  {flowerColors.length > 0 ? (
                    flowerColors.map((color, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-border shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))
                  ) : (
                    <p className="text-foreground">—</p>
                  )}
                </div>
                {plant.flower_colour && (
                  <p className="text-sm text-muted-foreground mt-2">{plant.flower_colour}</p>
                )}
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

          {/* Location */}
          <AccordionItem value="location" className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Location / Meta
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Native Region</label>
                <p className="text-foreground">{plant.native_region || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bed</label>
                <p className="text-muted-foreground italic">—</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Section</label>
                <p className="text-muted-foreground italic">—</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-muted-foreground italic">—</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="container max-w-4xl mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Sheet
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={handleCopyJSON}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
