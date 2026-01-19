// Political Parties Data
export const parties = {
    "PP": { name: "พรรคประชาชน", color: "text-orange-500", icon: "fa-people-group", desc: "เน้นสวัสดิการถ้วนหน้า หวยใบเสร็จ ปลดล็อกที่ดิน และไม่ร่วมกับพรรคสืบทอดอำนาจ" },
    "PTP": { name: "พรรคเพื่อไทย", color: "text-red-500", icon: "fa-chart-line", desc: "เน้นเศรษฐกิจดิจิทัล รัฐร่วมจ่าย 70% ประกันกำไรเกษตรกร และ Wellness Economy" },
    "BJT": { name: "พรรคภูมิใจไทย", color: "text-blue-500", icon: "fa-hand-holding-heart", desc: "เน้นพักหนี้ 3 ปี กู้ฉุกเฉิน 50,000 บาท และฟรีโซล่าเซลล์ลดค่าไฟ" },
    "UTN": { name: "รวมไทยสร้างชาติ", color: "text-blue-700", icon: "fa-flag", desc: "เน้นรื้อกฎหมาย กองทุนฉุกเฉิน ประหารคนโกง และยกเลิก MOU44" },
    "DEM": { name: "พรรคประชาธิปัตย์", color: "text-cyan-500", icon: "fa-seedling", desc: "เน้นประกันรายได้เกษตรกร แพลตฟอร์มส่องรัฐปราบโกง และทหารอาสา" },
    "PPRP": { name: "พรรคพลังประชารัฐ", color: "text-blue-600", icon: "fa-id-card", desc: "เน้นบัตรประชารัฐ 700+ เบี้ยผู้สูงอายุขั้นบันได และน้ำมันประชาชน" },
    "KLA": { name: "พรรคกล้าธรรม", color: "text-purple-600", icon: "fa-file-signature", desc: "เน้นเปลี่ยน ส.ป.ก. เป็นโฉนดทองคำ แก้หนี้เบ็ดเสร็จ และน้ำชุมชน" },
    "PCC": { name: "พรรคประชาชาติ", color: "text-orange-600", icon: "fa-hands-praying", desc: "เน้นล้างหนี้ กยศ. ลดราคาน้ำมันลิตรละ 20 บาท และสันติภาพชายแดนใต้" },
    "CTP": { name: "ชาติไทยพัฒนา", color: "text-pink-500", icon: "fa-leaf", desc: "เน้น Green Economy ขายคาร์บอนเครดิต และน้ำบาดาลขนาดใหญ่ทุกตำบล" },
    "TST": { name: "ไทยสร้างไทย", color: "text-purple-400", icon: "fa-person-cane", desc: "เน้นบำนาญ 3,000 บาท แขวนกฎหมายที่เป็นอุปสรรค และกองทุนคนตัวเล็ก" },
    "CP": { name: "ชาติพัฒนา", color: "text-orange-400", icon: "fa-road", desc: "เน้นโคราชโนมิกส์ มอเตอร์เวย์ทั่วไทย และอุตสาหกรรมกีฬา" },
    "SRT": { name: "เสรีรวมไทย", color: "text-yellow-500", icon: "fa-handcuffs", desc: "เน้นปราบโกงทั้งแผ่นดิน ยึดทรัพย์คนโกง และปฏิรูปตำรวจ" },
    "FAIR": { name: "พรรคเป็นธรรม", color: "text-purple-300", icon: "fa-dove", desc: "เน้นสันติภาพปาตานี จังหวัดจัดการตนเอง และสิทธิมนุษยชน" },
    "RAK": { name: "พรรครักชาติ", color: "text-indigo-500", icon: "fa-sim-card", desc: "เน้น Smart Card Max ใบเดียวจบ และรัฐรวมซื้อ (Collective Buying)" },
    "TKM": { name: "พรรคไทยก้าวใหม่", color: "text-cyan-400", icon: "fa-graduation-cap", desc: "เน้นธนู 4 ดอก การศึกษาจบไว และปราบสแกมเมอร์ใน 60 วัน" },
    "OKM": { name: "พรรคโอกาสใหม่", color: "text-emerald-400", icon: "fa-door-open", desc: "เน้นอัดฉีดงบลงทุนเข้าระบบทันที จ้างงานท้องถิ่น และปกป้องสถาบันฯ" },
    "ECO": { name: "พรรคเศรษฐกิจ", color: "text-green-500", icon: "fa-train-subway", desc: "เน้น Zero Corruption ทลายทุนผูกขาด และ Mega Projects" }
};

