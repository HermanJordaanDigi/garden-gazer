import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-woodland-background-light flex items-center justify-center mb-6">
          <MaterialIcon name="search_off" size="xl" className="text-woodland-text-muted" />
        </div>
        <h1 className="text-6xl font-bold text-woodland-text-main mb-4">404</h1>
        <p className="text-xl text-woodland-text-muted mb-8">
          Oops! This page seems to have wandered off the garden path.
        </p>
        <Button asChild className="bg-woodland-primary hover:bg-woodland-primary/90 text-white">
          <Link to="/">
            <MaterialIcon name="home" size="sm" className="mr-2" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFound;
