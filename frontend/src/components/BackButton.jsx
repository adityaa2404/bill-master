import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-light-blue hover:text-accent 
                 transition px-3 py-2 text-sm"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
};

export default BackButton;
