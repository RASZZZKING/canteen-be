declare interface MenuPerPart {
    name: string;
    price: number;
    estimationTime?: number;
}
declare interface Menu {
  minuman: {
    data: MenuPerPart[]
  };
  makanan: {
    data: MenuPerPart[]
  };
}
declare interface FilterPerson {
    data: string[]
}

declare interface TestingApp {
  namePersonTest: string
  isEatThereTest: boolean
  promptOrderFoods: string
  isOrderDrink: boolean
  promptOrderDrink: string,
  isUserPay: boolean
}