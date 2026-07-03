import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, QrCode, FileText, HelpCircle, LogOut, ArrowUpRight, MoreVertical, SlidersHorizontal, Download, ChevronDown } from 'lucide-react';

// 🔗 ນຳເຂົ້າ jspdf ສໍາລັບການສົ່ງອອກຟາຍ PDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard() {
  
  const [targetList, setTargetList] = useState([]);
  const [selectedCode, setSelectedCode] = useState('STAFF-772'); 
  const [selectedName, setSelectedName] = useState('Julian Rivers');
  const [allFeedbacks, setAllFeedbacks] = useState([]); // 📦 ເກັບຂໍ້ມູນທັງໝົດຂອງ Code ນັ້ນໆ
  const [recentFeedbacks, setRecentFeedbacks] = useState([]); // 🔍 ເກັບຂໍ້ມູນທີ່ຜ່ານການ Filter ແລ້ວ
  const [scoreFilter, setScoreFilter] = useState('all'); // 🔢 State ສຳລັບຄ່າການກັ່ນຕອງຄະແນນ

  const [chartData, setChartData] = useState([
    { day: 'Mon', score: 1.2 },
    { day: 'Tue', score: 2.5 },
    { day: 'Wed', score: 3.2 },
    { day: 'Thu', score: 2.8 },
    { day: 'Fri', score: 4.5 },
    { day: 'Sat', score: 3.8 },
    { day: 'Sun', score: 4.4 },
  ]);

  useEffect(() => {
    const localTargets = JSON.parse(localStorage.getItem('all_targets'));
    const defaultTargets = [
      { id: 1, code: 'STAFF-772', name: 'Julian Rivers', position: 'Personnel Directory' },
      { id: 2, code: 'COUNTER-01', name: 'Counter A', position: 'ຈຸດບໍລິການທີ່ 1' },
    ];
    const finalTargets = localTargets || defaultTargets;
    setTargetList(finalTargets);

    const localFeedbacks = JSON.parse(localStorage.getItem('all_feedbacks'));
    const defaultFeedbacks = [
      { id: 1, code: 'STAFF-772', score: 5, tags: ['Friendly Staff', 'Fast Service'], comment: '5 star - ອະທິບາຍເຂົ້າໃຈງ່າຍ ແລະບໍລິການລວດໄວຫຼາຍ ປະທັບໃຈຫຼາຍ', date: 'Oct 24, 2025 • 14:20', type: 'positive' },
      { id: 2, code: 'STAFF-772', score: 3, tags: ['Waiting Time'], comment: 'ບໍລິການດີແຕ່ຄົນຫຼາຍເກີນໄປ ຖ້າຄິວດົນ', date: 'Oct 23, 2024 • 09:45', type: 'neutral' },
      { id: 3, code: 'COUNTER-01', score: 1, tags: ['Critical Feedback'], comment: '1 star - ບໍ່ສຸພາບ ເວົ້າບໍ່ມ່ວນ ປຣັບປຣຸງແນ່', date: 'Oct 22, 2025 • 11:12', type: 'negative' },
    ];
    const finalFeedbacks = localFeedbacks || defaultFeedbacks;
    
    // ກັ່ນຕອງເອົາສະເພາະ Code ທີ່ເລືອກ
    const filteredByCode = finalFeedbacks.filter(item => item.code.toUpperCase() === selectedCode.toUpperCase());
    setAllFeedbacks(filteredByCode);
    setRecentFeedbacks(filteredByCode);
    setScoreFilter('all'); // ລີເຊັດຕົວທົດສອບຕົວ Filter ທຸກຄັ້ງທີ່ປ່ຽນພະນັກງານ
  }, [selectedCode]);

  // 🔄 ຟັງຊັນເຮັດວຽກເມື່ອມີການປ່ຽນແປງຄ່າ Filter ຄະແນນ
  const handleFilterChange = (e) => {
    const score = e.target.value;
    setScoreFilter(score);
    
    if (score === 'all') {
      setRecentFeedbacks(allFeedbacks);
    } else {
      const filtered = allFeedbacks.filter(item => item.score === parseInt(score));
      setRecentFeedbacks(filtered);
    }
  };

  const handleCodeChange = (e) => {
    const code = e.target.value;
    setSelectedCode(code);
    const found = targetList.find(t => t.code === code);
    if (found) setSelectedName(found.name);
  };

  // ຄຳນວນຄະແນນສະເລ່ຍຈາກຂໍ້ມູນທັງໝົດ (ບໍ່ປ່ຽນແປງຕາມການ Filter ໜ້າຕາຕະລາງ)
  const averageScore = allFeedbacks.length > 0 
    ? (allFeedbacks.reduce((sum, f) => sum + f.score, 0) / allFeedbacks.length).toFixed(1)
    : '0.0';

  // 📥 ຟັງຊັນສົ່ງອອກຂໍ້ມູນເປັນຕາຕະລາງ PDF
  const exportToPDF = () => {
    if (recentFeedbacks.length === 0) {
      alert("ບໍ່ມີຂໍ້ມູນຄວາມຄິດເຫັນເພື່ອສົ່ງອອກໃນຕອນນີ້!");
      return;
    }

    const doc = new jsPDF();

    // ສ້າງຫົວຂໍ້ລາຍງານໃນ PDF
    doc.setFontSize(18);
    doc.text('Lao Telecom - Feedback Performance Report', 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Feedback Code: ${selectedCode}`, 14, 30);
    doc.text(`Name: ${selectedName}`, 14, 36);
    doc.text(`Average Score: ${averageScore} / 5.0`, 14, 42);
    doc.text(`Filtered By: ${scoreFilter === 'all' ? 'All Scores' : scoreFilter + ' Stars'}`, 14, 48);
    doc.text(`Export Date: ${new Date().toLocaleDateString('lo-LA')}`, 14, 54);

    // ກຽມຂໍ້ມູນແຖວໃນຕາຕະລາງ
    const tableRows = [];
    recentFeedbacks.forEach((item) => {
      const rowData = [
        item.score,
        item.tags ? item.tags.join(', ') : '-',
        item.comment,
        item.date
      ];
      tableRows.push(rowData);
    });

    // ສ້າງຕາຕະລາງອັດຕະໂນມັດດ້ວຍ jspdf-autotable
    autoTable(doc, {
      startY: 60,
      head: [['Score', 'Tags', 'Comment / Feedback', 'Date']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 95 },
        3: { cellWidth: 40 }
      }
    });

    doc.save(`Feedback_Report_${selectedCode}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-600">
      
      {/* 🧭 SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 hidden md:flex">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-blue-600 tracking-tight">Lao Telecom</h2>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">ລະບົບຈັດການຜູ້ດູແລ</p>
          </div>
          <nav className="space-y-1">
            <a href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm transition">
              <LayoutDashboard className="w-4 h-4" /> ພາບລວມປະສິດທິພາບ
            </a>
            <a href="/qrcode-manager" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium text-sm transition">
              <QrCode className="w-4 h-4" /> ບຸຄະລາກອນ ແລະ ສ້າງລະຫັດ QR
            </a>
          </nav>
        </div>
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-slate-600 font-medium text-xs transition">
              <HelpCircle className="w-4 h-4" /> ຊ່ວຍເຫຼືອ
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-rose-600 font-medium text-xs transition">
              <LogOut className="w-4 h-4" /> ອອກຈາກລະບົບ
            </a>
          </div>
        </div>
      </div>

      {/* 🖥️ MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* 📋 TOP SUB-NAVBAR */}
        <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> ສົ່ງອອກຂໍ້ມູນ PDF
            </button>
          </div>
        </div>

        {/* 📊 CONTENT CONTAINER */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Header Title & Dropdown 選項 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">ພາບລວມການວິເຄາະຂໍ້ມູນ ({selectedName})</p>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">ລະຫັດຟີດແບັກ: {selectedCode}</h1>
            </div>
            
            <div className="relative inline-block shrink-0">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ວິເຄາະຂໍ້ມູນຂອງ ID ອື່ນ</label>
              <div className="relative">
                <select
                  value={selectedCode}
                  onChange={handleCodeChange}
                  className="appearance-none w-full sm:w-60 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-4 py-2.5 pr-10 rounded-xl text-xs focus:outline-none focus:border-blue-500 cursor-pointer transition"
                >
                  {targetList.map((target) => (
                    <option key={target.id} value={target.code}>
                      {target.code} - {target.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 📈 UPPER SECTION: GRID ສະຖິຕິ ແລະ ກຣາຟ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm shadow-slate-100/50 flex flex-col justify-center text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ຄະແນນສະເລ່ຍ</p>
              <h2 className="text-6xl font-black text-blue-600 tracking-tight mb-2">{averageScore}</h2>
              <div className="flex justify-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${i < Math.round(parseFloat(averageScore)) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                ))}
              </div>
              <p className="text-xs text-emerald-500 font-semibold flex items-center justify-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +0.6 ຈາກເດືອນຜ່ານມາ
              </p>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm shadow-slate-100/50 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">ແນວໂນ້ມຄະແນນ</h3>
                  <p className="text-xs text-slate-400">ເສັ້ນສະແດງຜົນງານລາຍອາທິດ</p>
                </div>
              </div>
              <div className="w-full h-52 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 💬 LOWER SECTION: ລາຍການຄອມເມັ້ນ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">ຄວາມຄິດເຫັນຫຼ້າສຸດ ({recentFeedbacks.length} ລາຍການ)</h3>
              
              {/* 🛠️ ປ່ຽນປຸ່ມລ້າໆ ໃຫ້ເປັນ Select Dropdown ສຳລັບກັ່ນຕອງຄະແນນ */}
              <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs relative">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
                <select
                  value={scoreFilter}
                  onChange={handleFilterChange}
                  className="appearance-none bg-transparent pl-5 pr-6 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">ທັງໝົດທຸກຄະແນນ</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5 ດາວ)</option>
                  <option value="4">⭐⭐⭐⭐ (4 ດາວ)</option>
                  <option value="3">⭐⭐⭐ (3 ດາວ)</option>
                  <option value="2">⭐⭐ (2 ດາວ)</option>
                  <option value="1">⭐ (1 ດາວ)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              {recentFeedbacks.length > 0 ? (
                recentFeedbacks.map((item) => (
                  <div 
                    key={item.id} 
                    className={`bg-white border-l-4 p-5 rounded-2xl border border-y-slate-100 border-r-slate-100 shadow-sm flex items-start gap-5 transition hover:shadow-md ${
                      item.type === 'positive' ? 'border-l-emerald-500' : 
                      item.type === 'negative' ? 'border-l-rose-500' : 'border-l-amber-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full font-black text-sm flex items-center justify-center shrink-0 ${
                      item.type === 'positive' ? 'bg-emerald-50 text-emerald-700' : 
                      item.type === 'negative' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {item.score}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.tags && item.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed">{item.comment}</p>
                      <p className="text-[10px] font-medium text-slate-400">{item.date}</p>
                    </div>

                    <button className="text-slate-300 hover:text-slate-500 transition p-1 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 text-slate-400 text-sm">
                  ບໍ່ມີຂໍ້ມູນຄະແນນ {scoreFilter} ດາວ ສຳລັບ ID ນີ້
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 🏢 GLOBAL FOOTER SYSTEM */}
        <footer className="mt-auto bg-white border-t border-slate-100 px-8 py-5 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-600">
            <span>Lao Telecom Systems</span>
          </div>
        </footer>

      </div>
    </div>
  );
}