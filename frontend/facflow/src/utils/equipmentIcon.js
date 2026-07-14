import {
  Bot,
  Cog,
  Cpu,
  Flame,
  Layers,
  Package,
  PaintBucket,
  ScanSearch,
  Wrench,
  Zap,
} from "lucide-react";

const TYPE_ICON = {
  CNC: Cpu,
  PRESS: Layers,
  LASER: Zap,
  ROBOT: Bot,
  ASSEMBLY: Wrench,
  WELDING: Flame,
  PAINT: PaintBucket,
  INSPECT: ScanSearch,
  PACKING: Package,
};

export function getEquipmentTypeIcon(name) {
  const prefix = (name || "").split("-")[0];
  return TYPE_ICON[prefix] || Cog;
}
