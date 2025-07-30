import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const DoctorSearch = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm theo tên, email hoặc chuyên khoa..."
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);