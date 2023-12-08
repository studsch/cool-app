import { Fruit, Vegetable, Dairy, Meat, PetCare } from "../types";
import { mockFruits } from "./fruits";
import { mockVegetables } from "./vegetables";
import { mockDairy } from "./dairy";
import { mockMeats } from "./meats";
import { mockPetCare } from "./petCare";

export type Item = Fruit | Vegetable | Dairy | Meat | PetCare;

const mockData: Item[] = [
  ...mockFruits,
  ...mockVegetables,
  ...mockDairy,
  ...mockMeats,
  ...mockPetCare,
];

export default mockData;
