import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FilterChipsProps {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (value: string | undefined) => void;
}

export function FilterChips({ label, options, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {options.map((option) => (
            <Badge
              key={option}
              variant={selected === option ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105 active:scale-95",
                selected === option && "shadow-md"
              )}
              onClick={() => onSelect(selected === option ? undefined : option)}
            >
              {option}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
