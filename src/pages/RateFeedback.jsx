import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function RateFeedback() {
  const { targetCode } = useParams(); 
  const navigate = useNavigate();
  
  // 1. ສ້າງ State ສໍາລັບເກັບຂໍ້ມູນພະນັກງານທີ່ດຶງມາໄດ້
  const [profile, setProfile] = useState({
    name: 'ກຳລັງໂຫລດຂໍ້ມູນ...',
    position: '',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' // ຮູບເລີ່ມຕົ້ນ
  });

  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tags = ["ບໍລິການວ່ອງໄວ", "ພະນັກງານເປັນກັນເອງ", "ໃຫ້ຂໍ້ມູນຄົບຖ້ວນ", "ເປັນມືອາຊີບ"];

  // 2. ໃຊ້ useEffect ດຶງຂໍ້ມູນຈາກຖານຂໍ້ມູນ (localStorage) ເມື່ອເປີດໜ້ານີ້ຂຶ້ນມາ
  useEffect(() => {
    // ດຶງລາຍຊື່ທັງໝົດທີ່ມີໃນລະບົບ (ອັນດຽວກັບໜ້າ QRCodeManager)
    const localTargets = JSON.parse(localStorage.getItem('all_targets'));
    
    // ຖ້າຫາກຍັງບໍ່ມີຂໍ້ມູນໃນເຄື່ອງ (ກໍລະນີເປີດເທື່ອທຳອິດ), ໃຫ້ໃຊ້ຂໍ້ມູນເລີ່ມຕົ້ນ
    const defaultTargets = [
      { id: 1, code: 'STAFF-772', name: 'Julian Rivers', position: 'Personnel Directory', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { id: 2, code: 'COUNTER-01', name: 'Counter A', position: 'ຈຸດບໍລິການທີ່ 1', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    ];

    const currentTargetsList = localTargets || defaultTargets;

    // ຄົ້ນຫາພະນັກງານທີ່ມີລະຫັດ ID ກົງກັບ URL (targetCode)
    const foundProfile = currentTargetsList.find(t => t.code.toUpperCase() === targetCode?.toUpperCase());

    if (foundProfile) {
      setProfile(foundProfile);
    } else {
      // ຖ້າສະແກນແລ້ວບໍ່ມີ ID ນີ້ໃນລະບົບ
      setProfile({
        name: 'ບໍ່ພົບຂໍ້ມູນພະນັກງານ',
        position: `ລະຫັດ ID: ${targetCode} ບໍ່ຖືກຕ້ອງ`,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      });
    }
  }, [targetCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score === 0) return alert('ກະລຸນາເລືອກຄະແນນກ່ອນສົ່ງຄຳຕິຊົມ!');

    const newFeedbackItem = {
      id: Date.now(),
      code: targetCode || 'UNKNOWN', 
      name: profile.name, // ບັນທຶກຊື່ໄວ້ນຳເພື່ອໃຫ້ Admin ເບິ່ງງ່າຍ
      score: score, 
      comment: comment || 'ບໍ່ມີຄວາມຄິດເຫັນເພີ່ມເຕີມ', 
      date: new Date().toLocaleString('lo-LA'), 
      type: score >= 4 ? 'positive' : score <= 2 ? 'negative' : 'neutral'
    };

    const existingFeedbacks = JSON.parse(localStorage.getItem('all_feedbacks')) || [];
    existingFeedbacks.unshift(newFeedbackItem);
    localStorage.setItem('all_feedbacks', JSON.stringify(existingFeedbacks));

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center p-4 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full border border-slate-100 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">ຂอบໃຈ!</h2>
          <p className="text-xs text-slate-400">ຄຳຕິຊົມຂອງທ່ານໄດ້ຮັບການສົ່ງ ແລະ ບັນທຶກຮຽບຮ້ອຍແລ້ວ.</p>
          <button 
            onClick={() => { setIsSubmitted(false); setScore(0); setComment(''); }}
            className="w-full bg-[#0052cc] hover:bg-[#0047B3] text-white text-xs font-semibold py-3 rounded-lg transition"
          >
            ໃຫ້ຄະແນນອີກຄັ້ງ
          </button>
          <button 
            onClick={() => navigate('/qrcode-manager')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-3 rounded-lg transition"
          >
            ກັບຄືນໜ້າຈັດການ QR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col justify-between font-sans antialiased text-[#172B4D]">
      
      <header className="px-6 md:px-10 pt-8 flex items-center justify-between w-full max-w-7xl mx-auto">
        <h1 className="text-[22px] font-bold text-[#0052CC] tracking-tight">FeedbackPro</h1>
        <button 
          onClick={() => navigate('/qrcode-manager')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0052CC] bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" /> ກັບຄືນໜ້າຈັດການ
        </button>
      </header>

      <main className="max-w-[700px] w-full mx-auto px-6 flex-1 flex flex-col justify-center items-center py-6">
        
        {/* 🔄 ຂໍ້ມູນ Profile ບ່ອນນີ້ຈະປ່ຽນໄປຕາມ ID ແທ້ແລ້ວ */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img 
              src={profile.image} 
              alt={profile.name} 
              className="w-[100px] h-[100px] rounded-full mx-auto object-cover border border-slate-100"
            />
            <div className="absolute bottom-0 right-1 bg-[#0052CC] text-white p-1 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center">
              <svg className="w-3 h-3 fill-current stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>
          <h2 className="text-[28px] font-bold text-[#091E42] mt-4 tracking-tight">{profile.name}</h2>
          <p className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-widest mt-1">
            {profile.position} ({targetCode})
          </p>
        </div>

        <div className="bg-white w-full p-10 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.015)] border border-[#EDEDF5] space-y-8">
          <h3 className="text-[20px] font-bold text-[#091E42] text-center tracking-tight">ປະສົບການໃນການຮັບບໍລິການຂອງທ່ານເປັນແນວໃດ?</h3>
          
          <div className="flex justify-between items-center max-w-[500px] mx-auto gap-1">
            {[...Array(5)].map((_, idx) => {
              const val = idx + 1;
              const isCurrentSelected = val <= score;
              const isHovered = val <= hoverScore;
              
              return (
                <button
                  type="button" key={val}
                  onClick={() => setScore(val)}
                  onMouseEnter={() => setHoverScore(val)}
                  onMouseLeave={() => setHoverScore(0)}
                  className="flex flex-col items-center gap-2 focus:outline-none flex-1 group"
                >
                  <svg 
                    className={`w-8 h-8 transition-all ${
                      isCurrentSelected || isHovered
                        ? 'text-amber-400 fill-amber-400 stroke-[1.5]' 
                        : 'text-[#C1C7D0] fill-none stroke-[1.5]'
                    }`} 
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.435.76-.435.932 0l2.302 5.83 6.32 1.02a.5.5 0 01.278.853l-4.566 4.46 1.08 6.29a.5.5 0 01-.726.526L12 19.44l-5.6 3.14a.5.5 0 01-.726-.526l1.08-6.29L2.19 11.202a.5.5 0 01.278-.853l6.32-1.02 2.302-5.83z" />
                  </svg>
                  <span className="text-[11px] font-medium text-[#5E6C84]">{val}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#5E6C84]">ຄວາມຄິດເຫັນ ແລະ ຄຳຕິຊົມ</label>
              <textarea
                rows="5" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="ເປັນຫຍັງທ່ານຈຶ່ງໃຫ້ຄະແນນນີ້? (ຕົວຢ່າງ: ເວົ້າຈາສຸພາບ, ອະທິບາຍຊັດເຈນດີ)"
                className="w-full px-5 py-4 rounded-xl border border-[#DFE1E6] focus:outline-none focus:border-[#0052CC] bg-[#F4F5FA] text-[#091E42] text-[14px] leading-relaxed transition resize-none placeholder-[#8993A4]"
              ></textarea>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {tags.map(tag => (
                <button
                  type="button" key={tag}
                  onClick={() => setComment(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="text-[12px] text-[#42526E] px-4 py-2 bg-[#EBECF0] rounded-full hover:bg-[#DFE1E6] transition font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0052CC] hover:bg-[#0047B3] text-white font-medium py-3.5 rounded-lg transition duration-150 flex items-center justify-center gap-2 text-[15px] shadow-xs"
            >
              ສົ່ງຄຳຕິຊົມ
              <svg className="w-4 h-4 fill-current rotate-45 transform translate-y-[-1px]" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
        
        <p className="text-center text-[13px] text-[#5E6C84] mt-8 leading-relaxed">
          ຄຳຕິຊົມຂອງທ່ານຈະຖືກເກັບຮັກສາເປັນຄວາມລັບ (ບໍ່ລະບຸຕົວຕົນ) ແລະ ຈະນຳໄປໃຊ້ເພື່ອປັບປຸງ<br />ມາດຕະຖານການບໍລິການຂອງພວກເຮົາໃຫ້ດີຂຶ້ນ. ຂອບໃຈທີ່ສະຫຼະເວລາມາຮ່ວມຕອບແບບຟອມ.
        </p>
      </main>

      <footer className="bg-white border-t border-[#F4F5F7] px-10 py-5 flex flex-col sm:flex-row justify-between items-center text-[12px] text-[#6B778C] gap-3">
        <span className="font-semibold text-[#42526E]">FeedbackPro Systems</span>
        <span>© 2026 FeedbackPro Systems. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#0052CC] transition">ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ</a>
          <a href="#" className="hover:text-[#0052CC] transition">ຂໍ້ກຳນົດ ແລະ ເງື່ອນໄຂ</a>
        </div>
      </footer>

    </div>
  );
}