// Game Phases Data
export const phases = [
    {
        title: "เศรษฐกิจและปากท้อง",
        desc: "เลือกนโยบายที่คุณต้องการเห็นใน 100 วันแรก (เลือกได้หลายข้อ)",
        icon: "fa-money-bill-trend-up",
        options: [
            { id: "p1-1", label: "ดิจิทัลวอลเล็ต / รัฐร่วมจ่าย", desc: "กระตุ้นเศรษฐกิจครั้งใหญ่ด้วยเงินดิจิทัล", stats: { eco: 20, soc: 5, lib: 5, budget: -38 }, party: ["PTP", "ECO", "CP"] },
            { id: "p1-2", label: "ล้างหนี้ กยศ. / น้ำมัน 20 บาท", desc: "ลดภาระค่าใช้จ่ายพื้นฐานทันที", stats: { eco: 10, soc: 15, lib: 5, budget: -30 }, party: ["PCC", "KLA"] },
            { id: "p1-3", label: "ลดค่าไฟ / รื้อโครงสร้างพลังงาน", desc: "ลดค่าครองชีพด้านพลังงานอย่างยั่งยืน", stats: { eco: 15, soc: 5, lib: 10, budget: -15 }, party: ["UTN", "SRT", "PP", "BJT", "CTP"] },
            { id: "p1-4", label: "หวยใบเสร็จ", desc: "กระตุ้นการซื้อขายในร้านค้ารายย่อย", stats: { eco: 15, soc: 5, lib: 5, budget: 8 }, party: ["PP", "ECO"] },
            { id: "p1-5", label: "อัดฉีดงบ 5 แสนล้าน", desc: "เร่งรัดงบลงทุนภาครัฐเข้าระบบทันที", stats: { eco: 20, soc: 0, lib: 0, budget: -23 }, party: ["OKM", "CP"] },
            { id: "p1-6", label: "กองทุนคนตัวเล็ก / พักหนี้", desc: "ช่วย SME และคนตัวเล็กให้ตั้งตัวได้", stats: { eco: 15, soc: 15, lib: 5, budget: -18 }, party: ["TST", "BJT", "RAK"] },
            { id: "p1-7", label: "ลดภาษีสินค้าในประเทศ", desc: "ลด VAT สินค้าไทยเพื่อช่วยผู้ผลิต", stats: { eco: 10, soc: 5, lib: 10, budget: -12 }, party: ["RAK", "TKM"] },
            { id: "p1-8", label: "ค่าแรง 450-600 บาท", desc: "ขึ้นค่าแรงขั้นต่ำให้สอดคล้องค่าครองชีพ", stats: { eco: 5, soc: 15, lib: 10, budget: -8 }, party: ["PP", "PTP"] }
        ]
    },
    {
        title: "ที่ดินและการเกษตร",
        desc: "แนวทางช่วยเหลือเกษตรกรที่คุณต้องการ?",
        icon: "fa-wheat-awn",
        options: [
            { id: "p2-1", label: "เปลี่ยน ส.ป.ก. เป็นโฉนด", desc: "ให้เกษตรกรมีกรรมสิทธิ์ในที่ดินทำกิน", stats: { eco: 15, soc: 5, lib: 15, budget: -8 }, party: ["KLA", "PPRP"] },
            { id: "p2-2", label: "ประกันรายได้ / ประกันกำไร", desc: "รับประกันผลตอบแทนที่แน่นอนให้เกษตรกร", stats: { eco: 5, soc: 15, lib: 0, budget: -27 }, party: ["DEM", "PTP"] },
            { id: "p2-3", label: "คืนที่ทำกิน / ปลดล็อกที่ดินทับซ้อน", desc: "แก้ปัญหาที่ดินทับซ้อนระหว่างรัฐและราษฎร", stats: { eco: 10, soc: 15, lib: 15, budget: -12 }, party: ["PCC", "PP", "FAIR"] },
            { id: "p2-4", label: "รัฐรวมซื้อ (Collective Buying)", desc: "รัฐเป็นตัวกลางซื้อปุ๋ย/ยา ลดต้นทุนการผลิต", stats: { eco: 15, soc: 5, lib: -5, budget: 12 }, party: ["RAK", "KLA"] },
            { id: "p2-5", label: "เกษตรสีเขียว / น้ำบาดาล", desc: "ขายคาร์บอนเครดิตและจัดหาแหล่งน้ำทั่วถึง", stats: { eco: 10, soc: 10, lib: 5, budget: 8 }, party: ["CTP", "ECO"] },
            { id: "p2-6", label: "พักหนี้เกษตรกร", desc: "พักชำระหนี้ทั้งต้นและดอกเบี้ย", stats: { eco: 5, soc: 15, lib: 0, budget: -15 }, party: ["BJT", "KLA", "PPRP"] },
            { id: "p2-7", label: "แปรรูปสินค้าเกษตร", desc: "สร้างโรงงานแปรรูปในชุมชน เพิ่มมูลค่า", stats: { eco: 15, soc: 5, lib: 5, budget: -18 }, party: ["CP", "OKM", "CTP"] },
            { id: "p2-8", label: "โฉนดต้นไม้", desc: "ใช้ต้นไม้ค้ำประกันเงินกู้ได้", stats: { eco: 10, soc: 10, lib: 10, budget: 0 }, party: ["DEM", "CTP"] }
        ]
    },
    {
        title: "สวัสดิการสังคม",
        desc: "ระบบสวัสดิการแบบไหนที่ยั่งยืน?",
        icon: "fa-hand-holding-heart",
        options: [
            { id: "p3-1", label: "สวัสดิการถ้วนหน้า", desc: "ให้ทุกคนเท่ากัน (เด็ก/คนแก่) ไม่ต้องพิสูจน์ความจน", stats: { eco: -5, soc: 25, lib: 15, budget: -38 }, party: ["PP"] },
            { id: "p3-2", label: "บำนาญ 3,000 บาท", desc: "เบี้ยยังชีพผู้สูงอายุเดือนละ 3,000 บาท", stats: { eco: 0, soc: 20, lib: 5, budget: -33 }, party: ["TST", "PCC"] },
            { id: "p3-3", label: "บัตรใบเดียวจบ (Smart Card)", desc: "รวมสิทธิรักษา/เรียน/สวัสดิการในใบเดียว", stats: { eco: 10, soc: 10, lib: 10, budget: 8 }, party: ["RAK", "PTP", "ECO"] },
            { id: "p3-4", label: "บัตรประชารัฐ Plus", desc: "เพิ่มวงเงินช่วยเหลือกลุ่มเปราะบางโดยเฉพาะ", stats: { eco: 0, soc: 15, lib: 0, budget: -23 }, party: ["PPRP", "UTN", "KLA"] },
            { id: "p3-5", label: "ติดโซล่าเซลล์ฟรี", desc: "ลดภาระค่าไฟให้ทุกหลังคาเรือน", stats: { eco: 5, soc: 15, lib: 10, budget: -27 }, party: ["BJT", "TST"] },
            { id: "p3-6", label: "เงินอุดหนุนเด็ก/คนท้อง", desc: "ดูแลแม่และเด็กแรกเกิดอย่างเข้มข้น", stats: { eco: 5, soc: 20, lib: 5, budget: -21 }, party: ["TKM", "DEM", "PPRP"] },
            { id: "p3-7", label: "รักษาฟรีทั่วไทย (30 บาทพลัส)", desc: "ยกระดับระบบสาธารณสุขและการส่งต่อผู้ป่วย", stats: { eco: 0, soc: 20, lib: 10, budget: -30 }, party: ["PTP", "TST"] },
            { id: "p3-8", label: "ศูนย์ดูแลผู้สูงอายุ", desc: "Day Care Center ทุกตำบล", stats: { eco: 5, soc: 15, lib: 5, budget: -18 }, party: ["RAK", "UTN"] }
        ]
    },
    {
        title: "ปราบโกงและการเมือง",
        desc: "ยาแรงขนานไหนที่จะแก้ปัญหาคอร์รัปชันได้จริง?",
        icon: "fa-gavel",
        options: [
            { id: "p4-1", label: "ประหารชีวิตคนโกง", desc: "ลงโทษสูงสุดกับข้าราชการ/นักการเมืองที่ทุจริต", stats: { eco: 0, soc: 10, lib: -10, budget: 8 }, party: ["UTN", "ECO", "SRT"] },
            { id: "p4-2", label: "ประชาชนเข้าชื่อถอดถอน", desc: "ให้ประชาชนลงชื่อถอดถอนนักการเมืองได้ง่ายขึ้น", stats: { eco: 0, soc: 15, lib: 25, budget: -5 }, party: ["TST", "FAIR"] },
            { id: "p4-3", label: "รัฐบาลดิจิทัล (ลดดุลพินิจ)", desc: "ใช้ AI และระบบออนไลน์ลดช่องโหว่คอร์รัปชัน", stats: { eco: 10, soc: 10, lib: 10, budget: 12 }, party: ["TKM", "PTP", "CP"] },
            { id: "p4-4", label: "ยึดทรัพย์คนโกง", desc: "ยึดทรัพย์ผู้ร่ำรวยผิดปกติมาคืนหลวง", stats: { eco: 5, soc: 10, lib: -5, budget: 23 }, party: ["SRT", "KLA"] },
            { id: "p4-5", label: "กระจายอำนาจ / เลือกตั้งผู้ว่าฯ", desc: "ลดอำนาจส่วนกลาง ให้จังหวัดจัดการตนเอง", stats: { eco: 5, soc: 10, lib: 25, budget: -8 }, party: ["PP", "FAIR", "CTP"] },
            { id: "p4-6", label: "แพลตฟอร์มส่องรัฐ", desc: "เปิดเผยข้อมูลจัดซื้อจัดจ้างให้ประชาชนตรวจสอบ", stats: { eco: 5, soc: 5, lib: 20, budget: 15 }, party: ["DEM", "SRT"] },
            { id: "p4-7", label: "AI จับโกง", desc: "ตรวจสอบการประมูลรัฐแบบ Real-time", stats: { eco: 10, soc: 5, lib: 10, budget: 18 }, party: ["ECO"] },
            { id: "p4-8", label: "ปฏิรูปองค์กรอิสระ", desc: "รื้อระบบองค์กรตรวจสอบให้เป็นกลาง", stats: { eco: 0, soc: 10, lib: 20, budget: -8 }, party: ["PP", "TST"] }
        ]
    },
    {
        title: "ความมั่นคงของชาติ",
        desc: "จุดยืนเรื่องความมั่นคงที่คุณเห็นด้วย?",
        icon: "fa-shield-halved",
        options: [
            { id: "p5-1", label: "ยกเลิก MOU44 / สร้างรั้ว", desc: "ปกป้องเขตแดนอย่างเด็ดขาด ไม่ประนีประนอม", stats: { eco: 0, soc: 15, lib: -10, budget: -23 }, party: ["UTN"] },
            { id: "p5-2", label: "สันติภาพปาตานี", desc: "ใช้การเจรจาและการเมืองนำการทหารในภาคใต้", stats: { eco: 0, soc: 20, lib: 15, budget: 15 }, party: ["PCC", "FAIR"] },
            { id: "p5-3", label: "ปกป้องสถาบันฯ", desc: "ยึดมั่นในการปกครองระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุข", stats: { eco: 0, soc: 15, lib: -5, budget: -8 }, party: ["OKM", "UTN", "PPRP"] },
            { id: "p5-4", label: "ยกเลิกเกณฑ์ทหาร", desc: "ใช้ระบบสมัครใจ 100% สร้างทหารอาชีพ", stats: { eco: 5, soc: 10, lib: 20, budget: 12 }, party: ["PP", "DEM", "TKM"] },
            { id: "p5-5", label: "Single Command", desc: "นายกฯ สั่งการเองเบ็ดเสร็จเมื่อเกิดวิกฤต", stats: { eco: 0, soc: 10, lib: -15, budget: 0 }, party: ["TKM"] },
            { id: "p5-6", label: "ปราบยาเสพติดเด็ดขาด", desc: "กวาดล้างผู้ค้า และบำบัดผู้เสพ", stats: { eco: 0, soc: 20, lib: -5, budget: -18 }, party: ["PTP", "KLA"] },
            { id: "p5-7", label: "ปิดประเทศเมื่อมีโรคระบาด", desc: "กล้าตัดสินใจล็อกดาวน์เพื่อรักษาชีวิต", stats: { eco: -10, soc: 20, lib: -20, budget: -12 }, party: ["OKM"] },
            { id: "p5-8", label: "Offset อาวุธ", desc: "ซื้ออาวุธต้องแลกเปลี่ยนสินค้าเกษตร/เทคโนโลยี", stats: { eco: 10, soc: 5, lib: 0, budget: 18 }, party: ["DEM"] }
        ]
    },
    {
        title: "อนาคตและการศึกษา",
        desc: "จะสร้างคนรุ่นใหม่ให้เก่งและดีได้อย่างไร?",
        icon: "fa-graduation-cap",
        options: [
            { id: "p6-1", label: "เรียนฟรี ป.ตรี / จบไว", desc: "ลดเวลาเรียน เพิ่มเวลาทำงาน ลดภาระค่าใช้จ่าย", stats: { eco: 10, soc: 10, lib: 10, budget: -30 }, party: ["TST"] },
            { id: "p6-2", label: "ธนู 4 ดอก", desc: "เน้นสร้างคน สร้างงาน สร้างคุณภาพชีวิต", stats: { eco: 10, soc: 10, lib: 5, budget: -23 }, party: ["TKM"] },
            { id: "p6-3", label: "คืนครูให้นักเรียน", desc: "ปฏิรูปการศึกษา ลดงานเอกสารครู", stats: { eco: 5, soc: 10, lib: 15, budget: 8 }, party: ["PP"] },
            { id: "p6-4", label: "ทักษะการเงิน (Financial Lit)", desc: "สอนเรื่องการเงิน แก้ปัญหาหนี้สินคนรุ่นใหม่", stats: { eco: 15, soc: 5, lib: 5, budget: -5 }, party: ["DEM"] },
            { id: "p6-5", label: "ทักษะอนาคต (Wellness/Tech)", desc: "สร้างทักษะแรงงานมูลค่าสูง", stats: { eco: 15, soc: 5, lib: 5, budget: -12 }, party: ["PTP"] },
            { id: "p6-6", label: "แก้หนี้คนรุ่นใหม่ (กยศ.)", desc: "ล้างหนี้/ปรับโครงสร้างหนี้เพื่อการศึกษา", stats: { eco: 5, soc: 15, lib: 5, budget: -27 }, party: ["PCC", "BJT"] },
            { id: "p6-7", label: "อินเทอร์เน็ตฟรี/ดาวเทียม", desc: "ลดความเหลื่อมล้ำทางดิจิทัล", stats: { eco: 10, soc: 5, lib: 15, budget: -15 }, party: ["TKM", "PP"] },
            { id: "p6-8", label: "สร้างคนดีมีวินัย", desc: "ปลูกฝังค่านิยมตั้งแต่อนุบาล", stats: { eco: 0, soc: 15, lib: -5, budget: -8 }, party: ["TKM", "OKM"] }
        ]
    }
];