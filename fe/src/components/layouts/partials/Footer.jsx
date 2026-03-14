import { Link } from "react-router";
import { HiOutlineLocationMarker } from "react-icons/hi";

function Footer() {
  const fiturLinks = [
    { label: "Kolaborator", path: "/kolaborator" },
    { label: "Aset Sampah", path: "/aset" },
    { label: "Laporan Sampah", path: "/laporan" },
    { label: "Barang Daur Ulang", path: "/barang-bekas" },
  ];

  return (
    <footer className="relative z-10 w-full bg-transparent px-4 py-5 transition-colors duration-200 md:px-10">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-(--dark-soft)">
        {/* Main Footer Content */}
        <div className="w-full max-w-6xl px-6 pt-8 pb-8 md:px-12 md:pt-10 md:pb-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            {/* Brand Column */}
            <div className="flex flex-col gap-5 lg:w-[40%]">
              <div className="flex items-center gap-2 border-y border-white/10 py-2">
                <img
                  src="/images/logo-fill.png"
                  alt="logo"
                  className="h-[50px] w-[50px]"
                />
                <p className="flex flex-col text-[1.25rem] leading-none font-bold text-white">
                  <span>TORANG</span>
                  <span>BERSIH</span>
                </p>
              </div>
              <p className="max-w-sm text-sm leading-6 text-(--gray-light)">
                Satu platform untuk menghubungkan warga, komunitas, dan
                pemerintah dalam menjaga lingkungan Sulawesi Utara dari ancaman
                sampah.
              </p>
              <div className="flex items-start gap-2 text-sm text-(--gray-light)">
                <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-base" />
                <span>Sulawesi Utara, Indonesia</span>
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Fitur */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold tracking-wide text-white uppercase">
                  Fitur
                </h4>
                <ul className="flex flex-col gap-3">
                  {fiturLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-sm text-(--gray-light) transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tentang Platform */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold tracking-wide text-white uppercase">
                  Tentang Platform
                </h4>
                <p className="text-sm leading-6 text-(--gray-light)">
                  Torang Bersih adalah inisiatif digital yang bertujuan untuk
                  menciptakan Sulawesi Utara yang lebih bersih melalui
                  kolaborasi masyarakat, komunitas, dan pemerintah daerah.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 px-6 py-5 md:px-12">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <p className="text-xs text-(--gray-muted)">
              &copy; {new Date().getFullYear()} Lasalle Vibers. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
