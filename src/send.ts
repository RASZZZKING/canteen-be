import { askYesNo, rl } from "./app.ts";

const displayInvoice = async (
  dataMenu: {
    Makanan: {
      name: string;
      id: number;
      quantity: number;
      price: number;
      estimationTime?: number;
    }[];
    Minuman: {
      name: string;
      id: number;
      quantity: number;
      price: number;
      estimationTime?: number;
    }[];
  },
  isLuckyPerson = false
) => {
  if (!dataMenu || Object.keys(dataMenu).length === 0)
    throw new Error("Data pesenan lu kosong buset dah");
  const sumPriceTotal = (
    cart: {
      Makanan: {
        name: string;
        id: number;
        quantity: number;
        price: number;
        estimationTime?: number;
      }[];
      Minuman: {
        name: string;
        id: number;
        quantity: number;
        price: number;
        estimationTime?: number;
      }[];
    },
    isLuckyPerson = false
  ) =>
    Object.values(cart)
      .flat()
      .reduce((arr, item) => arr + item.price * item.quantity, 0);

  console.log(`Silahkan Bayar Pesanan terlebih dahulu, anda sopan kami segan.
    ID | Nama Pesanan      |    Harga   |   Jumlah   |    Total Harga    |
    ---|-------------------|------------|------------|-------------------|
    ${Object.values(dataMenu)
      .flat()
      .map((cb, i) => {
        const id = String(i + 1).padStart(2);
        const name = cb.name.padEnd(17);
        const price = `Rp ${cb.price.toLocaleString()}`.padStart(10);
        const sumPrice = `Rp ${(
          cb.price * cb.quantity
        ).toLocaleString()}`.padStart(4);
        return `${id} | ${name} | ${price} | ${cb.quantity
          .toLocaleString()
          .padStart(10)} | ${`${sumPrice.toLocaleString()}`.padStart(17)} |`;
      })
      .join(`\n    `)}
    ---|-------------------|------------|------------|-------------------|
    ${
      !isLuckyPerson ? "- Total Pembayaran" : `-                 `
    }                                 ${`Rp. ${sumPriceTotal(
    dataMenu,
    isLuckyPerson
  ).toLocaleString()}`.padStart(17)} |
${
  isLuckyPerson
    ? `    - Diskon                                                          5% |
    - Total Pembayaran                                 ${`Rp. ${(
      sumPriceTotal(dataMenu, isLuckyPerson) * 0.95
    ).toLocaleString()}`.padStart(17)} |`
    : ``
}
    ---|-------------------|------------|------------|-------------------|
        `);
  const answer = await askYesNo("Silahkan Bayar");
  if (!answer) throw new Error("Lu kalau mau makan disini bayar dulu bos!!!");
};

const bakingTheMenu = async (dataMenu: {
  Makanan: {
    name: string;
    id: number;
    quantity: number;
    price: number;
    estimationTime?: number;
  }[];
  Minuman: {
    name: string;
    id: number;
    quantity: number;
    price: number;
    estimationTime?: number;
  }[];
}) => {
  return new Promise((resolve, reject) => {
    const sumQuantity = (cart: {
      Makanan: {
        name: string;
        id: number;
        quantity: number;
        price: number;
        estimationTime?: number;
      }[];
      Minuman: {
        name: string;
        id: number;
        quantity: number;
        price: number;
        estimationTime?: number;
      }[];
    }) => {
      return Object.values(cart)
        .flat()
        .reduce((arr, item) => arr + item.quantity, 0);
    };
    const totalQuantity = sumQuantity(dataMenu);
    const dummyBakingProductTime = 60_000;
    const estimationBakingTime = totalQuantity * dummyBakingProductTime;
    const isBakingOkay = true;
    if (totalQuantity !== 0)
      console.log(
        `Menu tersedia, siap dimasak. Estimasi masak ${
          estimationBakingTime / 60_000
        }m`
      );
    else reject("Tolong masukan menu dengan benar");

    setTimeout(() => {
      if (isBakingOkay)
        resolve(
          `Selamat menikmati hidangan!!!, mohon tunggu sebentar pesanan anda siap diantarkan ke meja makan.`
        );
      else reject("Ada Kesalahan dalam memasak");
    }, estimationBakingTime);
  });
};

const deleveryTheOrders = async (isBakingSuccess: boolean) => {
  return new Promise((resolve, reject) => {
    if (!isBakingSuccess) throw new Error("Buset Bro pesenan lu gagal");
    console.log("Menunggu antrian pesanan untuk diantar");
    console.log("Pesanan anda sedang diantar");
    const sendToCustomerOkay = true;
    setTimeout(() => {
      if (sendToCustomerOkay) {
        console.log(
          "Silahkan Nikmati hindangan anda, pesanan sampai dengan selamat."
        );
        resolve(true);
      } else
        reject("Mohon maaf kami ada kendala dalam pengantaran pesanan anda");
    }, 2_000);
  });
};

const cleanTheTable = async (isEatHere: boolean) => {
  if (isEatHere) {
    console.log(
      "Silahkan menikmati makanan anda, rasakan, nikmati, bagikan. \nDan jangan lupakan untuk memberi penilaian pada kualitas dari pelayanan kami."
    );
    setTimeout(() => {
      console.log(
        "Terima kasih telah memberi kesempatan pada kami untuk memberikan pelayanan terbaik kami terhadap anda \nTolong ulas penilaian kami"
      );
      console.log("~~Waiters clean the table");
    }, 50000);
  } else {
    console.log(
      "Terimakasih telah memesan, hati hati di jalan. Semoga selamat samapai tujuan"
    );
  }
};

const iPromise = (data: {
  user: {
    name: string;
    isEatHere: boolean;
    isLuckyPerson: boolean;
  };
  pesanan: any;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await displayInvoice(data.pesanan, data.user.isLuckyPerson);
      const bakingProses = await bakingTheMenu(data.pesanan);
      await deleveryTheOrders(Boolean(bakingProses));
      await cleanTheTable(data.user.isEatHere);
      resolve(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("🚀 ! Error:", error.message);
      } else console.error("🚀 !!!! Invailid Error:", error);

      rl.close();
    }
  });
};

export default iPromise;
