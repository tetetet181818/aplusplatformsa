"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import NoResults from "@/components/shared/NoResults";
import { motion } from "framer-motion";
import { useAuthStore } from "../../stores/useAuthStore";
import MyImage from "../LazyLoadingImage";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const NotesLikedTab = () => {
  const onNavigate = useNavigate();
  const { getNotesLiked, likedListLoading, likedNotes } = useAuthStore(
    (state) => state
  );
  useEffect(() => {
    getNotesLiked();
  }, [getNotesLiked]);
  if (likedNotes?.length === 0) {
    return (
      <NoResults
        icon={<Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
        title="لا توجد ملخصات معجبة"
        message="لم تقم بالإعجاب بأي ملخصات بعد."
        actionButton={
          <Button
            onClick={() => onNavigate("/notes")}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            استكشاف الملخصات
          </Button>
        }
      />
    );
  }
  if (likedListLoading) {
    return <LoadingSpinner message="جاري التحميل..." />;
  }
  return (
    <div className="space-y-6">
      {likedNotes?.map((note) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 lg:w-1/4 aspect-video sm:aspect-auto bg-gray-100 dark:bg-gray-800">
                <MyImage
                  alt={note.title}
                  className="w-full h-full object-cover"
                  src={note.cover_url}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {note.title}
                    </h3>
                    <Badge className="bg-primary text-primary-foreground">
                      {note.price} ريال
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                    {note.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs mb-3">
                    <Badge variant="outline">{note.university}</Badge>
                    <Badge variant="outline">{note.subject}</Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                    التحميلات: {note.downloads || 0} | التقييم:{" "}
                    {note.rating ? note.rating.toFixed(1) : "N/A"}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/notes/${note.id}`)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                      onClick={() => onNavigate(`/notes/${note.id}`)}
                    >
                      <Heart className="h-4 w-4 ml-1" />
                      إزالة الإعجاب
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default NotesLikedTab;
