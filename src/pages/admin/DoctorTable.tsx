import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import parse from "html-react-parser"

export const DoctorTable = ({ doctors, onEdit, onDelete, onToggleStatus, pageIndex, totalPages, onPageChange }: any) => {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead> {/* 🆕 Thêm cột ảnh */}
            <TableHead>Bác sĩ</TableHead>
            <TableHead>Giới thiệu</TableHead>
            <TableHead>Chuyên khoa</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor: any) => (
            <TableRow key={doctor.id}>
              <TableCell>
                {doctor.avatar ? (
                  <img
                    src={doctor.avatar}
                    alt={doctor.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted" />
                )}
              </TableCell>
              <TableCell>{doctor.fullName}</TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="link" size="sm">Xem Bio</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    {parse(doctor.bio || "<em>Không có bio</em>")}
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell><Badge>{doctor.specialty}</Badge></TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="link" size="sm">Xem Email</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="text-sm text-muted-foreground mb-2">{doctor.email}</div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Badge
                  variant={doctor.isActive ? "success" : "secondary"}
                  onClick={() => onToggleStatus(doctor.id)}
                  className="cursor-pointer"
                >
                  {doctor.isActive ? "Hoạt động" : "Tạm ngưng"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => onEdit(doctor)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(doctor.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <Button
          disabled={pageIndex <= 1}
          onClick={() => onPageChange(pageIndex - 1)}
          variant="outline"
        >
          ← Trang trước
        </Button>
        <span className="text-sm text-muted-foreground">
          Trang {pageIndex} / {totalPages}
        </span>
        <Button
          disabled={pageIndex >= totalPages}
          onClick={() => onPageChange(pageIndex + 1)}
          variant="outline"
        >
          Trang sau →
        </Button>
      </div>
    </div>
  )
}
