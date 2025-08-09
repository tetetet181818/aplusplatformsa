"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { universityData } from "@/data/universityData";

const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  years = [],
}) => {
  const [availableColleges, setAvailableColleges] = useState([]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extract universities from universityData
  const universities = universityData.map((university) => university.name);

  useEffect(() => {
    const loadColleges = async () => {
      if (!filters.university) {
        setAvailableColleges([]);
        return;
      }

      setIsLoadingColleges(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Find the selected university in universityData
        const selectedUniversity = universityData.find(
          (uni) => uni.name === filters.university
        );

        // Get colleges from the university data or empty array if not found
        const colleges = selectedUniversity?.colleges || [];
        setAvailableColleges(colleges);
      } catch (err) {
        console.error("Error loading colleges:", err);
        setAvailableColleges([]);
      } finally {
        setIsLoadingColleges(false);
      }
    };

    loadColleges();
  }, [filters.university]);

  const renderSelectOptions = (items, placeholder) => {
    if (isLoading || isLoadingColleges) {
      return (
        <SelectItem value="" disabled>
          جاري التحميل...
        </SelectItem>
      );
    }

    if (items.length === 0) {
      return (
        <SelectItem value="" disabled>
          {placeholder}
        </SelectItem>
      );
    }

    return (
      <>
        <SelectItem value="">الكل مش</SelectItem>
        {items?.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </>
    );
  };

  return (
    <Card className="bg-gray-50/50 dark:bg-gray-900/50 border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-semibold">تصفية النتائج</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-destructive"
          disabled={isLoading}
        >
          <X className="h-4 w-4 ml-1" />
          مسح الفلاتر
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">الجامعة</Label>
              <Select
                value={filters.university}
                onValueChange={(value) => onFilterChange("university", value)}
                disabled={isLoading || universities.length === 0}
              >
                <SelectTrigger id="university" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoading
                        ? "جاري التحميل..."
                        : universities.length === 0
                        ? "لا توجد جامعات متاحة"
                        : "اختر الجامعة"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {renderSelectOptions(universities, "لا توجد جامعات متاحة")}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">الكلية</Label>
              <Select
                value={filters.college}
                onValueChange={(value) => onFilterChange("college", value)}
                disabled={
                  isLoading ||
                  isLoadingColleges ||
                  !filters.university ||
                  availableColleges.length === 0
                }
              >
                <SelectTrigger id="college" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingColleges
                        ? "جاري التحميل..."
                        : !filters.university
                        ? "اختر جامعة أولاً"
                        : availableColleges.length === 0
                        ? "لا توجد كليات متاحة"
                        : "اختر الكلية"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {renderSelectOptions(
                    availableColleges,
                    "لا توجد كليات متاحة"
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">السنة</Label>
              <Select
                value={filters.year.toString()}
                onValueChange={(value) => onFilterChange("year", value)}
                disabled={isLoading || years.length === 0}
              >
                <SelectTrigger id="year" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoading
                        ? "جاري التحميل..."
                        : years.length === 0
                        ? "لا توجد سنوات متاحة"
                        : "اختر السنة"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {renderSelectOptions(years, "لا توجد سنوات متاحة")}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
