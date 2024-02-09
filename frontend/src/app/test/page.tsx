import { AutoComplete } from "@/components/combobox/combobox";
import SearchAutoComplete from "@/components/search-autocomplete/SearchAutoComplete";
import SearchInput from "@/components/search-input/search-input";
import DragAndDrop from "@/components/ui/dragdroppreview";
import DragDropPreview from "@/components/ui/dragdroppreview";
import { Select } from "@/components/ui/select";
<<<<<<< HEAD
import Slide from "@/components/ui/slider";

export default function page() {
  return (
    <div>
      <DragDropPreview />
    </div>
=======
import Slider from "@/components/ui/sliders/Slider";
import { Recent } from "@/components/recent/recent";
import MutualFriends from "@/components/mutual-friends/mutual-friends";
// import data from "@/test_data/slider/slider"; // тестовые данные для тестирования слайдера
// import users from "@/test_data/recent/users"; // для тестирования , слайдера и автаров
import users from "@/test_data/people/users"; // для теста общих друзей

export default function page() {
  return (
    <>
      <div className=" justify-between">
        {/* <SearchAutoComplete />
      <AutoComplete options={[]} emptyMessage={"Smt not found"} /> */}
        <Recent></Recent>
      </div>
      <MutualFriends data={users} />
    </>
>>>>>>> 96f30a161ec7a9f4444f401ea1c9db50af732655
  );
}
