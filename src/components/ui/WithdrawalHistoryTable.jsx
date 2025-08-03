import { Eye, MoreHorizontal, X, Check, Trash2, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TableRowSkeleton from "../skeletons/TableRowSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useWithdrawalsStore } from "../../stores/useWithdrawalsStore";

const MobileCardSkeleton = () => (
  <Card className="mb-4">
    <CardContent className="pt-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function WithdrawalHistoryTable({
  withdrawals,
  loading,
  acceptedWithdrawalOrder,
  rejectedWithdrawalOrder,
  deleteWithdrawalOrder,
}) {
  const { page, setPage, totalPages, getWithdrawals } = useWithdrawalsStore();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState();
  const [adminNotes, setAdminNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleActionWithNote = async () => {
    if (!selectedWithdrawal || !actionType) return;

    const payload = {
      id: selectedWithdrawal.id,
      admin_notes: adminNotes || "لا توجد ملاحظات", // Default note if empty
    };

    try {
      if (actionType === "accept") {
        await acceptedWithdrawalOrder(payload);
      } else {
        await rejectedWithdrawalOrder(payload);
      }
      await getWithdrawals();
    } catch (error) {
      console.error("فشل تنفيذ الإجراء:", error);
    } finally {
      setIsDialogOpen(false);
      setAdminNotes("");
    }
  };

  const getSafeValue = (value, defaultValue = "غير محدد") => {
    return value || defaultValue;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    try {
      return new Date(dateString).toLocaleDateString("ar-EG");
    } catch {
      return "غير محدد";
    }
  };

  const columns = [
    {
      header: "الطالب",
      accessor: "account_name",
      label: "الطالب",
      customRender: (name) => getSafeValue(name, "طالب غير معروف"),
    },
    {
      header: "البنك",
      accessor: "bank_name",
      label: "البنك",
      customRender: (bank) => getSafeValue(bank, "غير محدد"),
    },
    {
      header: "IBAN",
      accessor: "iban",
      label: "IBAN",
      customRender: (iban) => getSafeValue(iban, "غير متوفر"),
    },
    {
      header: "المبلغ",
      accessor: "amount",
      label: "المبلغ",
      customRender: (amount) => `${(amount || 0).toLocaleString()} ر.س`,
    },
    {
      header: "التاريخ",
      accessor: "created_at",
      label: "التاريخ",
      customRender: (date) => formatDate(date),
    },
    {
      header: "الحالة",
      accessor: "status",
      label: "الحالة",
      customRender: (status) => {
        const safeStatus = getSafeValue(status, "pending");
        return (
          <Badge
            variant={
              safeStatus === "pending"
                ? "default"
                : safeStatus === "accepted"
                ? "success"
                : "destructive"
            }
            className="text-center"
          >
            {safeStatus === "pending"
              ? "قيد المعالجة"
              : safeStatus === "accepted"
              ? "مقبول"
              : "مرفوض"}
          </Badge>
        );
      },
    },
    {
      header: "ملاحظات",
      accessor: "admin_notes",
      label: "ملاحظات",
      customRender: (notes) => getSafeValue(notes, "لا توجد ملاحظات"),
    },
    {
      header: "الإجراءات",
      customRender: (_, item) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-0 shadow-lg w-48"
            >
              {item?.status !== "accepted" && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedWithdrawal(item);
                    setActionType("accept");
                    setIsDialogOpen(true);
                  }}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span>قبول الطلب</span>
                  <Check className="h-4 w-4 text-green-600" />
                </DropdownMenuItem>
              )}
              {item?.status !== "rejected" && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedWithdrawal(item);
                    setActionType("reject");
                    setIsDialogOpen(true);
                  }}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span>رفض الطلب</span>
                  <X className="h-4 w-4 text-red-600" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => deleteWithdrawalOrder({ id: item.id })}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              >
                <span>حذف الطلب</span>
                <Trash2 className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="تاريخ السحوبات"
        description="تتبع طلبات السحب السابقة"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" ? "قبول الطلب" : "رفض الطلب"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept"
                ? "يرجى إضافة ملاحظات قبل قبول الطلب"
                : "يرجى إضافة ملاحظات قبل رفض الطلب"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="أدخل ملاحظاتك هنا..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <DialogFooter className="space-x-2">
            <Button
              variant="destructive"
              onClick={() => setIsDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleActionWithNote}
              variant={actionType === "accept" ? "default" : "destructive"}
              disabled={loading}
            >
              {actionType === "accept" ? "تأكيد القبول" : "تأكيد الرفض"}
              {loading && <Loader2 className="animate-spin ml-2 size-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">
                تاريخ السحوبات
              </CardTitle>
              <CardDescription>جميع طلبات السحب السابقة</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="block md:hidden space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <MobileCardSkeleton key={index} />
              ))
            ) : withdrawals?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد سحوبات لعرضها
              </div>
            ) : (
              withdrawals.map((withdrawal) => (
                <Card key={withdrawal.id} className="border-muted/30">
                  <CardContent className="pt-4 space-y-3">
                    {columns
                      .filter((col) => col.accessor)
                      .map((column) => (
                        <div
                          key={column.accessor}
                          className="flex justify-between"
                        >
                          <span className="font-medium">{column.label}:</span>
                          <span className="text-muted-foreground">
                            {column.customRender
                              ? column.customRender(withdrawal[column.accessor])
                              : getSafeValue(withdrawal[column.accessor])}
                          </span>
                        </div>
                      ))}
                    <div className="pt-2">
                      {columns
                        .find((col) => !col.accessor)
                        ?.customRender(null, withdrawal)}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-muted/50">
                  {columns.map((column) => (
                    <TableHead
                      key={column.header}
                      className="font-semibold text-right"
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))
                ) : withdrawals?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      لا توجد سحوبات لعرضها
                    </TableCell>
                  </TableRow>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <TableRow
                      key={withdrawal.id}
                      className="border-b border-muted/30 hover:bg-muted/30 transition-colors"
                    >
                      {columns.map((column) => {
                        const value = column.accessor
                          ? withdrawal[column.accessor]
                          : null;

                        return (
                          <TableCell
                            key={`${withdrawal.id}-${
                              column.accessor || "actions"
                            }`}
                            className="text-right"
                          >
                            {column.customRender
                              ? column.customRender(value, withdrawal)
                              : getSafeValue(value)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2 rtl:space-x-reverse">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={async () => {
                  setPage(page - 1);
                  await getWithdrawals();
                }}
              >
                السابق
              </Button>
              <span className="text-sm px-2 pt-2">
                صفحة {page} من {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={async () => {
                  setPage(page + 1);
                  await getWithdrawals();
                }}
              >
                التالي
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
