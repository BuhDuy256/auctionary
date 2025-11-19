import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import StatusPageLayout from "../layouts/StatusPageLayout";

export default function UnderDevelopmentPage() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    <StatusPageLayout
      icon="🚧"
      title="Feature Under Development"
      message="We're working hard to bring you this feature. Please check back soon!"
    >
      <Button onClick={handleGoBack} variant="secondary">
        Go Back
      </Button>
    </StatusPageLayout>
  );
}
