import menu, { bannedPerson, luckyPerson, userTesting } from "./data.ts";
import iPromise from "./sendTest.ts";

const displayMenu = async (
  name: string,
  dataMenu: MenuPerPart[],
  prompTesting: string
) => {
  console.log(`Silahkan anda pilih menu ${name} dibawah ini
    ID | Nama ${name}      |    Harga   
    ---|-------------------|------------
    ${dataMenu
      .map((cb, i) => {
        const id = String(i + 1).padStart(2);
        const name = cb.name.padEnd(18);
        const price = `Rp ${cb.price.toLocaleString()}`.padStart(10);
        return `${id} | ${name} | ${price}`;
      })
      .join(`\n    `)}
    Ketik id ${name} dan ketik quantity nya untuk memesan dengan format seperti ini
    (id)x(quantity) contohnya 3x3 artinya memesan ${name} dengan id 3 sebanyak 3 buah
    kalau pesan banyak mohon gunakan spasi, sepeti ini ya contohnya 1x4 3x7 2x3

    Silahkan ketik pesanan anda: `);

    console.log('====================================');
    console.log(prompTesting);
    console.log('====================================');

  const forReturn = prompTesting;

  return forReturn;
};

const processOrder = (
  input: string,
  cart: any[],
  name: string,
  dataMenu: MenuPerPart[]
) => {
  const orderParts = input.split(" ");
  orderParts.forEach((cb: string) => {
    if (!cb.includes("x") || cb.split("x").length > 2 || cb.length < 3)
      return console.error("Woi masukkin input yg bener");

    const [id, quantity] = cb.split("x").map(Number);
    if (!dataMenu[id - 1])
      return console.error("woi masukkin data yang bener dong!!!");
    addToCart(cart, name, dataMenu, id, quantity);
  });
};

const addToCart = (
  cart: any,
  name: string,
  dataMenu: MenuPerPart[],
  id: number,
  quantity: number
) => {
  const exitingItem = cart[name].find(
    (cb: {
      name: string;
      id: number;
      quantity: number;
      price: number;
      estimationTime?: number;
    }) => cb.id === id
  );
  if (!Boolean(exitingItem)) {
    cart[name].push({
      ...dataMenu[id - 1],
      id,
      quantity,
    });
  } else exitingItem.quantity += quantity;
};

const orderSomething = async (
  cart: any,
  name: string,
  dataMenu: MenuPerPart[],
  prompTesting: string
) => {
  if (cart[name] === undefined) cart[name] = [];

  const sendMenu = await displayMenu(name, dataMenu, prompTesting);
  processOrder(String(sendMenu), cart, name, dataMenu);

  return await willYouFillAgain(
    cart,
    name,
    dataMenu,
    orderSomething,
    prompTesting
  );
};

const willYouFillAgain = async (
  cart: any,
  name: string,
  dataMenu: MenuPerPart[],
  whichOrder: (
    cart: any,
    name: string,
    dataMenu: MenuPerPart[],
    prompTesting: string
  ) => void,
  prompTesting: string
) => {
  console.log(`Apakah Anda mau pesan ${name} lagi?`);
  const yourAnswer = false;
  console.log('====================================');
  console.log(yourAnswer ? "yes" : "no");
  console.log('====================================');
  if (yourAnswer) {
    whichOrder(cart, name, dataMenu, prompTesting);
  } else return false;
};

export const filterPerson =  (
  bannedPerson: FilterPerson,
  luckyPerson: FilterPerson,
  nameUser: string,
  isEatHereTest: boolean
) => {
  console.log("Silahkan isi nama anda : ");
  console.log('====================================');
  console.log(nameUser);
  console.log('====================================');
  const user = nameUser;
  const isBlockedPerson = bannedPerson.data.some(
    (name) => name.toLowerCase() === String(user).toLowerCase()
  );
  if (isBlockedPerson) {
    throw new Error(
      "Lu Di Ban dari sini boss!!! \nsilahkan pergi dari sini sekarang!!!"
    );
  }
  const isLuckyPerson = luckyPerson.data.some(
    (name) => name.toLowerCase() === String(user).toLowerCase()
  );
  if (isLuckyPerson) {
    console.log(
      "Selamat kamu adalah orang yang beruntung!!! \nKamu mendapatkan potongan 5% tiap pesanan \nsilahkan makan disini dan nikmati promo khusus kamu!!!"
    );
  }
  console.log("Apakah anda mau makan disini?");
  console.log('====================================');
  console.log(isEatHereTest ? "yes" : "no");
  console.log('====================================');
  const isEatHere = isEatHereTest;
  return {
    name: user,
    isLuckyPerson,
    isEatHere,
  };
};

export const acceptData = async (dummyData: {
  menu: Menu;
  bannedPerson: FilterPerson;
  luckyPerson: FilterPerson;
  namePersonTest: string;
  isEatThereTest: boolean;
  promptOrderFoods: string;
  isOrderDrink: boolean;
  promptOrderDrink: string;
  isUserPay: boolean
}) => {
  try {
    console.log("Selamat Datang di Kedai Cermat");

    //var
    const pesanan = {};

    // Filter orang dlu
    const dataUser = filterPerson(
      dummyData.bannedPerson,
      dummyData.luckyPerson,
      dummyData.namePersonTest,
      dummyData.isEatThereTest
    );

    //Pesan Menu
    await orderSomething(
      pesanan,
      "Makanan",
      dummyData.menu.makanan.data,
      dummyData.promptOrderFoods
    );
    console.log("Want order drinks?");
    console.log('====================================');
    console.log(dummyData.isOrderDrink ? "yes" : "no");
    console.log('====================================');
    const wantOrderDrinks = dummyData.isOrderDrink;
    if (wantOrderDrinks)
      await orderSomething(
        pesanan,
        "Minuman",
        dummyData.menu.minuman.data,
        dummyData.promptOrderDrink
      );

    //Totalin Harga

    //Kumpulin data
    const data = {
      user: {
        name: String(dataUser.name),
        isEatHere: Boolean(dataUser.isEatHere),
        isLuckyPerson: dataUser.isLuckyPerson,
      },
      pesanan,
      isUserPay: dummyData.isUserPay
    };

    //proses pesanan

    const send = await iPromise(data);
    return send
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error :", error.message);
    } else {
      console.error(`Duh.., Maaf banget ada yang error di website layanan kami,
        Pesan ini akan kami sampaikan kepada tim pengembang aplikasi kami.
        `);
    }
  } finally {
    console.log(
      "Terimakasih Telah Meggunakan Layanan kami, mohon beri kami Feedback untuk meningkatkan kualitas layanan kami terimakasih :)"
    );
  }
};

export const dataTest = {
  menu,
  bannedPerson,
  luckyPerson,
  namePersonTest: userTesting.namePersonTest,
  isEatThereTest: userTesting.isEatThereTest,
  promptOrderFoods: userTesting.promptOrderFoods,
  isOrderDrink: userTesting.isOrderDrink,
  promptOrderDrink: userTesting.promptOrderDrink,
  isUserPay: userTesting.isUserPay
};

acceptData(dataTest);


