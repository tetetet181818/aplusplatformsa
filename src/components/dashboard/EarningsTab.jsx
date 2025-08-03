"use client";
import { useState, useEffect, useCallback } from "react";
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

import WithdrawalForm from "./WithdrawalForm";
import { useWithdrawalsStore } from "../../stores/useWithdrawalsStore";
import MyImage from "../LazyLoadingImage";

const MAX_WITHDRAWALS_PER_MONTH = import.meta.env
  .VITE_MAX_WITHDRAWALS_PER_MONTH;
const PLATFORM_FEE_PERCENTAGE = import.meta.env.VITE_PLATFORM_FEE_PERCENTAGE;

const EarningsTab = ({ currentUser, getSellerNotes }) => {
  const { toast } = useToast();
  const [availableBalance, setAvailableBalance] = useState(0);
  useEffect(() => {
    setAvailableBalance(currentUser?.balance);
  }, [setAvailableBalance]);
  const [sellerStats, setSellerStats] = useState();

  const [totalGrossSales, setTotalGrossSales] = useState(0);

  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  useEffect(() => {
    setWithdrawalAmount(availableBalance - totalGrossSales);
  }, []);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const { createWithdrawalOrder, loading } = useWithdrawalsStore(
    (state) => state
  );
  function calculateTransaction(availableBalance) {
    const earning = availableBalance * 0.15;
    setTotalGrossSales(earning);
  }

  useEffect(() => {
    calculateTransaction(availableBalance);
  }, [calculateTransaction]);

  const formik = useFormik({
    initialValues: {
      accountHolderName: "",
      bankName: "",
      iban: "",
      withdrawalAmount: "",
    },
    validationSchema: Yup.object().shape({
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
        .test(
          Yup.ref(`${withdrawalAmount}`),
          "لا يمكنك سحب مبلغ أكبر من رصيدك المتاح",
          function (value) {
            return value <= availableBalance;
          }
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      let res = await createWithdrawalOrder({ id: currentUser?.id, ...values });
      if (res) {
        resetForm();
      }
    },
  });

  useEffect(() => {
    const fetchSellerStats = async () => {
      if (currentUser?.id) {
        try {
          const userNotes = await getSellerNotes({ sellerId: currentUser.id });
          setSellerStats(userNotes);
        } catch (error) {
          console.error("Error calculating seller stats:", error);
        }
      }
    };

    fetchSellerStats();
  }, [currentUser?.id, getSellerNotes]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const platformFee = useCallback((balance) => {
    return balance * PLATFORM_FEE_PERCENTAGE;
  }, []);

  const netEarnings = useCallback(
    (balance) => balance - platformFee(balance),
    [platformFee]
  );
  const currentNetEarnings = netEarnings(availableBalance);
  const calcTotalPrice = (price, downloads) => {
    return price * downloads;
  };
  console.log(currentUser);
  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={cardVariants}>
        <Card className="shadow-xl border-transparent bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-7 w-7" />
              الرصيد المتاح للسحب
            </CardTitle>
            <CardDescription className="text-green-100">
              هذا هو المبلغ الذي يمكنك سحبه حاليًا.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold tracking-tight">
              {availableBalance?.toFixed(2)}{" "}
              <span className="text-2xl font-normal">ريال</span>
            </p>
            <p className="text-sm text-green-200 mt-1">
              يتم احتساب الرصيد بعد خصم رسوم المنصة (15%).
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="shadow-lg border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              ملخص المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300">
                إجمالي المبيعات:
              </p>
              <p className="font-bold text-lg text-green-600 dark:text-green-400">
                {availableBalance?.toFixed(2)} ريال
              </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-200 font-semibold">
                صافي الأرباح (الرصيد المتاح):
              </p>
              <p className="font-bold text-xl text-primary dark:text-primary-light">
                {availableBalance.toFixed(2)} ريال
              </p>
            </div>
            {sellerStats?.length > 0 && (
              <Accordion type="single" collapsible className="w-full pt-3">
                <AccordionItem value="sales-details">
                  <AccordionTrigger className="text-sm text-primary hover:no-underline font-medium">
                    <div className="flex items-center gap-1">
                      تفاصيل مبيعات الملخصات
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <ScrollArea className="h-[300px] pr-3">
                      <div className="space-y-4">
                        {sellerStats.map((note) => (
                          <div
                            key={note.id}
                            className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 hover:shadow-sm transition-shadow"
                          >
                            <MyImage
                              alt={note.title}
                              src={note.cover_url}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                            <div className="flex-grow">
                              <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                                {note.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                السعر: {note.price.toFixed(2)} ريال | المبيعات:{" "}
                                {/* {note.salesCount} */}
                                {note?.downloads}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm text-green-600 dark:text-green-400">
                                {calcTotalPrice(
                                  note.price,
                                  note.downloads
                                )?.toFixed(2)}{" "}
                                ريال
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                إجمالي من هذا الملخص
                              </p>
                            </div>
                          </div>
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
        {currentUser.withdrawal_times !== 0 && (
          <WithdrawalForm
            formik={formik}
            isProcessingWithdrawal={isProcessingWithdrawal}
            netEarnings={currentNetEarnings}
            remainingWithdrawals={true}
            maxWithdrawalsPerMonth={2}
            loading={loading}
          />
        )}
        {currentUser.withdrawal_times === 0 && (
          <div className="text-center border rounded-lg py-10 font-semibold text-red-700">
            <h1>عفوا لقد استهلكت كل محاولات الاسترداد هذا الشهر</h1>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EarningsTab;
