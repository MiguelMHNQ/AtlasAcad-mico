import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BadgeItemProps = {
  badge: string;
  onRemove?: () => void;
  editable?: boolean;
};

export function BadgeItem({ badge, onRemove, editable = false }: BadgeItemProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
      {badge}
      {editable && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}