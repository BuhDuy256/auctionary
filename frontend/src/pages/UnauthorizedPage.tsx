import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import StatusPageLayout from "../layouts/StatusPageLayout";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    <StatusPageLayout
      icon="🚫"
      title="Access Denied"
      message="You do not have permission to access this page."
    >
      <Button onClick={handleGoBack} variant="secondary">
        Go Back
      </Button>
    </StatusPageLayout>
  );
}
