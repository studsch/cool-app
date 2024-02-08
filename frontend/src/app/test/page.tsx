import { AutoComplete } from "@/components/combobox/combobox";
import SearchAutoComplete from "@/components/search-autocomplete/SearchAutoComplete";
import SearchInput from "@/components/search-input/search-input";
import { Select } from "@/components/ui/select";
import Slider from "@/components/ui/sliders/Slider";
import data from "@/test_data/slider/slider"; // тестовые данные для тестирования слайдера
import RecentAvatarBlock from "@/components/avatarblock/recent-avatar-block";

export default function page() {
  return (
    <div className=" justify-between">
      {/* <SearchAutoComplete />
      <AutoComplete options={[]} emptyMessage={"Smt not found"} /> */}
      <Slider data={data} errMsg="No data"></Slider>
      <RecentAvatarBlock></RecentAvatarBlock>
    </div>
  );
}
