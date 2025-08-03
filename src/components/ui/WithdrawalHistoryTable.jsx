"use client";
import {
  Eye,
  MoreHorizontal,
  X,
  Check,
  Trash2,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";
import Head from "next/head";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariantMap = {
  pending: "default",
  accepted: "success",
  rejected: "destructive",
  completed: "completed",
};

const statusLabelMap = {
  pending: "بانتظار التنفيذ",
  accepted: "تمت الموافقة",
  rejected: "مرفوض",
  completed: "مكتمل",
};

const WithdrawalStatsCard = ({ title, value }) => (
  <Card className="flex-1 text-center transition-all hover:shadow-md">
    <CardContent className="p-4">
      <h3 className="text-primary text-lg font-semibold">{title}</h3>
      <p className="font-bold text-2xl mt-3 animate-fade-in">{value}</p>
    </CardContent>
  </Card>
);

const MobileWithdrawalCard = ({ withdrawal, columns, onAction }) => (
  <Card key={withdrawal.id} className="border-muted/30 mb-4 animate-fade-in">
    <CardContent className="p-4 space-y-3">
      {columns
        .filter((col) => col.accessor)
        .map((column) => (
          <div key={column.accessor} className="flex justify-between">
            <span className="font-medium">{column.label}:</span>
            <span className="text-muted-foreground">
              {column.customRender
                ? column.customRender(withdrawal[column.accessor], withdrawal)
                : withdrawal[column.accessor] || "غير محدد"}
            </span>
          </div>
        ))}
      <div className="pt-2">
        {columns.find((col) => !col.accessor)?.customRender(null, withdrawal)}
      </div>
    </CardContent>
  </Card>
);

export default function WithdrawalHistoryTable() {
  const {
    withdrawals,
    loading,
    page,
    setPage,
    totalPages,
    getWithdrawals,
    totalCount,
    totalCountPaid,
    totalCountPending,
    totalCountFailed,
    acceptedWithdrawalOrder,
    rejectedWithdrawalOrder,
    deleteWithdrawalOrder,
  } = useWithdrawalsStore();

  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleActionWithNote = async () => {
    if (!selectedWithdrawal || !actionType) return;

    try {
      const payload = {
        id: selectedWithdrawal.id,
        admin_notes: adminNotes || "لا توجد ملاحظات",
      };

      if (actionType === "accept") {
        await acceptedWithdrawalOrder(payload);
      } else {
        await rejectedWithdrawalOrder(payload);
      }

      await getWithdrawals();
      setIsDialogOpen(false);
      setAdminNotes("");
    } catch (error) {
      console.error("فشل تنفيذ الإجراء:", error);
    }
  };

  const columns = [
    {
      header: "الطالب",
      accessor: "account_name",
      label: "الطالب",
      customRender: (name) => name || "طالب غير معروف",
    },
    {
      header: "البنك",
      accessor: "bank_name",
      label: "البنك",
      customRender: (bank) => bank || "غير محدد",
    },
    {
      header: "IBAN",
      accessor: "iban",
      label: "IBAN",
      customRender: (iban) => iban || "غير متوفر",
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
      customRender: (date) =>
        new Date(date).toLocaleDateString("ar-EG") || "غير محدد",
    },
    {
      header: "الحالة",
      accessor: "status",
      label: "الحالة",
      customRender: (status) => (
        <Badge variant={statusVariantMap[status] || "default"}>
          {statusLabelMap[status] || status}
        </Badge>
      ),
    },
    {
      header: "ملاحظات",
      accessor: "admin_notes",
      label: "ملاحظات",
      customRender: (notes) => notes || "لا توجد ملاحظات",
    },
    {
      header: "الإجراءات",
      customRender: (_, withdrawal) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 shadow-lg">
            {withdrawal?.status === "accepted" && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWithdrawal(withdrawal);
                  setActionType("reject");
                  setIsDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <CheckCircle className="size-4 mr-2 text-green-800" />
                اكمال العمليه
              </DropdownMenuItem>
            )}
            {withdrawal?.status !== "accepted" && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWithdrawal(withdrawal);
                  setActionType("accept");
                  setIsDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <Check className="h-4 w-4 mr-2 text-green-600" />
                قبول الطلب
              </DropdownMenuItem>
            )}
            {withdrawal?.status !== "rejected" && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWithdrawal(withdrawal);
                  setActionType("reject");
                  setIsDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <X className="h-4 w-4 mr-2 text-red-600" />
                رفض الطلب
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => deleteWithdrawalOrder({ id: withdrawal.id })}
              className="cursor-pointer text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              حذف الطلب
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>سجل طلبات السحب | لوحة التحكم</title>
        <meta name="description" content="إدارة وتتبع جميع طلبات سحب الأرباح" />
      </Head>

      <div className="space-y-6 animate-fade-in">
        <div className="flex gap-4 flex-wrap">
          <WithdrawalStatsCard title="مجموع الطلبات" value={totalCount} />
          <WithdrawalStatsCard title="إجمالي المدفوع" value={totalCountPaid} />
          <WithdrawalStatsCard
            title="إجمالي المرفوض"
            value={totalCountFailed}
          />
          <WithdrawalStatsCard
            title="طلبات قيد الانتظار"
            value={totalCountPending}
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === "accept" ? "قبول طلب السحب" : "رفض طلب السحب"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "accept"
                  ? "يرجى إضافة ملاحظات قبل قبول الطلب"
                  : "يرجى توضيح سبب الرفض"}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="أدخل ملاحظاتك هنا..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="min-h-[120px]"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleActionWithNote}
                variant={actionType === "accept" ? "default" : "destructive"}
              >
                {actionType === "accept" ? "تأكيد القبول" : "تأكيد الرفض"}
                {loading && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">سجل طلبات السحب</CardTitle>
            <CardDescription>عرض وإدارة جميع طلبات السحب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="md:hidden space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-muted/30">
                    <CardContent className="p-4 space-y-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </CardContent>
                  </Card>
                ))
              ) : withdrawals?.length ? (
                withdrawals.map((withdrawal) => (
                  <MobileWithdrawalCard
                    key={withdrawal.id}
                    withdrawal={withdrawal}
                    columns={columns}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد سحوبات لعرضها
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.header} className="text-right">
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {columns.map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : withdrawals?.length ? (
                    withdrawals.map((withdrawal) => (
                      <TableRow
                        key={withdrawal.id}
                        className="hover:bg-muted/50"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${withdrawal.id}-${column.header}`}
                            className="text-right"
                          >
                            {column.customRender
                              ? column.customRender(
                                  withdrawal[column.accessor],
                                  withdrawal
                                )
                              : withdrawal[column.accessor] || "غير محدد"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-8"
                      >
                        لا توجد سحوبات لعرضها
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1 || loading}
                  onClick={() => {
                    setPage(page - 1);
                    getWithdrawals();
                  }}
                >
                  السابق
                </Button>
                <div className="flex items-center px-4">
                  <span className="text-sm">
                    صفحة {page} من {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  disabled={page === totalPages || loading}
                  onClick={() => {
                    setPage(page + 1);
                    getWithdrawals();
                  }}
                >
                  التالي
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
