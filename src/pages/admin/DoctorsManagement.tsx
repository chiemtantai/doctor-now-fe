import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDoctorsPaged, updateDoctor } from "../../lib/DoctorApi";
import { DoctorStats } from "../admin/DoctorStats";
import { DoctorSearch } from "../admin/DoctorSearch";
import { AddDoctorDialog } from "../admin/AddDoctorDialog";
import { EditDoctorDialog } from "../admin/EditDoctorDialog";
import { DoctorTable } from "../admin/DoctorTable";

interface Doctor {
  id: string;
  name: string;
  email: string;
  bio: string;
  specialization: string;
  experience: number;
  status: string;
  avatar?: string;
}

export default function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const { toast } = useToast();

  const fetchDoctors = () => {
    getDoctorsPaged(pageIndex, 10)
      .then((res) => {
        setDoctors(res.items);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [pageIndex]);

  const handleAddDoctor = (doctor: Doctor) => {
    setDoctors((prev) => [...prev, doctor]);
    toast({ title: "Thành công", description: "Đã thêm bác sĩ mới thành công" });
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDoctor = async (updated: Doctor) => {
    try {
      const { id, ...rest } = updated;
      await updateDoctor(id, rest);

      setDoctors((prev) =>
        prev.map((doc) => (doc.id === id ? updated : doc))
      );

      toast({
        title: "Thành công",
        description: "Đã cập nhật bác sĩ",
        variant: "success",
      });

      setIsEditDialogOpen(false);
      setEditingDoctor(null);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bác sĩ",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    toast({ title: "Đã xoá bác sĩ", variant: "destructive" });
  };

  const toggleDoctorStatus = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, status: doc.status === "active" ? "inactive" : "active" }
          : doc
      )
    );
  };

  const filteredDoctors = doctors.filter((doc) =>
    (doc.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (doc.specialization?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (doc.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Quản lý Bác sĩ
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin và lịch trình của các bác sĩ
          </p>
        </div>
        <AddDoctorDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddDoctor}
        />
      </div>

      <DoctorStats doctors={doctors} />
      <DoctorSearch value={searchQuery} onChange={setSearchQuery} />

      <DoctorTable
        doctors={filteredDoctors}
        onEdit={handleEditDoctor}
        onDelete={handleDeleteDoctor}
        onToggleStatus={toggleDoctorStatus}
        pageIndex={pageIndex}
        totalPages={totalPages}
        onPageChange={setPageIndex}
      />

      {editingDoctor && (
        <EditDoctorDialog
          doctor={editingDoctor}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleUpdateDoctor}
        />
      )}
    </div>
  );
}
