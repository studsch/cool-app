import { AutoComplete } from "@/components/combobox/combobox";
import SearchAutoComplete from "@/components/search-autocomplete/SearchAutoComplete";
import SearchInput from "@/components/search-input/search-input";
import { Select } from "@/components/ui/select";
import Slider from "@/components/ui/sliders/Slider";
import { Recent } from "@/components/recent/recent";
// import data from "@/test_data/slider/slider"; // тестовые данные для тестирования слайдера
// import users from "@/test_data/recent/users"; // для тестирования , слайдера и автаров

export default function page() {
  return (
    <div className=" justify-between">
      {/* <SearchAutoComplete />
      <AutoComplete options={[]} emptyMessage={"Smt not found"} /> */}
      <Recent></Recent>
    </div>
  );
}
