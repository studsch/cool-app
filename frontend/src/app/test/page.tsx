import { AutoComplete } from "@/components/combobox/combobox";
import SearchAutoComplete from "@/components/search-autocomplete/SearchAutoComplete";
import SearchInput from "@/components/search-input/search-input";
import { Select } from "@/components/ui/select";

export default function page() {
  return (
    <div className="flex justify-between">
      <SearchAutoComplete />
      <AutoComplete options={[]} emptyMessage={"Smt not found"} />
    </div>
  );
}
