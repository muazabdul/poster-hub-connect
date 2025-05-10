
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full border hover:text-brand-purple hover:bg-brand-light/50",
            selectedCategory === null ? "bg-brand-light text-brand-purple border-brand-purple" : "border-transparent"
          )}
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full border hover:text-brand-purple hover:bg-brand-light/50",
              selectedCategory === category.id ? "bg-brand-light text-brand-purple border-brand-purple" : "border-transparent"
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;
