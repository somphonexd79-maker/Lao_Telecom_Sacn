import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, QrCode, AlertCircle, Image, ArrowLeft } from 'lucide-react'; // ນຳເຂົ້າ ArrowLeft

export default function QRScanner() {
  const navigate = useNavigate();
  const [scanError, setScanError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const html5QrcodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // ຟັງຊັນຈັດການເມື່ອສະແກນ ຫຼື ຖອດລະຫັດ QR ສຳເລັດ
  const handleScanSuccess = (decodedText) => {
    stopCamera(); // ປິດກ້ອງທันທີ

    // ກວດສອບວ່າເປັນລິ້ງຂອງລະບົບ ຫຼື ບໍ່
    if (decodedText.includes('/rate/')) {
      const path = decodedText.split('/rate/')[1];
      navigate(`/rate/${path}`); // ລິ້ງໄປໜ້າໃຫ້ຄະແນນ ID ນັ້ນທັນທີ
    } else {
      // ຖ້າເປັນຂໍ້ຄວາມທົ່ວໄປ ຫຼື ລະຫັດ ID ກົງໆ
      navigate(`/rate/${decodedText}`);
    }
  };

  // ຟັງຊັນ ເປີດກ້ອງສະແກນ
  const startCamera = async () => {
    setScanError(null);
    try {
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode("reader");
      }
      
      setIsCameraActive(true);
      await html5QrcodeRef.current.start(
        { facingMode: "environment" }, // ໃຊ້ກ້ອງຫຼັງ
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // ລະຫວ່າງສ່ອງກ້ອງ ຖ້າບໍ່ທັນເຈີ QR ມັນຈະເຂົ້າບ່ອນນີ້
          setScanError("ກະລຸນາວາງຄິວອານໂຄ້ດໃຫ້ຢູ່ໃນກອບສີ່ຫຼ່ຽມ");
        }
      );
    } catch (err) {
      console.error("Failed to start camera", err);
      setScanError("ບໍ່ສາມາດເປີດກ້ອງໄດ້ ກະລຸນາກວດສອບການອະນຸຍາດສິດ");
      setIsCameraActive(false);
    }
  };

  // ຟັງຊັນ ປິດກ້ອງ
  const stopCamera = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
        setIsCameraActive(false);
        setScanError(null);
      } catch (err) {
        console.error("Failed to stop camera", err);
      }
    }
  };

  // ຟັງຊັນ ຈັດການການອັບໂຫລດຮູບພາບ QR Code
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanError(null);
    await stopCamera(); // ປິດກ້ອງກ່ອນ (ຖ້າເປີດຢູ່)

    const html5QrCode = new Html5Qrcode("reader");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      handleScanSuccess(decodedText);
    } catch (err) {
      console.error("Error scanning file", err);
      setScanError("ບໍ່ພົບຄິວອານໂຄ້ດໃນຮູບພາບນີ້ ກະລຸນາລອງໃໝ່");
    }
  };

  // ເຄຼຍການເຮັດວຽກເມື່ອອອກຈາກໜ້າ
  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        html5QrcodeRef.current.stop().catch(err => console.error(err));
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 antialiased text-slate-600 font-sans">
      
      {/* ປຸ່ມກົດກັບຄືນໜ້າຈັດການ QR ຢູ່ດ້ານເທິງກ່ອງສະແກນ */}
      <div className="max-w-md w-full mb-3 flex justify-start">
        <button
          type="button"
          onClick={async () => {
            await stopCamera(); // ປິດກ້ອງກ່ອນປ່ຽນໜ້າ
            navigate('/qrcode-manager');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" /> ກັບຄືນໜ້າຈັດການ QR
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 text-center space-y-6">
        
        {/* Icon ດ້ານເທິງ */}
        <div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-1">ສະແກນ QR Code</h1>
          <p className="text-sm text-slate-400">ເລືອກວິທີສະແກນເພື່ອເຂົ້າສູ່ໜ້າໃຫ້ຄະແນນປະຈຳຕົວບຸກຄົນ</p>
        </div>
        
        {/* ກ່ອງສະແດງຜົນຂອງກ້ອງ/ຮູບພາບ */}
        <div className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-900 aspect-square flex flex-col items-center justify-center relative">
          <div id="reader" className="w-full h-full absolute inset-0 z-0"></div>
          
          {/* ຂໍ້ຄວາມສະແດງຕອນທີ່ຍັງບໍ່ທັນເປີດກ້ອງ */}
          {!isCameraActive && (
            <div className="z-10 text-center p-6 space-y-2 pointer-events-none">
              <Camera className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">ກ້ອງຖືກປິດຢູ່ ກົດປຸ່ມດ້ານລຸ່ມເພື່ອເປີດໃຊ້ກ້ອງ</p>
            </div>
          )}
        </div>

        {/* ແຈ້ງເຕືອນ Error */}
        {scanError && (
          <div className="flex items-center gap-2 justify-center text-xs font-semibold text-amber-600 bg-amber-50 py-2.5 px-3 rounded-xl">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            {scanError}
          </div>
        )}

        {/* ປຸ່ມຄວບຄຸມການເຮັດວຽກ */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          
          {/* ປຸ່ມທີ 1: ໃຊ້ກ້ອງ (ເປີດ/ປິດ) */}
          <button
            type="button"
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm ${
              isCameraActive 
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            {isCameraActive ? 'ປິດກ້ອງ' : 'ໃຊ້ກ້ອງສະແກນ'}
          </button>

          {/* ປຸ່ມທີ 2: ເລືອກຮູບພາບ */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition border border-slate-200 shadow-sm"
          >
            <Image className="w-4 h-4" />
            ເລືອກຮູບພາບ
          </button>

          {/* Input ຫຼັກສຳລັບອັບໂຫລດໄຟລ໌ */}
          <input 
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

      </div>
    </div>
  );
}