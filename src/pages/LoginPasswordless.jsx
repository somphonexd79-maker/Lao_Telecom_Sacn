import React, { useState } from 'react';
import { Mail, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export default function LoginPasswordless() {
  const [step, setStep] = useState(1); // step 1: ປ້ອນອີເມວ, step 2: ປ້ອນ OTP
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // ຂັ້ນຕອນທີ 1: ສົ່ງອີເມວ/ເບີໂທ ໄປໃຫ້ Backend ເພື່ອສ້າງ OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier) return alert('ກະລຸນາປ້ອນ ອີເມວ ຫຼື ເບີໂທລະສັບຂອງທ່ານ!');
    
    setIsLoading(true);
    try {
      // ຈຳລອງການສົ່ງ API ໄປ Backend
      // await axios.post('/api/auth/request-otp', { identifier });
      
      setTimeout(() => {
        setIsLoading(false);
        setStep(2); // ປ່ຽນໄປຂັ້ນຕອນປ້ອນ OTP
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      alert('ເກີດຂໍ້ຜິດພາດ ບໍ່ສາມາດສົ່ງ OTP ໄດ້');
    }
  };

  // ຂັ້ນຕອນທີ 2: ປ້ອນ OTP ແລ້ວສົ່ງໄປກວດສອບ
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return alert('ກະລຸນາປ້ອນລະຫັດ OTP ໃຫ້ຄົບ 6 ຕົວ!');

    setIsLoading(true);
    try {
      // ຈຳລອງການກວດສອບ OTP ກັບ Backend
      // const res = await axios.post('/api/auth/verify-otp', { identifier, otp: otpCode });
      // localStorage.setItem('token', res.data.token);
      
      setTimeout(() => {
        setIsLoading(false);
        alert('ເຂົ້າສູ່ລະບົບສຳເລັດ!');
        window.location.href = '/qrcode-manager'; 
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      alert('ລະຫັດ OTP ບໍ່ຖືກຕ້ອງ ຫຼື ໝົດອາຍຸ!');
    }
  };

  // ຈັດການການປ້ອນຕົວເລກ OTP ໃນແຕ່ລະຊ່ອງ
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // ເມື່ອປ້ອນແລ້ວ ໃຫ້ເລື່ອນໄປຊ່ອງຖັດໄປອັດຕະໂນມັດ
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF4] flex flex-col justify-center items-center p-4 antialiased text-slate-700">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full space-y-8">
        
        {/* Header Logo */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">Lao Telecom</h2>
          <p className="text-xs text-slate-400 mt-1">ເຂົ້າສູ່ລະບົບແບບປອດໄພ ໂດຍບໍ່ຕ້ອງໃຊ້ລະຫັດຜ່ານ</p>
        </div>

        {step === 1 ? (
          /* ກ່ອງຂັ້ນຕອນທີ 1: ປ້ອນອີເມວ */
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">ອີເມວ ຫຼື ເບີໂທລະສັບ</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="example@email.com ຫຼື 020..."
                  className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50 text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              {isLoading ? 'ກຳລັງສົ່ງ...' : 'ຮັບລະຫັດ OTP'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* ກ່ອງຂັ້ນຕອນທີ 2: ປ້ອນ OTP 6 ຕົວ */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-3 text-center">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">ປ້ອນລະຫັດ OTP 6 ຕົວ</label>
              <p className="text-xs text-slate-400">ລະຫັດຖືກສົ່ງໄປທີ່: <span className="text-slate-700 font-semibold">{identifier}</span></p>
              
              {/* ຊ່ອງກອກຕົວເລກ OTP ແຍກກັນ 6 ຊ່ອງ */}
              <div className="flex justify-center gap-2 pt-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-11 h-12 text-center text-lg font-bold border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                {isLoading ? 'ກຳລັງກວດສອບ...' : 'ຢືນຢັນຕົວຕົນ'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs font-semibold text-slate-400 hover:text-slate-600 transition flex items-center justify-center gap-1.5 py-1"
              >
                <RefreshCw className="w-3 h-3" /> ປ່ຽນອີເມວ / ສົ່ງລະຫັດໃໝ່
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}