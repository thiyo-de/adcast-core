import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate("/")}
      className="mb-4 sm:mb-6 min-h-[44px]"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Home
    </Button>
  );
};
