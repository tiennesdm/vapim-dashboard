import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Page Not Found | VedaDB API Manager');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <h1 className="text-8xl font-bold text-muted-foreground/30 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        The page you are looking for does not exist or has been moved.
        Please check the URL or navigate back to the dashboard.
      </p>
      <Button onClick={() => navigate('/')} className="gap-2">
        <Home className="w-4 h-4" />
        Go to Dashboard
      </Button>
    </div>
  );
}
