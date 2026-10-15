import React from 'react';

interface KopSuratProps {
  className?: string;
  showLogo?: boolean;
}

export default function KopSurat({ className = '', showLogo = true }: KopSuratProps) {
  return (
    <div className={`w-full pb-3 mb-5 border-b-[2.5px] border-black text-black ${className}`}>
      <div className="flex items-center justify-start gap-4">
        {showLogo && (
          <img
            src="/images/logo-bps.svg"
            alt="Logo BPS"
            className="h-[68px] w-auto object-contain flex-shrink-0"
          />
        )}
        <div className="text-left leading-tight">
          {/* Tulisan Tahoma, Bold & Miring (Italic) sesuai instruksi dan Gambar 4 */}
          <div
            style={{
              fontFamily: 'Tahoma, Arial, sans-serif',
              fontSize: '14pt',
              fontWeight: 'bold',
              fontStyle: 'italic',
              lineHeight: 1.18,
            }}
            className="tracking-normal uppercase text-black"
          >
            <div>BADAN PUSAT STATISTIK</div>
            <div>KABUPATEN OGAN KOMERING ULU SELATAN</div>
          </div>

          {/* Tulisan Arial alamat dan kontak */}
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '8.5pt',
              lineHeight: 1.35,
            }}
            className="text-gray-800 mt-1"
          >
            <div>Jalan raya R.A Kartini KM. 3,5 Kecamatan Buay Rawan</div>
            <div>
              Homepage: http://okuselatankab.bps.go.id &nbsp; E-mail: <span className="text-blue-600 underline">bps1608@bps.go.id</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
