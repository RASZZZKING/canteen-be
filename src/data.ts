const menu: Menu = {
  minuman: {
    data: [
      {
        name: "Thai Tea",
        price: 10_000,
      },
      {
        name: "Lemon Tea",
        price: 6_000,
      },
      {
        name: "Capucino Cincau",
        price: 7_000,
      },
    ],
  },
  makanan: {
    data: [
      {
        name: "Bakso",
        price: 8_000,
      },
      {
        name: "Nasi Uduk",
        price: 6_000,
      },
      {
        name: "Lontong Sayur",
        price: 10_000,
      },
    ],
  },
};

const bannedPerson: FilterPerson = {
    data: [
        "chris",
        "jamal"
    ]
}

const luckyPerson: FilterPerson = {
    data: [
        "farras",
        "sabil"
    ]
}

export default menu;
export {bannedPerson, luckyPerson, userTesting}


const userTesting: TestingApp = {
  namePersonTest: "Farras",
  isEatThereTest: true,
  promptOrderFoods: "2x2 3x3",
  isOrderDrink: true,
  promptOrderDrink: "1x3 2x2",
  isUserPay: true
}