import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";
import ReactQuill from "react-quill";
import { useState } from "react";
import { SPECIALIZATIONS } from "../../lib/constants";

export const AddDoctorDialog = ({ isOpen, onOpenChange, onAdd }: any) => {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    bio: "",
    specialization: "",
    experience: 0
  });

  const handleSubmit = () => {
    const doctor = {
      id: Date.now(),
      ...newDoctor,
      avatar: "👨‍⚕️",
      status: "active"
    };
    onAdd(doctor);
    setNewDoctor({ name: "", email: "", bio: "", specialization: "", experience: 0 });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="medical" size="lg">
          <Plus className="h-5 w-5 mr-2" /> Thêm Bác sĩ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Thêm Bác sĩ Mới</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết của bác sĩ mới</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><Label>Họ và tên</Label><Input value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input type="email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} /></div>
          <div className="col-span-2">
            <Label>Giới thiệu / Bio</Label>
            <ReactQuill value={newDoctor.bio} onChange={(value) => setNewDoctor({ ...newDoctor, bio: value })} theme="snow" />
          </div>
          <div>
            <Label>Chuyên khoa</Label>
            <Select value={newDoctor.specialization} onValueChange={(val) => setNewDoctor({ ...newDoctor, specialization: val })}>
              <SelectTrigger><SelectValue placeholder="Chọn chuyên khoa" /></SelectTrigger>
              <SelectContent>
                {SPECIALIZATIONS.map((spec) => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Kinh nghiệm (năm)</Label>
            <Input type="number" min="0" value={newDoctor.experience} onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button variant="medical" onClick={handleSubmit}>Thêm Bác sĩ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};