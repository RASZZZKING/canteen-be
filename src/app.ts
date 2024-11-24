import menu, { bannedPerson, luckyPerson } from "./data.ts";
import iPromise from "./send.ts";
import readline from "readline";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestions = (query: string) => {
  return new Promise((resolve) => rl.question(query, resolve));
};
export const askYesNo = (question: string) => {
  return new Promise((resolve)=>{
    rl.question(`${question} (Yes/No) :`, (answer) => {
      const lowerAnswer = answer.trim().toLowerCase();
      if (lowerAnswer === "yes" || lowerAnswer === "y") {
        resolve(true);
      } else if (lowerAnswer === "no" || lowerAnswer === "n") {
        resolve(false);
      } else {
        console.error("Input tidak valid, silahkan masukkan 'y' atau 'n'");
        resolve(askYesNo(question));
      }
    });
  })
};

const displayMenu = async (name: string, dataMenu: MenuPerPart[]) => {
  const forReturn =
    await askQuestions(`Silahkan anda pilih menu ${name} dibawah ini
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

  return forReturn;
};

const processOrder = (input: string, cart: any[], name: string, dataMenu: MenuPerPart[]) => {
  const orderParts = input.split(" ");
  orderParts.forEach((cb: string) => {
    if(!cb.includes("x") || cb.split("x").length > 2 || cb.length < 3) return console.error("Woi masukkin input yg bener")
    
    const [id, quantity] = cb.split("x").map(Number);
    if (!dataMenu[id - 1]) return console.error("woi masukkin data yang bener dong!!!");
    addToCart(cart, name, dataMenu, id, quantity);
  });
};

const addToCart = (cart: any, name: string, dataMenu: MenuPerPart[], id: number, quantity: number) => {
  const exitingItem = cart[name].find((cb: {
    name: string
    id: number
    quantity: number
    price: number
    estimationTime?: number 
  }) => cb.id === id);
  if (!Boolean(exitingItem)) {
    cart[name].push({
      ...dataMenu[id - 1],
      id,
      quantity,
    });
  } else exitingItem.quantity += quantity;
};

const orderSomething = async (cart: any, name: string, dataMenu: MenuPerPart[]) => {
  if (cart[name] === undefined) cart[name] = [];

  const sendMenu = await displayMenu(name, dataMenu);
  processOrder(String(sendMenu), cart, name, dataMenu);

  return await willYouFillAgain(cart, name, dataMenu, orderSomething);
};

const willYouFillAgain = async (cart: any, name: string, dataMenu: MenuPerPart[], whichOrder: (cart: any, name: string, dataMenu: MenuPerPart[])=>void) => {
  const yourAnswer = await askYesNo(`Apakah Anda mau pesan ${name} lagi?`);
  if (yourAnswer) {
    await whichOrder(cart, name, dataMenu);
  } else return false;
};

const filterPerson = async (bannedPerson: FilterPerson, luckyPerson: FilterPerson) => {
  const user = await askQuestions("Silahkan isi nama anda : ");
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
  const isEatHere = await askYesNo("Apakah anda mau makan disini?")
  return {
    name: user,
    isLuckyPerson,
    isEatHere
  };
};


const acceptData = async (dummyData: {
  menu: Menu
  bannedPerson: FilterPerson,
  luckyPerson: FilterPerson,
}) => {
  try {
    console.log("Selamat Datang di Kedai Cermat");

    //var
    const pesanan = {};

    // Filter orang dlu
    const dataUser = await filterPerson(
      dummyData.bannedPerson,
      dummyData.luckyPerson
    );


    //Pesan Menu
    await orderSomething(pesanan, "Makanan", dummyData.menu.makanan.data);
    const wantOrderDrinks = await askYesNo("Want order drinks?");
    if (wantOrderDrinks)
      await orderSomething(pesanan, "Minuman", dummyData.menu.minuman.data);

    //Totalin Harga

    
    //Kumpulin data
    const data = {
      user: {
        name: String(dataUser.name),
        isEatHere: Boolean(dataUser.isEatHere),
        isLuckyPerson: dataUser.isLuckyPerson
      },
      pesanan,
    };

    //proses pesanan
    
    const send = await iPromise(data);
    send
  } catch (error: unknown) {
    if(error instanceof Error){
      console.error("Error :", error.message);
    }else{
      console.error(`Duh.., Maaf banget ada yang error di website layanan kami,
        Pesan ini akan kami sampaikan kepada tim pengembang aplikasi kami.
        `);
    }
  } finally {
    console.log(
      "Terimakasih Telah Meggunakan Layanan kami, mohon beri kami Feedback untuk meningkatkan kualitas layanan kami terimakasih :)"
    );
    rl.close();
  }
};

acceptData({
  menu,
  bannedPerson,
  luckyPerson,
});
