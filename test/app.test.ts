import { bannedPerson, luckyPerson } from "../src/data";
import { acceptData, dataTest, filterPerson } from "../src/test";
import { it, describe, expect } from "bun:test";

describe("Testing pesen makanan diwarung gw", () => {
  it("Harus menghasilkan true", () => {
    const data = {
      ...dataTest,
    };
    const testData = acceptData(data);
    expect(Boolean(testData)).toBe(true);
  });
  it("Harus menghasilkan data bahwa orang itu beruntung dan mendapatkan diskon 5%", () => {
    const data = {
      ...dataTest,
      namePersonTest: "farras",
    };
    const testData = filterPerson(
      bannedPerson,
      luckyPerson,
      data.namePersonTest,
      true
    );
    expect(testData.isLuckyPerson).toBe(true);
  });
  it("Harus menghasilkan data bahwa orang itu dilarang masuk di toko alias dibanned", () => {
    const data = {
      ...dataTest,
      namePersonTest: "jamal",
    };
    
    expect(() => filterPerson(
        bannedPerson,
        luckyPerson,
        data.namePersonTest,
        true
      )).toThrow("Lu Di Ban dari sini boss!!! \nsilahkan pergi dari sini sekarang!!!");
  });
  
});

// export const dataTest = {
//     menu,
//     bannedPerson,
//     luckyPerson,
//     namePersonTest: userTesting.namePersonTest,
//     isEatThereTest: userTesting.isEatThereTest,
//     promptOrderFoods: userTesting.promptOrderFoods,
//     isOrderDrink: userTesting.isOrderDrink,
//     promptOrderDrink: userTesting.promptOrderDrink,
//     isUserPay: userTesting.isUserPay
//   };
