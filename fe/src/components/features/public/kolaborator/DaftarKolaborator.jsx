import { useState } from "react";

function DaftarKolaborator() {
  const [kolaborator, setKolaborator] = useState([
    {
      nama: "BSID Kolaborator",
      kategori: "Komunitas",
      lokasi: "Jalan Bukit Dago Utara II",
      penanggungJawab: "Admin BSID",
    },
    {
      nama: "BSID Kolaborator",
      kategori: "Komunitas",
      lokasi: "Jalan Mekarsari, Bekasi Raya",
      penanggungJawab: "Admin BSID",
    },
  ]);
  console.log(setKolaborator);
  return (
    <div className="w-full z-9999 bg-white  px-4 py-8 pt-24 md:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className={`flex justify-between`}>
          <p className="text-3xl font-semibold">Daftar Kolaborator</p>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 rounded-full border border-(--primary) px-10 py-1.5 font-medium text-(--primary) transition-colors hover:bg-indigo-50"
          >
            Kategori
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4 grid grid-cols-12 gap-4 border-b-[3px] border-slate-200 pb-3 text-lg font-bold text-black">
          <div className="col-span-4 pl-8 text-center">Nama</div>
          <div className="col-span-2 text-center">Kategori</div>
          <div className="col-span-3 text-left">Lokasi</div>
          <div className="col-span-3 pr-6 text-center">Penanggung Jawab</div>
        </div>
        {kolaborator.map(({ nama, kategori, lokasi, penanggungJawab }) => {
          return (
            <Kolaborator
              key={nama}
              nama={nama}
              kategori={kategori}
              lokasi={lokasi}
              penanggungJawab={penanggungJawab}
            />
          );
        })}
      </div>
    </div>
  );
}

function Kolaborator({ nama, kategori, lokasi, penanggungJawab }) {
  return (
    <div className="flex h-[84px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="w-[42px] flex-shrink-0 bg-[#22247A]"></div>
      <div className="grid flex-1 grid-cols-12 items-center gap-4 pr-6 pl-5">
        <div className="col-span-4 flex items-center gap-5">
          <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-[#1A3084] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="h-7 w-7"
              viewBox="0 0 24 24"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-[#20257B]">
            {nama}
          </span>
        </div>
        <div className="col-span-2 text-center text-[14px] font-medium text-gray-800">
          {kategori}
        </div>
        <div className="col-span-3 text-left text-[14px] leading-tight font-medium text-gray-800">
          {lokasi}
        </div>
        <div className="col-span-3 flex items-center justify-around pl-6 text-[14px] font-medium text-gray-800">
          <span>{penanggungJawab}</span>
          <button>
            <svg
              width="30"
              height="30"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.125 10C7.95924 10 7.80027 10.0658 7.68306 10.1831C7.56585 10.3003 7.5 10.4592 7.5 10.625V33.125C7.5 33.6223 7.30246 34.0992 6.95083 34.4508C6.59919 34.8025 6.12228 35 5.625 35H1.875C1.37772 35 0.900805 34.8025 0.549175 34.4508C0.197544 34.0992 0 33.6223 0 33.125C0 32.6277 0.197544 32.1508 0.549175 31.7992C0.900805 31.4475 1.37772 31.25 1.875 31.25H3.75V10.625C3.75 8.21 5.71 6.25 8.125 6.25H31.875C34.29 6.25 36.25 8.21 36.25 10.625V31.25H38.125C38.6223 31.25 39.0992 31.4475 39.4508 31.7992C39.8025 32.1508 40 32.6277 40 33.125C40 33.6223 39.8025 34.0992 39.4508 34.4508C39.0992 34.8025 38.6223 35 38.125 35H34.375C33.8777 35 33.4008 34.8025 33.0492 34.4508C32.6975 34.0992 32.5 33.6223 32.5 33.125V10.625C32.5 10.4592 32.4342 10.3003 32.3169 10.1831C32.1997 10.0658 32.0408 10 31.875 10H8.125Z"
                fill="#1E1F78"
              />
              <path
                d="M19.9249 19.925L13.0499 26.8C12.8657 26.9717 12.7179 27.1787 12.6154 27.4087C12.513 27.6387 12.4579 27.8869 12.4534 28.1387C12.449 28.3905 12.4953 28.6405 12.5896 28.874C12.6839 29.1075 12.8243 29.3195 13.0023 29.4976C13.1803 29.6756 13.3924 29.816 13.6259 29.9103C13.8594 30.0046 14.1094 30.0509 14.3612 30.0465C14.613 30.042 14.8612 29.9869 15.0912 29.8845C15.3212 29.782 15.5282 29.6342 15.6999 29.45L22.5749 22.575L26.4324 26.4325C26.5198 26.5201 26.6313 26.5798 26.7527 26.604C26.874 26.6283 26.9999 26.6159 27.1142 26.5685C27.2286 26.5211 27.3263 26.4408 27.3949 26.3378C27.4636 26.2348 27.5001 26.1138 27.4999 25.99V15.625C27.4999 15.4592 27.434 15.3003 27.3168 15.1831C27.1996 15.0658 27.0407 15 26.8749 15H16.5099C16.3861 14.9998 16.2651 15.0363 16.1621 15.105C16.0591 15.1736 15.9788 15.2713 15.9314 15.3857C15.884 15.5 15.8716 15.6259 15.8958 15.7472C15.9201 15.8686 15.9798 15.9801 16.0674 16.0675L19.9249 19.925Z"
                fill="#1E1F78"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DaftarKolaborator;
