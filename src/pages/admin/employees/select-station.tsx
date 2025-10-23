import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StationName } from "@/types/employee";

export default function SelectStation({
  open,
  onClose,
  stations,
  selected,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  stations: StationName[];
  selected: StationName[];
  onSave: (vals: StationName[]) => void;
}) {
  const [selectedStations, setSelectedStations] =
    useState<StationName[]>(selected);

  const toggleStation = (st: StationName) => {
    setSelectedStations((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Stations</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {stations.map((st) => (
            <div key={st} className="flex items-center gap-2">
              <Checkbox
                checked={selectedStations.includes(st)}
                onCheckedChange={() => toggleStation(st)}
              />
              <span className="capitalize">{st}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(selectedStations)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
