"use client";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import formatTime from "@/config/formateTime";
import GetSingleStudentDialog from "./GetSingleStudentDialog";
import Head from "next/head";

export default function StudentsContent() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllUsers, loading, error, deleteUserById, searchAboutUser } =
    useAuthStore();
  const [showUser, setShowUser] = useState(false);
  const [selectUser, setSelectUser] = useState(null);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchMode(false);
      fetchUsers(currentPage);
    } else {
      setSearchMode(true);
      handleSearch(searchQuery, currentPage);
    }
  }, [currentPage, searchQuery]);

  const fetchUsers = async (page) => {
    const result = await getAllUsers(page, itemsPerPage);
    if (result) {
      setUsers(result.data);
      setTotalItems(result.totalItems);
    }
  };

  const handleSearch = async (query, page = 1) => {
    if (query.trim() === "") {
      setSearchMode(false);
      fetchUsers(page);
      return;
    }

    const result = await searchAboutUser({ query, page, itemsPerPage });
    if (result) {
      setUsers(result.data);
      setTotalItems(result.totalItems);
      setCurrentPage(page);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const columns = [
    { header: "الطالب", accessor: "full_name", label: "الطالب" },
    {
      header: "البريد الإلكتروني",
      accessor: "email",
      label: "البريد الإلكتروني",
    },
    {
      header: "تاريخ الانضمام",
      accessor: "created_at",
      label: "تاريخ الانضمام",
      customRender: (date) => formatTime(date),
    },
    {
      header: "الإجراءات",
      customRender: (item) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowUser(true);
              setSelectUser(item);
            }}
            title="عرض التفاصيل"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => deleteUserById({ id: item.id })}
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>إدارة الطلاب | لوحة التحكم</title>
      </Head>

      <div className="space-y-6 animate-fade-in">
        <SectionHeader title="الطلاب" description="إدارة قاعدة الطلاب" />

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-semibold">الطلاب</CardTitle>
                <CardDescription>
                  {searchMode ? "نتائج البحث" : "جميع الطلاب المسجلين"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="البحث عن الطلاب بالاسم..."
                  className="px-3 py-2 border rounded-md text-sm w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    const timer = setTimeout(() => handleSearch(query, 1), 500);
                    return () => clearTimeout(timer);
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="block md:hidden">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <Card className="mb-4">
                  <CardContent className="pt-4 text-center text-red-500">
                    {error}
                  </CardContent>
                </Card>
              ) : users?.length === 0 ? (
                <Card className="mb-4">
                  <CardContent className="pt-4 text-center">
                    {searchMode
                      ? "لا توجد نتائج مطابقة للبحث"
                      : "لا توجد بيانات طلاب لعرضها"}
                  </CardContent>
                </Card>
              ) : (
                users?.map((user, index) => (
                  <Card
                    key={user.id}
                    className="mb-4 border-muted/30 animate-slide-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {columns
                          .filter((col) => col.accessor)
                          .map((column, colIndex) => (
                            <div
                              key={colIndex}
                              className="flex justify-between"
                            >
                              <span className="font-medium text-right">
                                {column.label}:
                              </span>
                              <span className="text-muted-foreground text-right">
                                {column.customRender
                                  ? column.customRender(user[column.accessor])
                                  : user[column.accessor] || "N/A"}
                              </span>
                            </div>
                          ))}
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowUser(true);
                              setSelectUser(user);
                            }}
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteUserById({ id: user.id })}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                    {columns.map((column, index) => (
                      <TableHead
                        key={index}
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
                      <TableRow key={index}>
                        {columns.map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center text-red-500 py-4"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : users?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-4"
                      >
                        {searchMode
                          ? "لا توجد نتائج مطابقة للبحث"
                          : "لا توجد بيانات طلاب لعرضها"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-muted/30 hover:bg-muted/30 transition-colors animate-slide-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {columns.map((column, colIndex) => (
                          <TableCell key={colIndex} className="text-right">
                            {column.customRender
                              ? column.customRender(
                                  user[column.accessor] || user
                                )
                              : user[column.accessor] || "N/A"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    `عرض ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      totalItems
                    )} من ${totalItems} طالب`
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {loading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      `الصفحة ${currentPage} من ${totalPages}`
                    )}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showUser && (
        <GetSingleStudentDialog
          setShowUser={setShowUser}
          showUser={showUser}
          selectUser={selectUser}
          setSelectUser={setSelectUser}
        />
      )}
    </>
  );
}
