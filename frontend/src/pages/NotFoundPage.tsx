import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import StatusPageLayout from "../layouts/StatusPageLayout";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    <StatusPageLayout
      icon="❓"
      title="404 - Page Not Found"
      message="Sorry, we couldn't find the page you were looking for."
    >
      <Button onClick={handleGoBack} variant="secondary">
        Go Back
      </Button>
    </StatusPageLayout>
  );
}
