import menu, { bannedPerson, luckyPerson } from "../src/data";
import * as utils from "../src/test";
import { it, describe, expect} from "bun:test";


describe("Testing pesen makanan diwarung gw", () => {
  it("Harus menghasilkan true", () => {
    const data = {
      ...utils.dataTest,
    };
    const testData = utils.acceptData(data);
    expect(Boolean(testData)).toBe(true);
  });
  it("Harus menghasilkan data bahwa orang itu beruntung dan mendapatkan diskon 5%", () => {
    const data = {
      ...utils.dataTest,
      namePersonTest: "farras",
    };
    const testData = utils.filterPerson(
      bannedPerson,
      luckyPerson,
      data.namePersonTest,
      true
    );
    expect(testData.isLuckyPerson).toBe(true);
  });
  it("Harus menghasilkan data bahwa orang itu dilarang masuk di toko alias dibanned", () => {
    const data = {
      ...utils.dataTest,
      namePersonTest: "jamal",
    };

    expect(() =>
      utils.filterPerson(bannedPerson, luckyPerson, data.namePersonTest, true)
    ).toThrow(
      "Lu Di Ban dari sini boss!!! \nsilahkan pergi dari sini sekarang!!!"
    );
  });

});




