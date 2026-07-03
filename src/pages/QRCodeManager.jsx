import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; 
import { Plus, Download, Search, LayoutDashboard, QrCode, Camera, X } from 'lucide-react';

export default function QRCodeManager() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. ສ້າງ State ສໍາລັບເກັບຂໍ້ມູນ (ສາມາດເພີ່ມຂໍ້ມູນໃໝ່ເຂົ້າໄປໄດ້)
  const [targets, setTargets] = useState([
    { id: 1, code: 'STAFF-772', name: 'Julian Rivers', position: 'Personnel Directory', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 2, code: 'COUNTER-01', name: 'Counter A', position: 'ຈຸດບໍລິການທີ່ 1', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  ]);

  // State ສໍາລັບຄວບຄຸມການເປີດ/ປິດ ຟອມປ໊ອບອັບ (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State ສໍາລັບເກັບຄ່າຈາກຟອມກອກຂໍ້ມູນໃໝ່
  const [newTarget, setNewTarget] = useState({
    code: '',
    name: '',
    position: '',
    image: ''
  });

  // ຟັງຊັນບັນທຶກ ID & QR ໃໝ່
  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newTarget.code || !newTarget.name) {
      alert('ກະລຸນາກອກ ລະຫັດ ID ແລະ ຊື່ພະນັກງານ');
      return;
    }

    // ກວດສອບ ID ຊ້ຳ
    const isDuplicate = targets.some(t => t.code.toUpperCase() === newTarget.code.toUpperCase());
    if (isDuplicate) {
      alert('ລະຫັດ ID ນີ້ມີຢູ່ໃນລະບົບແລ້ວ!');
      return;
    }

    const defaultImage = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'; // ຮູບເລີ່ມຕົ້ນຖ້າບໍ່ໄດ້ໃສ່ລົງໄປ

    const updatedList = [
      ...targets,
      {
        id: Date.now(), // ສ້າງ ID ແບບບໍ່ຊ້ຳ
        code: newTarget.code.toUpperCase().trim(),
        name: newTarget.name,
        position: newTarget.position || 'ພະນັກງານ',
        image: newTarget.image || defaultImage
      }
    ];

    setTargets(updatedList);
    
    localStorage.setItem('all_targets', JSON.stringify(updatedList));
    // ລ້າງຄ່າໃນຟອມ ແລະ ປິດປ໊ອບອັບ
    setNewTarget({ code: '', name: '', position: '', image: '' });
    setIsModalOpen(false);
    alert('ສ້າງ ID ແລະ QR Code ສຳເລັດແລ້ວ!');
  };

  // ຟັງຊັນດາວໂຫລດ QR Code ເປັນ PNG
  const downloadQR = (code, name) => {
    const svg = document.getElementById(`qr-${code}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40; 
      canvas.height = img.height + 40;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${code}-${name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const filteredTargets = targets.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* 🧭 SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-blue-400">Lao Telecom</h2>
        <nav className="space-y-3">
          <a href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition">
            <LayoutDashboard className="w-5 h-5" /> ພາບລວມລະບົບ
          </a>
          <a href="/qrcode-manager" className="flex items-center gap-3 px-4 py-2.5 bg-blue-600 rounded-xl font-medium">
            <QrCode className="w-5 h-5" /> ໂຕຈັດການຄິວອາ
          </a>
          <button 
            onClick={() => navigate('/scan')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition text-left"
          >
            <Camera className="w-5 h-5" /> ສະແກນ QR Code
          </button>
        </nav>
      </div>

      {/* 🖥️ MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">ຕົວຈັດການ QR Code (QR Code Manager)</h1>
            <p className="text-sm text-slate-500">ສ້າງລະຫັດແລະດາວໂຫລດ QR Code ສຳລັບນຳໄປໃຊ້</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/scan')} 
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl transition border border-slate-200 shadow-sm text-sm"
            >
              <Camera className="w-5 h-5" /> ສະແກນ QR Code
            </button>

            {/* ປຸ່ມກົດເປີດ Modal ຟອມສ້າງໃໝ່ */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-sm text-sm"
            >
              <Plus className="w-5 h-5" /> ສ້າງ ID & QR ໃຫມ່
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="ຄົ້ນຫາດ້ວຍຊື່ ຫຼື ລະຫັດພະນັກງານ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none text-slate-700"
          />
        </div>

        {/* Grid List Item */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTargets.map((item) => {
            // 🔗 ບ່ອນນີ້ສຳຄັນ: ມັນຈະສ້າງ Link ໄປຫາໜ້າໃຫ້ຄະແນນແບບອັດຕະໂນມັດ ຕາມ ID ຂອງແຕ່ລະຄົນ
            const targetUrl = `${window.location.origin}/rate/${item.code}`;

            return (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-slate-100" />
                <h3 className="font-bold text-slate-800 text-base">{item.name}</h3>
                <p className="text-xs text-slate-400 font-medium mb-4">{item.position}</p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 cursor-pointer hover:bg-blue-50/50 transition" onClick={() => window.open(targetUrl, '_blank')}>
                  <QRCodeSVG 
                    id={`qr-${item.code}`}
                    value={targetUrl} 
                    size={130}
                    level={"H"} 
                  />
                </div>

                <p className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md mb-4">
                  ID: {item.code}
                </p>

                <button 
                  onClick={() => downloadQR(item.code, item.name)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-xl border border-slate-200 transition"
                >
                  <Download className="w-4 h-4" /> ໂຫລດຄິວອາ (PNG)
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📑 MODAL DIALOG: ປ໊ອບອັບຟອມສ້າງ ID & QR ໃໝ່ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl border border-slate-100 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">ສ້າງພະນັກງານ / ຈຸດບໍລິການໃໝ່</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">ລະຫັດ ID (ເຊັ່ນ: STAFF-999)</label>
                <input 
                  type="text" required
                  placeholder="ກະລຸນາກອກ ID ຫ້າມຊ້ຳກັນ"
                  value={newTarget.code}
                  onChange={(e) => setNewTarget({...newTarget, code: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">ຊື່ພະນັກງານ ຫຼື ຊື່ຈຸດບໍລິການ</label>
                <input 
                  type="text" required
                  placeholder="ເຊັ່ນ: Somchai Somsack"
                  value={newTarget.name}
                  onChange={(e) => setNewTarget({...newTarget, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">ຕຳແໜ່ງ ຫຼື ລາຍລະອຽດ</label>
                <input 
                  type="text"
                  placeholder="ເຊັ່ນ: ຝ່າຍບໍລິການລູກຄ້າ / ເຄົາເຕີ B"
                  value={newTarget.position}
                  onChange={(e) => setNewTarget({...newTarget, position: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">ລິ້ງຮູບພາບໂປຣໄຟລ໌ (ບໍ່ໃສ່ກໍໄດ້)</label>
                <input 
                  type="text"
                  placeholder="https://..."
                  value={newTarget.image}
                  onChange={(e) => setNewTarget({...newTarget, image: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  ຍົກເລີກ
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm shadow-blue-600/10"
                >
                  ບັນທຶກ ແລະ ສ້າງ QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}