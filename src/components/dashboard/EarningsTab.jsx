"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, BarChart3, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import WithdrawalForm from "./WithdrawalForm";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";

const PLATFORM_FEE_PERCENTAGE = 0.15;

const EarningsTab = ({ currentUser, getSellerNotes }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [availableBalance, setAvailableBalance] = useState(0);
  const [sellerStats, setSellerStats] = useState([]);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const { createWithdrawalOrder, loading } = useWithdrawalsStore();

  useEffect(() => {
    if (currentUser?.balance) {
      setAvailableBalance(currentUser.balance);
    }
  }, [currentUser]);

  const calculatePlatformFee = useCallback(
    (balance) => balance * PLATFORM_FEE_PERCENTAGE,
    []
  );

  const calculateNetEarnings = useCallback(
    (balance) => balance - calculatePlatformFee(balance),
    [calculatePlatformFee]
  );

  const calculateTotalPrice = (price, downloads) => price * downloads;

  const formik = useFormik({
    initialValues: {
      accountHolderName: "",
      bankName: "",
      iban: "",
      withdrawalAmount: "",
    },
    validationSchema: Yup.object({
      accountHolderName: Yup.string()
        .trim()
        .required("اسم صاحب الحساب مطلوب")
        .matches(
          /^[\u0600-\u06FF\s]{3,}(?:\s[\u0600-\u06FF\s]{3,}){2,}$/,
          "يجب إدخال الاسم ثلاثي"
        ),
      bankName: Yup.string()
        .required("اسم البنك مطلوب")
        .min(3, "اسم البنك يجب أن يكون على الأقل 3 أحرف"),
      iban: Yup.string()
        .trim()
        .required("رقم الحساب (IBAN) مطلوب")
        .matches(
          /^SA[0-9]{22}$/,
          "يجب أن يبدأ رقم الحساب بـ SA ويحتوي على 24 حرفاً"
        ),
      withdrawalAmount: Yup.number()
        .required("مبلغ السحب مطلوب")
        .min(3, "الحد الأدنى للسحب هو 3 ريال")
        .max(availableBalance, "لا يمكنك سحب مبلغ أكبر من رصيدك المتاح"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await createWithdrawalOrder({
          id: currentUser?.id,
          ...values,
        });
        if (res) {
          toast({ title: "تم تقديم طلب السحب بنجاح" });
          resetForm();
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "حدث خطأ",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  useEffect(() => {
    const fetchSellerStats = async () => {
      if (currentUser?.id) {
        try {
          const userNotes = await getSellerNotes({ sellerId: currentUser.id });
          setSellerStats(userNotes || []);
        } catch (error) {
          toast({
            title: "حدث خطأ",
            description: "تعذر تحميل إحصائيات البائع",
            variant: "destructive",
          });
        }
      }
    };

    fetchSellerStats();
  }, [currentUser?.id, getSellerNotes, toast]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const currentNetEarnings = calculateNetEarnings(availableBalance);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={cardVariants} whileHover="hover">
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              الرصيد المتاح للسحب
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              هذا هو المبلغ الذي يمكنك سحبه حاليًا بعد خصم رسوم المنصة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">
              {currentNetEarnings.toFixed(2)}{" "}
              <span className="text-xl font-medium">ريال</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} whileHover="hover">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              ملخص المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  إجمالي المبيعات:
                </p>
                <p className="text-lg font-semibold">
                  {availableBalance.toFixed(2)} ريال
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  رسوم المنصة (15%):
                </p>
                <p className="text-lg font-semibold text-destructive">
                  -{calculatePlatformFee(availableBalance).toFixed(2)} ريال
                </p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <p className="font-medium">صافي الأرباح:</p>
                <p className="text-xl font-bold text-primary">
                  {currentNetEarnings.toFixed(2)} ريال
                </p>
              </div>
            </div>

            {sellerStats.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sales-details">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      تفاصيل مبيعات الملخصات
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-72 pr-3">
                      <div className="space-y-3">
                        {sellerStats.map((note) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm"
                          >
                            <div className="relative h-14 w-14 flex-shrink-0">
                              <Image
                                src={note.cover_url}
                                alt={note.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {note.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {note.downloads} تحميلات |{" "}
                                {note.price.toFixed(2)} ريال
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                {calculateTotalPrice(
                                  note.price,
                                  note.downloads
                                ).toFixed(2)}{" "}
                                ريال
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        {currentUser.withdrawal_times > 0 ? (
          <WithdrawalForm
            formik={formik}
            isProcessingWithdrawal={isProcessingWithdrawal}
            netEarnings={currentNetEarnings}
            remainingWithdrawals={currentUser.withdrawal_times}
            loading={loading}
          />
        ) : (
          <Card className="border-destructive/20 bg-destructive/10">
            <CardContent className="p-6 text-center">
              <p className="font-semibold text-destructive">
                لقد استهلكت كل محاولات السحب المتاحة هذا الشهر
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EarningsTab;
