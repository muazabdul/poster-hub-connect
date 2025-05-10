
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Input
        type="search"
        placeholder="Search posters..."
        className="pl-10 pr-12"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-brand-purple hover:bg-brand-light/50 hover:text-brand-deepPurple"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
