import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AddNotePageHeader = ({ onBack }) => (
  <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <Button
      variant="ghost"
      className="mb-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
      onClick={onBack}
    >
      <ArrowLeft className="ml-2 h-4 w-4" /> العودة
    </Button>
    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white">
      إضافة ملخص جديد
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2 text-md sm:text-lg">
      شارك معرفتك وساعد زملائك بإضافة ملخص جديد للبيع على المنصة.
    </p>
  </div>
);

export default AddNotePageHeader;
