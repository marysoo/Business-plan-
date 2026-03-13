/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Users, 
  Calendar, 
  MapPin,
  Zap,
  Banknote,
  ShieldCheck,
  Building,
  Download
} from 'lucide-react';

const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

const capitalCosts = [
  { id: 1, item: 'Destoner', size: '2.2 kW', pieces: 1, cost: 2000000 },
  { id: 2, item: 'Polisher', size: '6.0 kW', pieces: 1, cost: 2500000 },
  { id: 3, item: 'Optical Colour Sorter', size: '1.0 kW', pieces: 1, cost: 6500000 },
  { id: 4, item: 'Bagging/Packaging Machine', size: '1.5 kW', pieces: 1, cost: 1100000 },
  { id: 5, item: 'Industrial grade voltage stabilizer', size: '10 kVA', pieces: 1, cost: 800000 },
  { id: 6, item: 'Generator', size: '8 kW', pieces: 1, cost: 1500000 },
  { id: 7, item: 'Land', size: '200 by 200', pieces: 1, cost: 4000000 },
  { id: 8, item: 'Building for machinery & drying space', size: '80ft by 80ft', pieces: 1, cost: 4700000 },
  { id: 9, item: 'Installation, testing & transportation', size: '-', pieces: 1, cost: 900000 },
  { id: 10, item: 'Installation material cost (wiring, pipes, etc.)', size: '-', pieces: 1, cost: 1000000 },
];

const operatingCosts = [
  { id: 1, item: 'Paddy Rice (Raw Material)', hours: '-', amount: '3 Tonnes', unitCost: 850000, total: 2550000 },
  { id: 2, item: 'Diesel (8 kW)', hours: '8', amount: '20 Liters', unitCost: 1300, total: 26000 },
  { id: 3, item: 'Worker', hours: '8', amount: '4 workers', unitCost: 2692, total: 10768 },
  { id: 4, item: 'Maintenance & Part Replacement', hours: '-', amount: '-', unitCost: 0, total: 13232 },
];

const revenue = [
  { id: 1, item: 'Bags of rice (50 kg)', amount: '40 bags', unitCost: 75000, total: 3000000 },
  { id: 2, item: 'Rice chaff (10% of rice bag)', amount: '40 bags', unitCost: 1500, total: 60000 },
];

const questions = [
  { q: "1. Specify the size of rice mill that is intended to be established", a: "The intended size is a 2 tonnes per day (or 15 tonnes per week) capacity rice processing mill." },
  { q: "2. Specify the number of working days per week, and explanation", a: "6 working days per week. Operating from Monday to Saturday allows the mill to process exactly 12 to 15 tonnes weekly. Sunday is strictly reserved for machine rest, comprehensive cleaning, and preventive maintenance to avoid sudden breakdowns." },
  { q: "3. Briefly explain the capital items needed...", a: "Destoner: Removes stones/sand. Polisher: Removes bran layer. Optical Colour Sorter: Removes discolored grains. Bagging Machine: Automates weighing/sealing. Stabilizer: Protects equipment. Generator: Backup power. Land (200x200): Space for building and drying. Building: Protects machinery and stores rice." },
  { q: "4. Building cost should have a size, preferably a building plan...", a: "Size: 80ft by 80ft. Cost Breakdown (N4.7m Total): 3,000 Blocks (N1.5m), Cement 100 bags @ N12,000 (N1.2m), Plaster/sharp sand (N400k), Gravel (N300k), Roofing (N800k), Workmanship (N500k)." },
  { q: "5. Give explanation on the needed capacity of each equipment based on mill processing size", a: "To achieve 2 tonnes/day within an 8-hour shift, equipment must process 250–300 kg/hr. The selected machines are rated for 400–500 kg/hr, providing slight overcapacity to prevent overworking." },
  { q: "6. Give explanation of the equipment estimated cost...", a: "Costs reflect current market realities and exchange rates. A high-precision mini optical colour sorter is ~N6.5m. The polisher (N2.5m) and destoner (N2m) are commercial-grade models for continuous use." },
  { q: "7. Give explanation of the installation estimated cost...", a: "N900,000 covers specialized technicians for alignment, calibration, and heavy transportation. N1,000,000 covers heavy-duty cables, changeover switches, PVC pipes, and mounting bolts." },
  { q: "8. Give explanation for the need amount of worker, and experience needed", a: "4 workers required: 1 Lead Operator (experienced in calibration/troubleshooting), 2 Manual Laborers (loading/drying), 1 Packaging/Admin Staff. Paid national minimum wage of N70,000/month." },
  { q: "9. Give explanation for the need number of operational hours per day...", a: "8 hours per day. 5-6 hours of active machine time to process 2 tonnes, leaving 2 hours for cleaning, setup, bagging, and minor maintenance. Weekly average is 48 hours." },
  { q: "10. Give the number of working days per week, and explanation", a: "6 days a week (Monday to Saturday) to maximize revenue, with Sunday for rest and maintenance." },
  { q: "11. Specify the amount that the investors need to invest", a: "N25,000,000. No amount is set aside from this budget for kickoff (buying paddy or processing LGA land papers). The operator will source working capital independently or operate a toll-milling model initially." },
  { q: "12. Give percentage of revenue sharing between you, and the investors", a: "40% for the Investor and 60% for the Operator. The operator bears the burden of day-to-day management, sourcing raw materials, logistics, and physical labor. The investor takes a passive 40% for providing the CAPEX." },
  { q: "13. Based on the percentage of revenue share for investor, estimate the Payback Period for the investor", a: "Daily Net Profit: N460,000. Monthly Profit: N11,040,000. Annual Profit: N132,480,000. Investor's Share (40%): N52,992,000. Payback Period: N25,000,000 / N52,992,000 = 0.47 Years (~6 Months)." }
];

