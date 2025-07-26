import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,DialogTrigger } from "@/components/ui/dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Stethoscope, User, Mail, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import parse from "html-react-parser";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Doctor {
  id: number
  name: string
  email: string
  bio: string
  specialization: string
  experience: number
  status: "active" | "inactive"
  avatar: string
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "BS. Nguyễn Văn A",
    email: "nguyenvana@hospital.com",
    bio: "<p>Bác sĩ chuyên khoa <strong>Tim mạch</strong> với hơn 10 năm kinh nghiệm trong điều trị cao huyết áp và suy tim.</p>",
    specialization: "Tim mạch",
    experience: 10,
    status: "active",
    avatar: "👨‍⚕️"
  },
  {
    id: 2,
    name: "BS. Trần Thị B",
    email: "tranthib@hospital.com",
    bio: "<p>Bác sĩ Nội khoa, có chuyên môn sâu về <em>rối loạn tiêu hóa</em> và bệnh lý chuyển hóa.</p>",
    specialization: "Nội khoa",
    experience: 8,
    status: "active",
    avatar: "👩‍⚕️"
  },
  {
    id: 3,
    name: "BS. Lê Văn C",
    email: "levanc@hospital.com",
    bio: "<p>Chuyên gia <strong>Ngoại khoa</strong>, từng thực hiện hơn 500 ca phẫu thuật nội soi ổ bụng thành công.</p>",
    specialization: "Ngoại khoa",
    experience: 12,
    status: "inactive",
    avatar: "👨‍⚕️"
  }
]

export default function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    bio: "",
    specialization: "",
    experience: 0
  })

  const { toast } = useToast()

  const specializations = [
    "Tim mạch",
    "Nội khoa",
    "Ngoại khoa",
    "Nhi khoa",
    "Sản phụ khoa",
    "Mắt",
    "Tai mũi họng",
    "Da liễu",
    "Tâm thần",
    "Chấn thương chỉnh hình"
  ]

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddDoctor = () => {
    const doctor: Doctor = {
      id: Date.now(),
      ...newDoctor,
      status: "active",
      avatar: "👨‍⚕️"
    }
    setDoctors([...doctors, doctor])
    setNewDoctor({ name: "", email: "", bio: "", specialization: "", experience: 0 })
    setIsAddDialogOpen(false)
    toast({
      title: "Thành công",
      description: "Đã thêm bác sĩ mới thành công",
    })
  }

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setIsEditDialogOpen(true)
  }

  const handleUpdateDoctor = () => {
    if (!editingDoctor) return

    setDoctors(doctors.map(d =>
      d.id === editingDoctor.id ? editingDoctor : d
    ))
    setIsEditDialogOpen(false)
    setEditingDoctor(null)
    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin bác sĩ",
    })
  }

  const handleDeleteDoctor = (id: number) => {
    setDoctors(doctors.filter(d => d.id !== id))
    toast({
      title: "Thành công",
      description: "Đã xóa bác sĩ",
      variant: "destructive"
    })
  }

  const toggleDoctorStatus = (id: number) => {
    setDoctors(doctors.map(d =>
      d.id === id
        ? { ...d, status: d.status === "active" ? "inactive" : "active" as const }
        : d
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            Quản lý Bác sĩ
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin và lịch trình của các bác sĩ
          </p>
        </div>

        {/* Form thêm bác sĩ */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="medical" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Thêm Bác sĩ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl"> {/* mở rộng dialog hơn */}
            <DialogHeader>
              <DialogTitle>Thêm Bác sĩ Mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết của bác sĩ mới
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Họ và tên */}
              <div className="col-span-1">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="VD: BS. Nguyễn Văn A"
                />
              </div>

              {/* Email */}
              <div className="col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  placeholder="bacsi@hospital.com"
                />
              </div>

              {/* Bio - chiếm 2 cột */}
              <div className="col-span-2">
                <Label htmlFor="bio">Giới thiệu / Bio</Label>
                <ReactQuill
                  id="bio"
                  value={newDoctor.bio}
                  onChange={(value) => setNewDoctor({ ...newDoctor, bio: value })}
                  placeholder="Một vài dòng giới thiệu về bác sĩ..."
                  theme="snow"
                />
              </div>

              {/* Chuyên khoa */}
              <div className="col-span-1">
                <Label htmlFor="specialization">Chuyên khoa</Label>
                <Select
                  value={newDoctor.specialization}
                  onValueChange={(value) => setNewDoctor({ ...newDoctor, specialization: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kinh nghiệm */}
              <div className="col-span-1">
                <Label htmlFor="experience">Kinh nghiệm (năm)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={newDoctor.experience}
                  onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value) || 0 })}
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="medical" onClick={handleAddDoctor}>
                Thêm Bác sĩ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Tổng bác sĩ</p>
                <p className="text-2xl font-bold">{doctors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-medium">Đang hoạt động</p>
                <p className="text-2xl font-bold">
                  {doctors.filter(d => d.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Tạm ngưng</p>
                <p className="text-2xl font-bold">
                  {doctors.filter(d => d.status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Bác sĩ</CardTitle>
          <CardDescription>
            Quản lý thông tin tất cả bác sĩ trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc chuyên khoa..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bác sĩ</TableHead>
                  <TableHead>Giới thiệu</TableHead>
                  <TableHead>Chuyên khoa</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {doctor.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {doctor.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {doctor.email}
                        </div>
                        {/* Rút gọn bio + popover hiển thị chi tiết */}
                        <div className="flex items-center gap-1 text-sm">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground">
                                <FileText className="h-3 w-3 mr-1" />
                                Xem Bio
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-sm max-h-[300px] overflow-auto text-sm prose">
                              {parse(doctor.bio || "<em>Chưa có giới thiệu</em>")}
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doctor.specialization}</Badge>
                    </TableCell>
                    <TableCell>{doctor.experience} năm</TableCell>
                    <TableCell>
                      <Badge
                        variant={doctor.status === "active" ? "success" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleDoctorStatus(doctor.id)}
                      >
                        {doctor.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Không tìm thấy bác sĩ nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin Bác sĩ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết của bác sĩ
            </DialogDescription>
          </DialogHeader>

          {editingDoctor && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Họ và tên */}
              <div className="col-span-1">
                <Label htmlFor="edit-name">Họ và tên</Label>
                <Input
                  id="edit-name"
                  value={editingDoctor.name}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, name: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div className="col-span-1">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingDoctor.email}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, email: e.target.value })
                  }
                />
              </div>

              {/* Bio */}
              <div className="col-span-2">
                <Label htmlFor="edit-bio">Giới thiệu / Bio</Label>
                <ReactQuill
                  id="edit-bio"
                  value={editingDoctor.bio}
                  onChange={(value) =>
                    setEditingDoctor({ ...editingDoctor, bio: value })
                  }
                  placeholder="Thông tin giới thiệu về bác sĩ..."
                  theme="snow"
                />
              </div>

              {/* Chuyên khoa */}
              <div className="col-span-1">
                <Label htmlFor="edit-specialization">Chuyên khoa</Label>
                <Select
                  value={editingDoctor.specialization}
                  onValueChange={(value) =>
                    setEditingDoctor({ ...editingDoctor, specialization: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kinh nghiệm */}
              <div className="col-span-1">
                <Label htmlFor="edit-experience">Kinh nghiệm (năm)</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={editingDoctor.experience}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      experience: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="medical" onClick={handleUpdateDoctor}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}