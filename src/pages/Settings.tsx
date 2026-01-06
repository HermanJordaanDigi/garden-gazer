import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, isLoading: userLoading } = useUser();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (profile) {
      // Cast to access the new columns (types may not be updated yet)
      const p = profile as typeof profile & { garden_latitude?: number; garden_longitude?: number };
      if (p.garden_latitude) setLatitude(String(p.garden_latitude));
      if (p.garden_longitude) setLongitude(String(p.garden_longitude));
    }
  }, [profile]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(4));
        setLongitude(position.coords.longitude.toFixed(4));
        setIsDetecting(false);
        toast.success("Location detected successfully");
      },
      (error) => {
        setIsDetecting(false);
        toast.error("Failed to detect location: " + error.message);
      }
    );
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid coordinates");
      return;
    }

    if (lat < -90 || lat > 90) {
      toast.error("Latitude must be between -90 and 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      toast.error("Longitude must be between -180 and 180");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        garden_latitude: lat,
        garden_longitude: lng,
      } as Record<string, unknown>)
      .eq("id", user.id);

    setIsSaving(false);

    if (error) {
      toast.error("Failed to save location: " + error.message);
    } else {
      toast.success("Garden location saved successfully");
    }
  };

  if (userLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-woodland-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MaterialIcon name="login" size="xl" className="text-woodland-text-muted mb-4" />
              <p className="text-woodland-text-muted mb-4">Please log in to access settings</p>
              <Button onClick={() => navigate("/auth")}>Log In</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-woodland-text-main">Settings</h1>
          <p className="text-woodland-text-muted mt-1">Configure your garden location for weather data</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MaterialIcon name="location_on" className="text-woodland-primary" />
              Garden Location
            </CardTitle>
            <CardDescription>
              Set your garden's coordinates to get accurate weather, sunrise, and sunset times.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full"
            >
              {isDetecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-woodland-primary border-t-transparent rounded-full animate-spin mr-2" />
                  Detecting...
                </>
              ) : (
                <>
                  <MaterialIcon name="my_location" size="sm" className="mr-2" />
                  Detect My Location
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  placeholder="-33.9249"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
                <p className="text-xs text-woodland-text-muted">Between -90 and 90</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  placeholder="18.4241"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
                <p className="text-xs text-woodland-text-muted">Between -180 and 180</p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <MaterialIcon name="save" size="sm" className="mr-2" />
                  Save Location
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