const risks = [
  { title: "Machine Breakdown / Scarcity of Parts", action: "Implement strict weekly maintenance (Sundays). Stockpile fast-moving spare parts (belts, bearings, screens) to ensure downtime never exceeds 24 hours." },
  { title: "High Cost of Diesel / Grid Power Failure", action: "8kW generator serves as backup. Schedule heavy milling during periods of stable grid power to mitigate fuel costs." },
  { title: "Scarcity or High Cost of Paddy Rice", action: "Build relationships with local farmers early. Pivot to a 'Toll-Milling' model (charging farmers to mill their rice) if working capital is tight." },
  { title: "Land/LGA Documentation Issues", action: "Engage local community leaders early for temporary permits while using operational profits to gradually process permanent state government land titles." }
];

const exportToPDF = () => {
  const doc = new jsPDF();
  let yPos = 20;

  // Title
  doc.setFontSize(20);
  doc.text("Rice Processing Mill Business Plan", 14, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.text("A comprehensive N25,000,000 capital budget proposal for a 2 Tonnes/Day facility.", 14, yPos);
  yPos += 15;

  // Capital Costs Table
  doc.setFontSize(14);
  doc.text("Capital Cost Estimation (Table 1)", 14, yPos);
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Size/Rating', 'Cost (NGN)']],
    body: [
      ...capitalCosts.map(c => [c.item, c.size, formatNaira(c.cost)]),
      ['Total Capital Expenditure', '', formatNaira(25000000)]
    ],
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Operating Costs Table
  doc.text("Daily Operating Cost (Table 2)", 14, yPos);
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Amount', 'Total (NGN)']],
    body: [
      ...operatingCosts.map(c => [c.item, c.amount, formatNaira(c.total)]),
      ['Total Daily OPEX', '', formatNaira(2600000)]
    ],
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Revenue Table
  doc.text("Daily Revenue Estimation (Table 3)", 14, yPos);
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Amount', 'Total (NGN)']],
    body: [
      ...revenue.map(c => [c.item, c.amount, formatNaira(c.total)]),
      ['Total Daily Revenue', '', formatNaira(3060000)]
    ],
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Q&A
  doc.addPage();
  yPos = 20;
  doc.setFontSize(16);
  doc.text("Detailed Project Plan (Q&A)", 14, yPos);
  yPos += 10;

  doc.setFontSize(11);
  questions.forEach(q => {
    const splitTitle = doc.splitTextToSize(q.q, 180);
    const splitAnswer = doc.splitTextToSize(q.a, 180);
    
    if (yPos + (splitTitle.length + splitAnswer.length) * 5 > 280) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(splitTitle, 14, yPos);
    yPos += splitTitle.length * 5;

    doc.setFont("helvetica", "normal");
    doc.text(splitAnswer, 14, yPos);
    yPos += splitAnswer.length * 5 + 5;
  });

  // Risks
  doc.addPage();
  yPos = 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Risk Identification & Mitigation", 14, yPos);
  yPos += 10;

  doc.setFontSize(11);
  risks.forEach(r => {
    const splitTitle = doc.splitTextToSize(`Risk: ${r.title}`, 180);
    const splitAction = doc.splitTextToSize(`Next Action: ${r.action}`, 180);

    if (yPos + (splitTitle.length + splitAction.length) * 5 > 280) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(splitTitle, 14, yPos);
    yPos += splitTitle.length * 5;

    doc.setFont("helvetica", "normal");
    doc.text(splitAction, 14, yPos);
    yPos += splitAction.length * 5 + 5;
  });

  doc.save("Rice_Mill_Business_Plan.pdf");
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-4 py-8 relative">
          <div className="absolute top-0 right-0 md:top-8">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-700 rounded-full mb-4"
          >
            <Banknote size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
          >
            Rice Processing Mill Business Plan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-medium max-w-2xl mx-auto"
          >
            A comprehensive N25,000,000 capital budget proposal for a 2 Tonnes/Day high-quality rice processing facility.
          </motion.p>
        </header>

        {/* Key Metrics Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Settings size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Capacity</p>
              <p className="text-xl font-bold text-slate-900">2 Tonnes / Day</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Calendar size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Operations</p>
              <p className="text-xl font-bold text-slate-900">6 Days / Week</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Workforce</p>
              <p className="text-xl font-bold text-slate-900">4 Staff</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Payback Period</p>
              <p className="text-xl font-bold text-slate-900">~6 Months</p>
            </div>
          </div>
        </motion.section>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Capital Costs */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building className="text-slate-400" /> Capital Cost Estimation (Table 1)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Size/Rating</th>
                    <th className="px-6 py-3 text-right">Cost (NGN)</th>
                  </tr>
                </thead>
                <tbody>
                  {capitalCosts.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.item}</td>
                      <td className="px-6 py-4 text-slate-500">{item.size}</td>
                      <td className="px-6 py-4 text-right font-mono">{formatNaira(item.cost)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="px-6 py-4" colSpan={2}>Total Capital Expenditure</td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-600">{formatNaira(25000000)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          <div className="space-y-8">
            {/* Operating Costs */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="text-slate-400" /> Daily Operating Cost (Table 2)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3">Item</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3 text-right">Total (NGN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operatingCosts.map((item) => (
                      <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.item}</td>
                        <td className="px-6 py-4 text-slate-500">{item.amount}</td>
                        <td className="px-6 py-4 text-right font-mono">{formatNaira(item.total)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="px-6 py-4" colSpan={2}>Total Daily OPEX</td>
                      <td className="px-6 py-4 text-right font-mono text-rose-600">{formatNaira(2600000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* Revenue */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="text-slate-400" /> Daily Revenue Estimation (Table 3)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3">Item</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3 text-right">Total (NGN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue.map((item) => (
                      <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.item}</td>
                        <td className="px-6 py-4 text-slate-500">{item.amount}</td>
                        <td className="px-6 py-4 text-right font-mono">{formatNaira(item.total)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="px-6 py-4" colSpan={2}>Total Daily Revenue</td>
                      <td className="px-6 py-4 text-right font-mono text-emerald-600">{formatNaira(3060000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Detailed Q&A */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <FileText className="text-indigo-600" /> Detailed Project Plan (Q&A)
          </h2>
          <div className="space-y-6">
            {questions.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Risk Management */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <ShieldCheck className="text-emerald-600" /> Risk Identification & Mitigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risks.map((risk, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-rose-100 bg-rose-50/30">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                  <h3 className="font-semibold text-slate-900">{risk.title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed ml-8">
                  <span className="font-medium text-slate-700">Next Action: </span> 
                  {risk.action}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
