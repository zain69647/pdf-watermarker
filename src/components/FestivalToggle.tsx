import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';

interface FestivalToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const FestivalToggle = ({ enabled, onToggle }: FestivalToggleProps) => {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Festival Decorations</span>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        aria-label="Toggle festival decorations"
      />
    </div>
  );
};

export default FestivalToggle;
