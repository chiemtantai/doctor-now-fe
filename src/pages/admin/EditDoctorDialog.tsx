import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { SPECIALIZATIONS } from "../../lib/constants";

export const EditDoctorDialog = ({ doctor, isOpen, onClose, onSave }: any) => {
  const [localDoctor, setLocalDoctor] = useState(doctor);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    setLocalDoctor(doctor);
    setAvatarPreview(doctor?.avatar || null);
    setAvatarFile(null);
  }, [doctor]);


  const setField = (field: string, value: any) => {
    setLocalDoctor((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedDoctor = {
      ...localDoctor,
      avatar: avatarFile ?? localDoctor.avatar,
    };
    onSave(updatedDoctor);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (!localDoctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin Bác sĩ</DialogTitle>
          <DialogDescription>Cập nhật thông tin chi tiết của bác sĩ</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 mt-4">
          {/* Phần thông tin bác sĩ */}
          <div className="col-span-2 space-y-4">
            <div>
              <Label>Họ và tên</Label>
              <Input
                value={localDoctor.fullName || ""}
                onChange={(e) => setField("fullName", e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={localDoctor.email || ""}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div>
              <Label>Chuyên khoa</Label>
              <Select
                value={localDoctor.specialization || ""}
                onValueChange={(val) => setField("specialization", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chuyên khoa" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Giới thiệu / Bio</Label>
              <ReactQuill
                value={localDoctor.bio || ""}
                onChange={(val) => setField("bio", val)}
                theme="snow"
              />
            </div>
          </div>

          {/* Phần ảnh đại diện */}
          <div className="col-span-1 flex flex-col items-center gap-3">
            <Label>Ảnh đại diện</Label>
            <div className="w-24 h-24">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full rounded-full object-cover border"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm">
                  No Avatar
                </div>
              )}
            </div>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button variant="medical" onClick={handleSave}>Cập nhật</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
