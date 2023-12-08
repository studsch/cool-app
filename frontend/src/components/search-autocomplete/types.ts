interface Base<T> {
  category: T;
  name: string;
}

export interface Fruit extends Base<"fruit"> {
  imgUrl: string;
  type: string;
}

export interface Vegetable extends Base<"vegetable"> {
  imgUrl: string;
}

export interface Dairy extends Base<"dairy"> {
  imgUrl: string;
}

export interface Meat extends Base<"meat"> {
  type: string;
}

export interface PetCare extends Base<"petCare"> {
  type: string;
}
