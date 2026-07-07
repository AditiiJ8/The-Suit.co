// ============================================================
// RAG Engine — Retrieval-Augmented Generation
// Indian Legal Knowledge Base (accurate as of May 2026)
//
// HOW RAG WORKS IN THIS PROJECT:
// 1. User submits a query (question / document / situation)
// 2. retrieveChunks() runs BM25 ranking over LEGAL_KB
// 3. Top matching statutory chunks are returned
// 4. buildContext() formats them as "VERIFIED LEGAL SOURCES"
// 5. These chunks are injected into the LLM prompt BEFORE the user query
// 6. The LLM is instructed to cite ONLY sections present in those chunks
// 7. The API response includes sources[] so the UI can display them
//
// Result: LLM answers are grounded in real statutory text,
// not hallucinated from training data.
// ============================================================

export interface LegalChunk {
  id: string;
  act: string;
  section: string;
  title: string;
  content: string;
  tags: string[];
  source: string;
}

export const LEGAL_KB: LegalChunk[] = [

  // ══════════════════════════════════════════
  // CGST ACT 2017 — as amended up to Finance Act 2025
  // All amendments effective and in force as of May 2026
  // Source: https://cbic-gst.gov.in/cgst-act.html
  // ══════════════════════════════════════════

  {
    id: 'cgst-2', act: 'CGST Act 2017', section: 'Section 2', title: 'Key Definitions',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter1/section2_v1.00.html',
    content: `Section 2(6): "aggregate turnover" means the aggregate value of all taxable supplies (excluding value of inward supplies on which tax is payable under reverse charge), exempt supplies, exports of goods or services or both and inter-State supplies of persons having the same PAN, computed on all India basis — but excludes central tax, State tax, Union territory tax, integrated tax and cess.
Section 2(47): "exempt supply" means supply of any goods or services or both which attracts nil rate of tax or which may be wholly exempt from tax under section 11 or section 6 of the IGST Act, and includes non-taxable supply.
Section 2(62): "input tax" in relation to a registered person means the central tax, State tax, integrated tax or Union territory tax charged on any supply of goods or services or both made to him — includes IGST on imports, tax payable under RCM under sections 9(3) and 9(4) — but does not include tax paid under composition levy.
Section 2(116A) [inserted by Finance Act 2025]: "unique identification marking" means a marking as may be specified under section 148A, which is applied on goods or the packaging of goods for purposes of the Track and Trace Mechanism.`,
    tags: ['definition', 'aggregate turnover', 'exempt supply', 'input tax', 'GST', 'CGST', 'unique identification marking', 'Finance Act 2025']
  },

  {
    id: 'cgst-9', act: 'CGST Act 2017', section: 'Section 9', title: 'Levy and Collection — Including Reverse Charge',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter3/section9_v1.00.html',
    content: `Section 9(1): Tax called central goods and services tax (CGST) shall be levied on all intra-State supplies of goods or services or both at rates not exceeding twenty per cent., as notified by the Government on recommendations of the GST Council, and paid by the taxable person.
Section 9(3): The Government may, by notification, specify categories of supply on which tax shall be paid on reverse charge basis by the recipient. Notified RCM categories include: services by a goods transport agency (GTA) for transport of goods by road; legal services by an advocate or a firm of advocates to any business entity; services provided by a director of a company to the company; import of services; services by an insurance agent to an insurance company; services by a recovery agent to a banking company or NBFC.
Section 9(4): The Government may specify a class of registered persons who shall, for specified categories of goods or services received from an unregistered supplier, pay tax on reverse charge basis as the recipient.`,
    tags: ['levy', 'collection', 'reverse charge', 'RCM', 'section 9', 'GST', 'CGST', 'GTA', 'advocate', 'director', 'import of services', '20%']
  },

  {
    id: 'cgst-16', act: 'CGST Act 2017', section: 'Section 16', title: 'Eligibility and Conditions for Input Tax Credit',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter5/section16_v1.00.html',
    content: `Section 16(1): Every registered person shall be entitled to take credit of input tax charged on any supply of goods or services or both used or intended to be used in the course or furtherance of business, credited to his electronic credit ledger.
Section 16(2): No registered person shall be entitled to ITC unless — (a) he is in possession of a tax invoice or debit note; (aa) [inserted by Finance Act 2021] the details of the invoice have been furnished by the supplier in GSTR-1/1A/IFF and communicated to the registered person via GSTR-2B; (b) he has received the goods or services or both; (c) the tax charged has actually been paid to the Government by the supplier (in cash or via ITC); (d) he has furnished the return under section 39.
Section 16(4): A registered person shall not take ITC in respect of any invoice or debit note after the thirtieth day of November following the end of the financial year to which such invoice pertains, or furnishing of the relevant annual return, whichever is earlier. [Amended by Finance Act 2022 — deadline changed from September to 30th November]`,
    tags: ['ITC', 'input tax credit', 'section 16', 'CGST', 'GST', 'GSTR-2B', 'conditions', 'eligibility', '16(2)(aa)', '30 November']
  },

  {
    id: 'cgst-17', act: 'CGST Act 2017', section: 'Section 17', title: 'Blocked Credits — Including Finance Act 2025 Amendment to 17(5)(d)',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter5/section17_v1.00.html',
    content: `Section 17(5): ITC shall NOT be available (blocked credits) for: (a) motor vehicles for transportation of persons with seating ≤13 persons (incl. driver), except when used for further supply, transportation of passengers, or driver training; (aa) vessels and aircraft, except for transportation of goods/passengers or training; (b) food and beverages, outdoor catering, beauty treatment, health services, cosmetic and plastic surgery, life insurance, health insurance — except when used to make outward taxable supply of the same category; (ii) club/fitness memberships; (iii) employee vacation travel benefits; (c) works contract services for construction of immovable property (other than plant and machinery) — except for further supply of works contract; (d) goods or services received for construction of an immovable property (other than plant and machinery) on own account — [AMENDED by Finance Act 2025, retrospectively w.e.f. 01.07.2017: "plant or machinery" substituted with "plant and machinery"; Explanation 2 inserted to confirm the plant-and-machinery Explanation at end of Section 17 applies to clause (d) also. This retrospectively overrules the Supreme Court judgment in Safari Retreats Pvt. Ltd. case — commercial real estate companies CANNOT claim ITC on construction costs of buildings intended for leasing/renting.]; (e) goods/services on which composition tax paid; (g) goods/services for personal consumption; (h) goods lost, stolen, destroyed, written off, or given as gift/free samples.`,
    tags: ['blocked credit', 'section 17(5)', 'section 17(5)(d)', 'ITC', 'GST', 'motor vehicle', 'food', 'construction', 'immovable property', 'plant and machinery', 'Safari Retreats', 'Finance Act 2025', 'retrospective', 'personal consumption']
  },

  {
    id: 'cgst-20-isd', act: 'CGST Act 2017', section: 'Section 20', title: 'Input Service Distributor — Finance Act 2025 Amendment',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter5/section20_v1.00.html',
    content: `Section 20 governs the Input Service Distributor (ISD) mechanism — a registered office that receives invoices for input services and distributes the ITC to its branches. Finance Act 2025 amended Section 20(1)/(2) with effect from 1 April 2025: inter-state RCM (Reverse Charge Mechanism) transactions are now included under the ISD mechanism. Previously, ISD could only distribute ITC for common input services. Now, ITC on inter-state RCM supplies (under Section 5(3) and 5(4) of IGST Act) must also be distributed via ISD to the receiving branches. This is mandatory — ISD must file GSTR-6 for distributing such ITC.`,
    tags: ['ISD', 'input service distributor', 'section 20', 'GST', 'RCM', 'reverse charge', 'inter-state', 'Finance Act 2025', 'ITC distribution', '1 April 2025', 'GSTR-6']
  },

  {
    id: 'cgst-22', act: 'CGST Act 2017', section: 'Section 22', title: 'Persons Liable for GST Registration',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter6/section22_v1.00.html',
    content: `Section 22(1): Every supplier shall be liable to register under GST in the State from where he makes a taxable supply if his aggregate turnover in a financial year exceeds the threshold. Current thresholds (as of May 2026): For goods — Rs. 40 lakh for most States (Notification No. 10/2019-CT); Rs. 20 lakh for special category States (Manipur, Mizoram, Nagaland, Tripura). For services — Rs. 20 lakh for most States; Rs. 10 lakh for special category States. Section 24 mandates compulsory registration irrespective of turnover for: inter-State suppliers, e-commerce operators, persons required to pay tax under RCM, etc.`,
    tags: ['registration', 'threshold', 'section 22', 'GST', 'aggregate turnover', '40 lakh', '20 lakh', '10 lakh', 'special category states', 'compulsory registration']
  },

  {
    id: 'cgst-34', act: 'CGST Act 2017', section: 'Section 34', title: 'Credit Notes — Finance Act 2025: ITC Reversal by Recipient Required',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter8/section34_v1.00.html',
    content: `Section 34(2) [Amended by Finance Act 2025]: A supplier can reduce output tax liability on account of a credit note ONLY if the recipient has reversed the corresponding ITC attributable to the credit note. This creates a symmetric condition — the supplier's tax reduction is valid only when the buyer does not retain the related credit. The Invoice Management System (IMS) on the GST Portal enforces this: credit notes cannot remain in 'Pending' status — the recipient must Accept or Reject. If recipient accepts (i.e., reverses ITC), supplier can reduce liability; if recipient rejects, the credit note does not affect supplier's liability either.`,
    tags: ['credit note', 'section 34', 'ITC reversal', 'GST', 'Finance Act 2025', 'IMS', 'invoice management system', 'supplier', 'recipient', 'GSTR-3B']
  },

  {
    id: 'cgst-38-ims', act: 'CGST Act 2017', section: 'Section 38', title: 'Invoice Management System (IMS) — Finance Act 2025',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter8/section38_v1.00.html',
    content: `Section 38 revised by Finance Act 2025 to enable the Invoice Management System (IMS), operational on the GST Portal from October 2024. IMS allows recipients to Accept, Reject, or keep Pending — invoices and credit notes furnished by the supplier in GSTR-1/1A/IFF. GSTR-2B is auto-generated on the 14th of the following month based on recipient's IMS actions. ITC for rejected invoices does not appear in GSTR-2B and cannot be claimed. Credit notes cannot be kept 'Pending' in IMS. This directly affects ITC eligibility under Section 16(2)(aa).`,
    tags: ['IMS', 'invoice management system', 'section 38', 'GST', 'GSTR-2B', 'GSTR-1', 'Finance Act 2025', 'accept', 'reject', 'ITC', 'October 2024']
  },

  {
    id: 'cgst-50', act: 'CGST Act 2017', section: 'Section 50', title: 'Interest on Delayed Payment of GST',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter10/section50_v1.00.html',
    content: `Section 50(1): Every person who fails to pay tax within the prescribed period shall pay interest at a rate not exceeding 18% per annum, as notified. Rate notified: 18% per annum (Notification No. 13/2017-CT). Interest runs from the day after the due date to the date of actual payment.
Section 50(3) [Amended by Finance Act 2021, retrospective]: Where ITC has been wrongly availed AND utilised, interest is payable at a rate not exceeding 24% per annum. Rate notified: 24% per annum. The amendment confirmed that interest under Section 50(3) applies only where ITC has been wrongly availed AND actually utilised — not merely availed (i.e., sitting in the credit ledger without being used).`,
    tags: ['interest', 'section 50', 'GST', 'delayed payment', '18%', '24%', 'ITC', 'wrongly availed', 'utilised']
  },

  {
    id: 'cgst-54', act: 'CGST Act 2017', section: 'Section 54', title: 'Refund of GST',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter11/section54_v1.00.html',
    content: `Section 54(1): Any person claiming refund of tax and interest may apply before the expiry of two years from the relevant date, in the prescribed form.
Section 54(3): A registered person may claim refund of unutilised ITC at the end of any tax period for: (i) zero rated supplies made without payment of tax (under LUT/Bond); (ii) where credit accumulated due to rate of tax on inputs being higher than rate of tax on output supplies (inverted duty structure) — other than nil-rated or fully exempt supplies.
Section 54(6) [Amended by Finance Act 2025]: Provisional refund at 90% is now extended to inverted duty structure cases also (previously only available to zero-rated supplies). This speeds up cash flow for manufacturers facing inverted duty.
Section 54(7): Proper officer shall issue refund order within 60 days of receipt of complete application. Section 56: Interest at 6% per annum if refund not issued within 60 days.`,
    tags: ['refund', 'section 54', 'GST', '2 years', 'zero rated', 'inverted duty', 'LUT', '60 days', '6%', 'provisional refund', 'Finance Act 2025']
  },

  {
    id: 'cgst-73', act: 'CGST Act 2017', section: 'Section 73', title: 'Demand — Non-Fraud Cases',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter15/section73_v1.00.html',
    content: `Section 73: Applicable where tax has not been paid/short paid or ITC wrongly availed — for reasons OTHER than fraud, wilful misstatement, or suppression of facts.
Section 73(2): Show Cause Notice (SCN) must be issued at least 3 months before the time limit for order.
Section 73(10): Order must be issued within 3 years from the due date for furnishing of annual return for the financial year to which the short payment relates.
Section 73(8): If the person pays tax + interest + penalty of 10% of tax (or Rs. 10,000, whichever is higher) within 30 days of SCN, proceedings are deemed concluded.
Section 73(11): If tax + interest paid within 30 days of the order, penalty is 15% of tax. In other cases resolved before SCN — no penalty. Penalty applicable: 10% (post-SCN), 15% (post-order within 30 days), 25% (upon appeal and payment during appeal), 50% (other cases).`,
    tags: ['demand', 'section 73', 'GST', 'non-fraud', 'show cause notice', 'SCN', '3 years', '10%', '15%', 'penalty', 'order']
  },

  {
    id: 'cgst-74', act: 'CGST Act 2017', section: 'Section 74', title: 'Demand — Fraud Cases',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter15/section74_v1.00.html',
    content: `Section 74: Applicable where tax has not been paid/short paid or ITC wrongly availed by reason of fraud, wilful misstatement, or suppression of facts to evade tax.
Section 74(10): Order must be issued within 5 years from the due date for furnishing of annual return for the relevant financial year.
Section 74(8): If the person pays tax + interest + 15% penalty within 30 days of SCN, proceedings are deemed concluded.
Penalties under Section 74: 15% (if paid before/within 30 days of SCN); 25% (within 30 days of order); 50% (if appeal filed and payment made); 100% (default — full penalty equal to tax evaded).`,
    tags: ['demand', 'section 74', 'GST', 'fraud', 'wilful misstatement', 'suppression', '5 years', '100%', '15%', '25%', '50%', 'penalty', 'SCN']
  },

  {
    id: 'cgst-75', act: 'CGST Act 2017', section: 'Section 75', title: 'General Provisions — Demand Proceedings',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter15/section75_v1.00.html',
    content: `Section 75(4): An opportunity of hearing shall be granted where a request is received in writing from the person chargeable with tax or penalty, or where any adverse decision is contemplated against such person.
Section 75(12): Where any amount of self-assessed tax in a return filed under Section 39 remains unpaid, the same shall be recovered under Section 79 directly — without requiring Section 73/74 proceedings.
Section 75(13): Where penalty is imposed under Section 73 or 74, no penalty for the same act shall be imposed on the same person under any other provision of this Act.`,
    tags: ['general provisions', 'section 75', 'GST', 'hearing', 'opportunity', 'self-assessed tax', 'recovery', 'section 79']
  },

  {
    id: 'cgst-107', act: 'CGST Act 2017', section: 'Section 107', title: 'Appeals to Appellate Authority (Commissioner Appeals)',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter18/section107_v1.00.html',
    content: `Section 107(1): Any person aggrieved by a decision or order of an adjudicating authority may appeal to the Appellate Authority (Commissioner Appeals) within 3 months from the date of communication of the order.
Section 107(6): Pre-deposit for filing appeal — (a) full admitted tax/interest/penalty; (b) 10% of disputed tax (subject to a maximum of Rs. 25 crore).
Section 107(6) — Finance Act 2025 amendment (w.e.f. 01.04.2025): In cases involving only a demand of penalty (no tax demand), pre-deposit is 10% of the disputed penalty amount.
Section 107(11): The Appellate Authority shall, where possible, hear and decide every appeal within 1 year from the date of filing.`,
    tags: ['appeal', 'section 107', 'GST', 'appellate authority', 'commissioner appeals', '3 months', 'pre-deposit', '10%', '25 crore', 'Finance Act 2025', 'penalty-only appeal']
  },

  {
    id: 'cgst-112', act: 'CGST Act 2017', section: 'Section 112', title: 'Appeals to Appellate Tribunal (GSTAT)',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter18/section112_v1.00.html',
    content: `Section 112: Any person aggrieved by an order of the Appellate Authority or revisional authority may appeal to the Goods and Services Tax Appellate Tribunal (GSTAT). Time limit: 3 months from date of order. Pre-deposit required: 20% of disputed tax amount (in addition to the 10% already deposited at first appeal stage — so effective pre-deposit is 30% of disputed tax). The GSTAT Principal Bench is in New Delhi; State Benches are operational from 2025. Orders of GSTAT challengeable before High Court under Section 117 on substantial questions of law only.`,
    tags: ['GSTAT', 'GST tribunal', 'section 112', 'appeal', '20%', 'pre-deposit', '3 months', 'High Court', 'substantial question of law', '30%']
  },

  {
    id: 'cgst-122b', act: 'CGST Act 2017', section: 'Section 122B', title: 'Track and Trace Mechanism — Penalties [Finance Act 2025]',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter19/section122_v1.00.html',
    content: `Section 122B [inserted by Finance Act 2025]: Imposes penalties for contraventions of the Track and Trace Mechanism under Section 148A. The Government may notify specified goods that must carry a unique identification marking (defined in Section 2(116A)). Failure to affix the required unique identification marking on notified goods or their packaging attracts penalty under Section 122B. The mechanism targets sectors prone to counterfeiting and under-reporting of production (e.g., tobacco, pan masala, gutka, aerated beverages). Goods and penalty amounts will be as notified by the Government.`,
    tags: ['track and trace', 'section 122B', 'GST', 'unique identification', 'Finance Act 2025', 'penalty', 'specified goods', 'section 148A', 'tobacco', 'pan masala']
  },

  {
    id: 'cgst-129', act: 'CGST Act 2017', section: 'Section 129', title: 'Detention and Seizure of Goods in Transit',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter19/section129_v1.00.html',
    content: `Section 129(1): Where any person transports goods or stores goods in transit in contravention of GST provisions (e.g., without valid e-way bill, or without proper documents), the goods and conveyance shall be liable to detention or seizure.
Section 129(1)(a) [Amended by Finance Act 2023]: Penalty for getting goods released (where owner comes forward) = 200% of tax payable on such goods (increased from 100%). For exempted goods: 2% of value or Rs. 25,000, whichever is less.
Section 129(3): The proper officer detaining goods shall issue a notice specifying the penalty payable.
Important: Non-possession of e-way bill does not automatically attract Section 129 if the taxpayer can prove goods are being transported for legitimate purposes (supported by invoice and other documents).`,
    tags: ['detention', 'seizure', 'section 129', 'GST', 'transit', 'e-way bill', 'penalty', '200%', 'conveyance', 'Finance Act 2023']
  },

  {
    id: 'cgst-schedule3', act: 'CGST Act 2017', section: 'Schedule III — Para 8(aa)', title: 'SEZ/FTWZ Warehoused Goods — Not a Supply [Finance Act 2025, Retrospective]',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/documents/Central_Goods_and_Services_Tax_Act__2017_28-September-2022.html',
    content: `Schedule III lists activities that shall be treated as neither supply of goods nor supply of services. Finance Act 2025 inserted new paragraph 8(aa) [effective retrospectively from 01.07.2017]: "Supply of goods warehoused in a Special Economic Zone or in a Free Trade Warehousing Zone to any person before clearance for exports or to the Domestic Tariff Area" is NOT a supply under GST. Explanation 3 inserted defines "Special Economic Zone", "Free Trade Warehousing Zone" and "Domestic Tariff Area". This resolves retrospective disputes on GST applicability on SEZ/FTWZ warehouse transactions before clearance.`,
    tags: ['Schedule III', 'SEZ', 'FTWZ', 'paragraph 8', 'not a supply', 'warehoused goods', 'GST', 'Finance Act 2025', 'retrospective', 'DTA', 'special economic zone']
  },

  // ══════════════════════════════════════════
  // INCOME TAX ACT 1961
  // STATUS (as of May 2026): Repealed w.e.f. 1 April 2026.
  // Still governs all proceedings for AY 2026-27 and earlier.
  // Source: https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx
  // ══════════════════════════════════════════

  {
    id: 'it-4', act: 'Income Tax Act 1961', section: 'Section 4', title: 'Charge of Income Tax — Last AY Under IT Act 1961 is AY 2026-27',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section4',
    content: `[STATUS: Income Tax Act 1961 repealed w.e.f. 1 April 2026. Applies to all assessments for AY 2026-27 and earlier (FY 2025-26 and earlier). For Tax Year 2026-27 onwards, see Income Tax Act 2025.]
Tax rates for AY 2026-27 (FY 2025-26) — last year under IT Act 1961 — under new regime (default, Section 115BAC): Up to Rs. 3,00,000 — Nil; Rs. 3,00,001 to Rs. 7,00,000 — 5%; Rs. 7,00,001 to Rs. 10,00,000 — 10%; Rs. 10,00,001 to Rs. 12,00,000 — 15%; Rs. 12,00,001 to Rs. 15,00,000 — 20%; Above Rs. 15,00,000 — 30%. Rebate u/s 87A: Rs. 25,000 for income up to Rs. 7,00,000 under new regime (nil tax effective up to Rs. 7 lakh). Under old regime: same 30% top rate; all deductions (80C, 80D, HRA, etc.) available.`,
    tags: ['income tax', 'section 4', 'tax rates', 'AY 2026-27', 'FY 2025-26', 'new regime', 'old regime', 'slabs', 'IT Act 1961', 'repealed', 'last year']
  },

  {
    id: 'it-80c', act: 'Income Tax Act 1961', section: 'Section 80C', title: 'Deductions — LIC, PPF, ELSS, NSC etc.',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section80C',
    content: `Section 80C(1): Deduction up to Rs. 1,50,000 per year for: life insurance premiums; PPF contributions; EPF contributions; approved superannuation fund; NSC subscriptions; tuition fees for max 2 children; housing loan principal repayment; ELSS mutual funds; 5-year bank FDs; Sukanya Samriddhi Yojana.
IMPORTANT: Section 80C deductions are NOT available under the new tax regime (Section 115BAC) for AY 2026-27 (IT Act 1961). Under Income Tax Act 2025 (Tax Year 2026-27 onwards), equivalent deductions are available under Schedule I — but ONLY for those opting for the old regime.`,
    tags: ['80C', 'deduction', 'income tax', 'PPF', 'LIC', 'ELSS', 'NSC', '1.5 lakh', 'old regime', 'new regime', 'IT Act 1961']
  },

  {
    id: 'it-115bac', act: 'Income Tax Act 1961', section: 'Section 115BAC', title: 'New Tax Regime — Default from FY 2023-24, Last Year FY 2025-26',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section115BAC',
    content: `Section 115BAC: New tax regime is the DEFAULT regime from AY 2024-25 (FY 2023-24) onwards as per Finance Act 2023. It was the default for the last time for AY 2026-27 (FY 2025-26) — after which the IT Act 1961 was repealed and replaced by IT Act 2025.
Deductions NOT available under new regime: 80C, 80D, 80E, HRA (Section 10(13A)), LTA, professional tax, standard deduction for business income.
Deductions AVAILABLE under new regime: Standard deduction of Rs. 75,000 for salaried/pensioners (Budget 2024); employer's NPS contribution (80CCD(2)); family pension standard deduction.
To opt for old regime: salaried individuals choose at time of filing ITR; business income taxpayers must file Form 10-IEA before due date of return (once opted out of new regime, they cannot re-enter).`,
    tags: ['new regime', 'section 115BAC', 'income tax', 'default', 'FY 2023-24', 'FY 2025-26', 'AY 2026-27', 'deductions', 'old regime', 'standard deduction', '75000', '10-IEA']
  },

  {
    id: 'it-139', act: 'Income Tax Act 1961', section: 'Section 139', title: 'Return of Income — Due Dates',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section139',
    content: `Section 139(1): Every company, firm, or individual/HUF whose total income exceeds the basic exemption limit must file a return of income by the due date. Due dates for AY 2026-27 (FY 2025-26 — last under IT Act 1961): Companies and firms requiring audit: 31 October 2026; Transfer pricing cases: 30 November 2026; Others requiring audit: 31 October 2026; Salaried/others not requiring audit: 31 July 2026.
Section 139(4): Belated return: can be filed up to 31 December of the assessment year (i.e., 31 December 2026 for AY 2026-27). Section 139(5): Revised return: can be filed up to 31 December of the assessment year or before assessment, whichever is earlier.`,
    tags: ['return', 'ITR', 'section 139', 'income tax', 'due date', '31 July', '31 October', '31 December', 'belated return', 'revised return', 'AY 2026-27']
  },

  {
    id: 'it-143', act: 'Income Tax Act 1961', section: 'Section 143', title: 'Assessment — Intimation and Scrutiny Notice',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section143',
    content: `Section 143(1): Summary assessment/intimation processed by CPC without human intervention. Adjustments permitted: arithmetical errors; incorrect claims apparent from the return; disallowance of loss without return; income appearing in Form 26AS/AIS/TIS but not in return. Time limit: within 9 months from end of the financial year in which return was filed.
Section 143(2): Scrutiny notice issued when AO has reason to believe income is understated or excessive deductions claimed. Must be issued within 3 months from end of the financial year in which the return is filed (e.g., for ITR of FY 2024-25 filed in July 2025 — scrutiny notice must be issued by 30 June 2026). If not issued within time limit, no scrutiny assessment can proceed. Failure to respond can lead to ex-parte assessment under Section 144.`,
    tags: ['assessment', 'section 143', '143(1)', '143(2)', 'income tax', 'intimation', 'scrutiny', 'notice', 'AO', 'CPC', '9 months', '3 months', '26AS', 'AIS']
  },

  {
    id: 'it-148', act: 'Income Tax Act 1961', section: 'Section 148/148A', title: 'Reassessment — Escaped Income',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section148',
    content: `Section 148A [inserted by Finance Act 2021, mandatory pre-condition before Section 148]: AO must — (a) conduct enquiry if required; (b) provide notice to show cause why Section 148 notice should not be issued; (c) consider the reply; (d) pass an order with prior approval of specified authority (PCIT/CIT) — before issuing a Section 148 notice.
Section 148(1): Before making reassessment, AO shall serve notice requiring assessee to file return, along with a copy of the Section 148A(d) order.
Time limits for reassessment (Finance Act 2021 as amended by Finance Act 2022): (i) up to 3 years from end of relevant assessment year — where escaped income is Rs. 50 lakh or less; (ii) up to 10 years from end of relevant assessment year — where escaped income is Rs. 50 lakh or more AND evidence exists of asset/expenditure not disclosed (requires PCIT/CIT approval).`,
    tags: ['reassessment', 'section 148', '148A', 'income tax', 'escaped income', '3 years', '10 years', 'notice', '50 lakh', 'PCIT', 'show cause']
  },

  {
    id: 'it-194c', act: 'Income Tax Act 1961', section: 'Section 194C', title: 'TDS on Contractor Payments [Replaced by Section 393, IT Act 2025 from Tax Year 2026-27]',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section194C',
    content: `[STATUS: Section 194C applies up to AY 2026-27 (FY 2025-26). From Tax Year 2026-27 onwards, replaced by Section 393 of Income Tax Act 2025. Rates and thresholds are identical.]
Section 194C(1): TDS on payments to resident contractors — 1% for individuals/HUF; 2% for others. Threshold: single payment > Rs. 30,000 OR aggregate in a year > Rs. 1,00,000.
Section 194C(5): No TDS if goods carriage owner furnishes PAN.
TDS deposit due: 7th of next month (30th April for March). Failure to deduct/deposit: disallowance of 30% of expense under Section 40(a)(ia). Section 201: treated as assessee-in-default with interest at 1%/1.5% per month.`,
    tags: ['TDS', 'section 194C', 'section 393', 'contractor', 'income tax', '1%', '2%', '30000', '1 lakh', 'IT Act 2025', '40(a)(ia)', 'section 201']
  },

  {
    id: 'it-234', act: 'Income Tax Act 1961', section: 'Section 234A/B/C', title: 'Interest for Late Return and Advance Tax Defaults',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section234A',
    content: `Section 234A: Interest at 1% per month (simple) for delay in filing return — from day after due date to date of filing (or date of assessment if no return filed).
Section 234B: Interest at 1% per month if advance tax paid is less than 90% of assessed tax — on the shortfall, from 1 April of assessment year to date of assessment.
Section 234C: Interest at 1% per month for deferment of advance tax installments. Installment schedule: 15 June (15% of tax), 15 September (45%), 15 December (75%), 15 March (100%). Interest levied on shortfall at each due date.`,
    tags: ['interest', 'section 234', '234A', '234B', '234C', 'income tax', 'advance tax', 'return', 'default', '1%', 'delay', 'deferment']
  },

  {
    id: 'it-270a', act: 'Income Tax Act 1961', section: 'Section 270A', title: 'Penalty for Underreporting and Misreporting of Income',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section270A',
    content: `Section 270A [applicable from AY 2017-18 onwards — replaces Section 271(1)(c) for AY 2017-18 onwards]: Penalty for underreporting of income: 50% of tax payable on under-reported income. Penalty for misreporting of income: 200% of tax payable on misreported income. Misreporting includes: misrepresentation or suppression of facts; failure to record investments in books; claim of expenditure not substantiated by evidence; false entry in books; failure to report international transactions.
Note: Section 271(1)(c) still applies for AY 2016-17 and earlier — penalty 100% to 300% of tax sought to be evaded.`,
    tags: ['penalty', 'section 270A', 'section 271', 'income tax', 'underreporting', 'misreporting', '50%', '200%', 'AY 2017-18', 'concealment']
  },

  {
    id: 'it-263', act: 'Income Tax Act 1961', section: 'Section 263', title: 'Revision by Commissioner — Erroneous and Prejudicial Orders',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section263',
    content: `Section 263(1): The Principal Commissioner or Commissioner may call for and examine the record of any proceeding and, if the order is erroneous AND prejudicial to the interests of revenue, may pass such order as the circumstances justify — after giving the assessee an opportunity of being heard.
Time limit: 2 years from the end of the financial year in which the order sought to be revised was passed.
Key condition (both must coexist): The order must be BOTH erroneous AND prejudicial to revenue — as confirmed by the Supreme Court in Malabar Industrial Co. Ltd. v. CIT [2000] 243 ITR 83 (SC). If the AO has adopted one of two permissible views, the order cannot be revised under Section 263 merely because the Commissioner would have taken a different view.`,
    tags: ['revision', 'section 263', 'commissioner', 'income tax', 'erroneous', 'prejudicial', '2 years', 'PCIT', 'Malabar Industrial']
  },

  {
    id: 'it-56', act: 'Income Tax Act 1961', section: 'Section 56(2)(x)', title: 'Gift Tax — Receipt of Money/Property Without Adequate Consideration',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section56',
    content: `Section 56(2)(x) [applicable from 1 April 2017]: Taxable when any person receives: (a) money without consideration aggregate > Rs. 50,000 — whole amount taxable; (b) immovable property without consideration — stamp duty value > Rs. 50,000 taxable; or for inadequate consideration — excess of stamp duty value over consideration > Rs. 50,000 or 10% of consideration (whichever is higher), the excess is taxable; (c) movable property without consideration — FMV > Rs. 50,000 taxable; for inadequate consideration — excess of FMV over consideration > Rs. 50,000 taxable.
Exemptions: gifts from relatives (spouse, siblings, lineal ascendants/descendants, their spouses); gifts on occasion of marriage; gifts under will/inheritance; gifts in contemplation of death; gifts from local authority or registered trust.`,
    tags: ['gift tax', 'section 56', '56(2)(x)', 'income from other sources', 'immovable property', 'stamp duty', '50000', 'relatives', 'marriage', 'FMV']
  },

  // ══════════════════════════════════════════
  // INCOME TAX ACT 2025
  // STATUS: IN FORCE from 1 April 2026 (Tax Year 2026-27 onwards)
  // Source: https://incometaxindia.gov.in/pages/acts/income-tax-act-2025.aspx
  // ══════════════════════════════════════════

  {
    id: 'nit-overview', act: 'Income Tax Act 2025', section: 'Overview', title: 'Income Tax Act 2025 — In Force from 1 April 2026',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act-2025.aspx',
    content: `The Income Tax Act 2025 received Presidential assent on 13 February 2025. It is IN FORCE from 1 April 2026 — i.e., for Tax Year 2026-27 (which is the current year as of May 2026) and all subsequent tax years. It replaces the Income Tax Act 1961.
Key changes: (1) "Tax Year" replaces both "previous year" and "assessment year" — Tax Year 2026-27 = FY 2026-27; (2) Simplified language — provisos and Explanations converted into sub-sections; (3) Sections reduced from ~800 to ~536; (4) Schedule I replaces Chapter VIA deductions (80C, 80D etc.); (5) Substantive law (rates, exemptions, deductions) carried over from IT Act 1961.
Tax rates under new regime (default) for Tax Year 2026-27: Up to Rs. 4,00,000 — Nil; Rs. 4,00,001 to Rs. 8,00,000 — 5%; Rs. 8,00,001 to Rs. 12,00,000 — 10%; Rs. 12,00,001 to Rs. 16,00,000 — 15%; Rs. 16,00,001 to Rs. 20,00,000 — 20%; Rs. 20,00,001 to Rs. 24,00,000 — 25%; Above Rs. 24,00,000 — 30%.
Rebate under Section 87A (IT Act 2025): Tax rebate up to Rs. 60,000 — effectively nil tax for income up to Rs. 12,00,000 under the new regime. Standard deduction for salaried: Rs. 75,000.`,
    tags: ['income tax act 2025', 'new IT act', 'tax year', 'Tax Year 2026-27', 'in force', '1 April 2026', 'new regime', 'slabs', '12 lakh', '4 lakh', 'rebate', '60000', 'standard deduction', 'Schedule I', 'simplified']
  },

  {
    id: 'nit-tds-393', act: 'Income Tax Act 2025', section: 'Section 393', title: 'TDS on Contracts — Replaces Section 194C from Tax Year 2026-27',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act-2025.aspx',
    content: `Section 393 of the Income Tax Act 2025 replaces Section 194C of the IT Act 1961 for Tax Year 2026-27 onwards. It consolidates TDS on contractor payments. Rates: 1% for individuals/HUF; 2% for others. Thresholds: same as Section 194C — single payment > Rs. 30,000 or aggregate > Rs. 1,00,000. The consolidation under IT Act 2025 brings TDS provisions (previously spread across Sections 194A to 194S of IT Act 1961) into a unified chapter. Compliance obligations — deduction timing, deposit by 7th of next month, issuance of TDS certificate — remain the same.`,
    tags: ['section 393', 'TDS', 'contractor', 'income tax act 2025', '1%', '2%', 'Tax Year 2026-27', 'replaces 194C', 'new IT act']
  },

  {
    id: 'nit-schedule1', act: 'Income Tax Act 2025', section: 'Schedule I', title: 'Deductions — Replaces Chapter VIA (80C, 80D etc.) Under IT Act 2025',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act-2025.aspx',
    content: `Schedule I of the Income Tax Act 2025 replaces Chapter VIA deductions (80C, 80D, 80E, 80G etc.) for Tax Year 2026-27 onwards. The deduction limits and eligibility conditions are substantially the same as under IT Act 1961. Key deductions under Schedule I (old regime only): Rs. 1,50,000 for life insurance/PPF/ELSS/NSC/FD (equivalent of old 80C); Rs. 25,000-50,000 for health insurance (equivalent of old 80D); deductions for education loan interest, charitable donations, NPS contributions. New regime taxpayers: Schedule I deductions not available, EXCEPT employer NPS contribution (Section 80CCD(2) equivalent) and standard deduction of Rs. 75,000.`,
    tags: ['Schedule I', 'deductions', 'income tax act 2025', '80C', '80D', 'chapter VIA', 'old regime', 'new regime', 'Tax Year 2026-27', 'NPS', '75000', '1.5 lakh']
  },

  // ══════════════════════════════════════════
  // COMPANIES ACT 2013
  // Source: https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html
  // ══════════════════════════════════════════

  {
    id: 'ca-2', act: 'Companies Act 2013', section: 'Section 2', title: 'Key Definitions — Private Company, OPC, Subsidiary',
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 2(68): "private company" — restricts transfer of shares; limits members to 200 (excluding employee-members); prohibits public invitation to subscribe for securities. Section 2(71): "public company" — not a private company; has minimum paid-up share capital as prescribed. Section 2(62): "One Person Company (OPC)" — a company having only one person as its member. Section 2(87): "subsidiary company" — where the holding company controls composition of Board of Directors, OR exercises or controls more than half the total voting power. Section 2(46): "holding company" — a company of which another company is a subsidiary. Section 2(6): "associate company" — where a company has significant influence (at least 20% of total voting power or control of business decisions under an agreement) but is not a subsidiary.`,
    tags: ['definition', 'private company', 'public company', 'OPC', 'one person company', 'section 2(68)', 'companies act', 'subsidiary', 'holding company', 'associate company']
  },

  {
    id: 'ca-96', act: 'Companies Act 2013', section: 'Section 96', title: 'Annual General Meeting (AGM)',
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 96(1): Every company (other than OPC) must hold an Annual General Meeting each year. Frequency: not more than 15 months between two consecutive AGMs. First AGM: within 9 months from close of first financial year (by 31 December for companies incorporated before 1 April). Subsequent AGMs: within 6 months from close of financial year (by 30 September). Section 96(2): AGM must be held between 9 AM and 6 PM on a non-National Holiday, at or near the registered office location. After Companies (Amendment) Act 2020: virtual AGMs (through VC/OAVM) made permanently permissible for unlisted companies; listed companies can hold hybrid AGMs. Penalty for default (Section 99): company and every officer in default — fine up to Rs. 1,00,000, plus Rs. 5,000 per day of continuing default.`,
    tags: ['AGM', 'annual general meeting', 'section 96', 'companies act', '9 months', '6 months', '15 months', 'first AGM', 'penalty', 'virtual AGM', 'OPC']
  },

  {
    id: 'ca-134', act: 'Companies Act 2013', section: 'Section 134', title: "Board's Report and Financial Statements",
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 134(1): Financial statements must be approved by the Board and signed by at least two directors (one being MD), CEO (if director), CFO, and Company Secretary (wherever appointed). Section 134(3): Board Report must include — (a) web address of annual return; (b) number of Board meetings; (c) Directors' Responsibility Statement; (d) declaration by independent directors; (e) performance evaluation details (for applicable companies); (f) details of frauds reported by auditors; (g) explanation on qualifications in auditor's report; (h) related party transactions; (i) CSR report (for applicable companies); (j) details of loans/guarantees/investments under Section 186. Penalty Section 134(8): company — fine Rs. 3,00,000 to Rs. 50,00,000; officer in default — imprisonment up to 3 years or fine Rs. 50,000 to Rs. 5,00,000 or both.`,
    tags: ['board report', 'financial statement', 'section 134', 'companies act', 'directors responsibility', 'annual report', 'CFO', 'CS', 'penalty', 'CSR', 'related party']
  },

  {
    id: 'ca-139', act: 'Companies Act 2013', section: 'Section 139', title: 'Appointment and Rotation of Auditors',
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 139(1): Every company shall appoint an individual or firm as statutory auditor at the first AGM, who holds office till conclusion of the sixth AGM (i.e., 5 years), and thereafter till the conclusion of every sixth meeting (renewable for one more term of 5 years). Section 139(2): Mandatory auditor rotation for: listed companies; unlisted public companies with paid-up capital ≥ Rs. 10 crore; private companies with paid-up capital ≥ Rs. 50 crore; companies with public borrowings/deposits ≥ Rs. 50 crore. Individual auditor: maximum 1 term of 5 consecutive years. Audit firm: maximum 2 terms of 5 consecutive years (10 years total). Cooling-off period: 5 years after completing maximum tenure before re-appointment. First auditor: appointed by Board within 30 days of incorporation; if Board fails, members appoint in EGM within 90 days.`,
    tags: ['auditor', 'section 139', 'companies act', 'rotation', 'audit firm', '5 years', '10 years', 'cooling off', 'listed company', 'appointment', 'first auditor', '30 days']
  },

  {
    id: 'ca-185', act: 'Companies Act 2013', section: 'Section 185', title: 'Prohibition on Loans to Directors',
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 185(1): No company shall directly or indirectly advance any loan to, or give guarantee or security for any loan taken by — any director of the company or its holding company; any partner or relative of such director; any firm in which such director or relative is a partner.
Section 185(2): Exceptions — loans to subsidiaries for their principal business activities, if approved by special resolution with full disclosure in the explanatory statement. Loans to MD/WTD as part of service conditions (approved by shareholders or as a service condition prescribed under the Act) are also excepted.
Penalty: Company — fine Rs. 5,00,000 to Rs. 25,00,000; Director/officer in default — imprisonment up to 6 months OR fine Rs. 5,00,000 to Rs. 25,00,000, or both.`,
    tags: ['loan to director', 'section 185', 'companies act', 'prohibition', 'guarantee', 'security', 'special resolution', 'penalty', 'MD', 'WTD']
  },

  {
    id: 'ca-188', act: 'Companies Act 2013', section: 'Section 188', title: 'Related Party Transactions',
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 188(1): No company shall enter into any contract or arrangement with a related party for: sale/purchase/supply of goods or materials; selling/buying property; leasing of property; availing/rendering services; appointment of agent; appointment to office or place of profit; underwriting of securities — without Board consent by resolution at a Board meeting.
Threshold requiring shareholder approval (ordinary resolution for non-listed; special resolution for listed per SEBI LODR): as prescribed under Rule 15 of Companies (Meetings of Board and its Powers) Rules 2014. For listed companies (SEBI LODR Regulation 23): shareholder approval (majority of minority) required where RPT exceeds 10% of annual consolidated turnover or Rs. 1,000 crore, whichever is lower. Interested directors cannot vote.
Penalty Section 188(5): for listed companies — fine Rs. 25,00,000 to Rs. 5,00,00,000; for others — fine Rs. 25,000 to Rs. 5,00,000. Directors/officers: fine Rs. 25,000 to Rs. 5,00,000.`,
    tags: ['related party', 'section 188', 'companies act', 'RPT', 'board approval', 'special resolution', 'listed', 'SEBI', 'penalty', 'LODR', '10%', '1000 crore']
  },

  // ══════════════════════════════════════════
  // INDIAN CONTRACT ACT 1872
  // Source: https://legislative.gov.in/sites/default/files/A1872-09.pdf
  // ══════════════════════════════════════════

  {
    id: 'ica-10', act: 'Indian Contract Act 1872', section: 'Section 10', title: 'What Agreements are Contracts — Essentials of a Valid Contract',
    source: 'https://legislative.gov.in/sites/default/files/A1872-09.pdf',
    content: `Section 10: All agreements are contracts if made by free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not expressly declared void. Section 11: Competent to contract = (i) age of majority (18 years); (ii) sound mind; (iii) not disqualified by law. Section 13: Consent = parties agree on the same thing in the same sense. Section 14: Free consent = not caused by coercion (Section 15), undue influence (Section 16), fraud (Section 17), misrepresentation (Section 18), or mistake (Sections 20-22). Contract caused by coercion/fraud/misrepresentation: voidable at option of the aggrieved party. Contract caused by mutual mistake as to matter of fact: void.`,
    tags: ['contract', 'section 10', 'contract act', 'agreement', 'consent', 'consideration', 'object', 'competent', 'free consent', 'valid contract', 'voidable', 'void', 'majority', 'sound mind']
  },

  {
    id: 'ica-73-74', act: 'Indian Contract Act 1872', section: 'Section 73 & 74', title: 'Compensation for Breach of Contract — Damages',
    source: 'https://legislative.gov.in/sites/default/files/A1872-09.pdf',
    content: `Section 73: When a contract is broken, the party who suffers is entitled to receive compensation for loss or damage which — naturally arose in the usual course of things from the breach; OR which the parties knew at time of contract to be likely to result from the breach. Compensation NOT given for remote or indirect loss. Duty to mitigate: the injured party must take reasonable steps to reduce the loss; compensation not recoverable for loss that could have been avoided.
Section 74: Where a sum is named in the contract as the amount to be paid in case of breach, or any other stipulation by way of penalty, the party complaining of breach is entitled to receive reasonable compensation not exceeding the amount so named. Key principle (confirmed by Supreme Court): courts award only reasonable compensation — not necessarily the full penalty amount stipulated, even if the contract labels it as "liquidated damages".`,
    tags: ['breach', 'compensation', 'damages', 'section 73', 'section 74', 'contract act', 'mitigation', 'penalty', 'liquidated damages', 'natural consequences', 'reasonable compensation']
  },

  {
    id: 'ica-17', act: 'Indian Contract Act 1872', section: 'Section 17', title: 'Fraud — Definition and Effect',
    source: 'https://legislative.gov.in/sites/default/files/A1872-09.pdf',
    content: `Section 17: "Fraud" means: (1) suggestion as a fact of that which is not true, by one who does not believe it to be true; (2) active concealment of a fact by one having knowledge; (3) a promise made without any intention of performing it; (4) any other act fitted to deceive; (5) any act or omission declared fraudulent by law. Explanation: Mere silence as to facts is NOT fraud, unless there is a duty to speak, or silence is equivalent to speech (e.g., fiduciary relationships, uberrimae fidei contracts like insurance). Effect: contract caused by fraud is voidable at the option of the party defrauded (Section 19). The defrauded party may affirm the contract or rescind it. Rescission must be exercised within a reasonable time and before third-party rights accrue.`,
    tags: ['fraud', 'section 17', 'contract act', 'misrepresentation', 'voidable', 'concealment', 'silence', 'intent to deceive', 'rescission', 'fiduciary', 'insurance']
  },

  // ══════════════════════════════════════════
  // ARBITRATION AND CONCILIATION ACT 1996
  // Source: https://legislative.gov.in/sites/default/files/A1996-26.pdf
  // ══════════════════════════════════════════

  {
    id: 'arb-7', act: 'Arbitration and Conciliation Act 1996', section: 'Section 7 & 8', title: 'Arbitration Agreement — Definition and Effect',
    source: 'https://legislative.gov.in/sites/default/files/A1996-26.pdf',
    content: `Section 7(1): "Arbitration agreement" means an agreement by parties to submit to arbitration all or certain disputes which have arisen or which may arise in respect of a defined legal relationship. Section 7(3): Arbitration agreement must be in writing. Section 7(4): "In writing" includes — document signed by parties; exchange of letters/telex/telegrams/electronic communication providing a record; exchange of statements of claim and defence where existence of agreement is alleged by one and not denied by the other.
Section 8: Where a party to an arbitration agreement brings a matter before a judicial authority, the other party may, not later than submitting its first statement on the substance of the dispute, apply to the court to refer the parties to arbitration. The court shall refer the parties to arbitration unless it finds prima facie that no valid arbitration agreement exists. The court cannot examine the merits of the dispute at this stage.`,
    tags: ['arbitration agreement', 'section 7', 'section 8', 'arbitration act', 'writing', 'reference to arbitration', 'stay of proceedings', 'judicial authority', 'prima facie']
  },

  {
    id: 'arb-11', act: 'Arbitration and Conciliation Act 1996', section: 'Section 11 & 29A', title: 'Appointment of Arbitrators and Time Limits',
    source: 'https://legislative.gov.in/sites/default/files/A1996-26.pdf',
    content: `Section 11(6): Where appointment procedure agreed upon by parties fails, either party may apply to the Supreme Court (international commercial arbitration) or High Court (domestic arbitration) for appointment. Section 11(6A) [2015 amendment]: Court shall confine itself to examination of the existence of an arbitration agreement only — it shall not examine merits.
Section 29A [inserted by 2015 amendment, amended by 2019 amendment]: Time limit for completing arbitral proceedings — 12 months from date of completion of pleadings (parties' last written submission). Extensions: 6 months by consent of parties (total 18 months); beyond 18 months only by court order on showing sufficient cause (court may impose terms, including fee reduction). If proceedings not completed within time — mandate of arbitrator terminates unless court extends. Fast-track procedure under Section 29B: arbitrator decides on documents only, target 6 months.`,
    tags: ['arbitrator', 'appointment', 'section 11', 'section 29A', 'arbitration', 'high court', 'supreme court', '12 months', '18 months', 'time limit', 'fast track', '29B']
  },

  {
    id: 'arb-34', act: 'Arbitration and Conciliation Act 1996', section: 'Section 34', title: 'Setting Aside Arbitral Award — Limited Grounds',
    source: 'https://legislative.gov.in/sites/default/files/A1996-26.pdf',
    content: `Section 34(2): An arbitral award may be set aside ONLY if — (a) the party proves: (i) incapacity of a party; (ii) arbitration agreement is not valid; (iii) party not given proper notice of appointment or proceedings; (iv) award deals with disputes beyond scope of submission; (v) composition of tribunal was improper; (b) the Court finds: (i) subject matter not capable of arbitration under law; (ii) award conflicts with public policy of India.
Section 34(3): Application must be filed within 3 months from date of receipt of award. Court may extend by 30 days on showing sufficient cause — but NOT beyond 30 days. This time limit is strict.
Explanation 2 [2015 amendment — narrowed public policy]: Award is against public policy ONLY if: induced by fraud or corruption; in contravention of fundamental policy of Indian law; in conflict with most basic notions of morality or justice. Courts CANNOT re-examine the merits of the dispute while deciding a Section 34 application.`,
    tags: ['set aside', 'section 34', 'arbitration', 'arbitral award', 'public policy', '3 months', '30 days', 'incapacity', 'scope', 'fraud', 'merits review', 'fundamental policy']
  },

  // ══════════════════════════════════════════
  // TRANSFER PRICING — IT Act 1961 Sections 92-92F
  // (Governs until Tax Year 2025-26; carried over in IT Act 2025)
  // ══════════════════════════════════════════

  {
    id: 'tp-92', act: 'Income Tax Act 1961', section: 'Sections 92–92F', title: 'Transfer Pricing — International Transactions',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section92',
    content: `Section 92(1): Income from international transactions between associated enterprises shall be computed having regard to the arm's length price (ALP). Section 92B: "International transaction" = transaction between two or more associated enterprises, either or both of whom are non-residents. Section 92C: ALP to be determined by the most appropriate method from: (a) Comparable Uncontrolled Price (CUP); (b) Resale Price Method (RPM); (c) Cost Plus Method (CPM); (d) Profit Split Method (PSM); (e) Transactional Net Margin Method (TNMM); (f) any other method as prescribed.
Section 92E: Every person who has entered into an international transaction or specified domestic transaction must obtain a report from a Chartered Accountant (Form 3CEB) and furnish it by the due date of return. Threshold: aggregate international transactions > Rs. 1 crore.
Penalties: Section 271AA — 2% of value of each international transaction for failure to maintain documentation; Section 271G — 2% of value for failure to furnish information; Section 271BA — Rs. 1,00,000 for failure to furnish Form 3CEB. Safe harbour: Rule 10TD — IT/ITES: 17-18% operating profit margin; KPO: 18%; corporate guarantee: 1% per annum.`,
    tags: ['transfer pricing', 'section 92', 'international transaction', 'income tax', 'ALP', 'arm length', 'associated enterprises', 'TNMM', 'CUP', 'Form 3CEB', 'safe harbour', '2%']
  },

  // ══════════════════════════════════════════
  // GST — ADDITIONAL HIGH-VALUE SECTIONS
  // ══════════════════════════════════════════

  {
    id: 'cgst-10', act: 'CGST Act 2017', section: 'Section 10', title: 'Composition Levy — Small Taxpayers',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter3/section10_v1.00.html',
    content: `Section 10(1): Registered persons with aggregate turnover ≤ Rs. 1.5 crore (Rs. 75 lakh for special category states) may opt for composition scheme. Tax rates: manufacturers — 1% of turnover; restaurants — 5%; traders — 1%. Section 10(2A): Service providers (other than restaurants) with turnover ≤ Rs. 50 lakh may pay 6% tax under composition-like scheme. Restrictions: composition dealer CANNOT collect GST from customers; claim ITC; make inter-State supplies; supply through e-commerce operators (except restaurants). Must file CMP-08 quarterly and GSTR-4 annually. If turnover exceeds limit during year, liability arises from the day of excess.`,
    tags: ['composition', 'section 10', 'GST', '1.5 crore', '75 lakh', 'small taxpayer', 'restaurant', '5%', '1%', 'CMP-08', 'GSTR-4', 'inter-state', 'ITC blocked']
  },

  {
    id: 'cgst-31', act: 'CGST Act 2017', section: 'Section 31', title: 'Tax Invoice — Mandatory Requirements and E-Invoicing',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter7/section31_v1.00.html',
    content: `Section 31(1): Registered supplier of taxable goods must issue a tax invoice before or at the time of supply. Section 31(2): For services — invoice within 30 days of supply (45 days for banking/insurance). Mandatory particulars (Rule 46): GSTIN of supplier and recipient; invoice number; date; HSN/SAC code (4-digit for turnover > Rs. 5 crore; 6-digit for > Rs. 50 crore); taxable value; rate and amount of CGST/SGST/IGST; place of supply; whether RCM applicable. E-invoicing mandatory (Rule 48(4)) for all registered persons with aggregate turnover > Rs. 5 crore — IRN (Invoice Reference Number) from IRP is mandatory. Failure to issue e-invoice when required: invoice is not a valid document for ITC purposes.`,
    tags: ['invoice', 'section 31', 'tax invoice', 'GST', 'e-invoice', 'IRN', 'IRP', '5 crore', 'HSN', 'SAC', 'mandatory', '30 days', '45 days', 'bill of supply']
  },

  {
    id: 'cgst-68', act: 'CGST Act 2017', section: 'Section 68', title: 'E-Way Bill — Movement of Goods',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter14/section68_v1.00.html',
    content: `Section 68 read with Rule 138: E-way bill required for movement of goods where consignment value > Rs. 50,000. Who generates: supplier (if registered), transporter, or recipient (if supplier is unregistered). Validity: up to 100 km — 1 day; 100–300 km — 3 days; every additional 200 km — 1 additional day. Exemptions: goods transported by non-motorized conveyance; customs-sealed containers; movement within 50 km between business place and weighbridge. Consequence of non-compliance: detention under Section 129; penalty = 200% of tax. Blocking of e-way bill: taxpayers who have not filed two consecutive GSTR-3B returns are blocked from generating e-way bills.`,
    tags: ['e-way bill', 'section 68', 'GST', 'rule 138', '50000', 'movement of goods', 'validity', '1 day', 'ODC', 'detention', 'penalty', 'section 129', 'GSTR-3B', 'blocking']
  },

  {
    id: 'cgst-97', act: 'CGST Act 2017', section: 'Section 97', title: 'Advance Ruling — Application and Binding Nature',
    source: 'https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter17/section97_v1.00.html',
    content: `Section 97: Any registered person or a person desirous of obtaining registration may seek an Advance Ruling on: classification of goods/services; applicable rate of tax; ITC admissibility; determination of time/place/value of supply; registration requirement. Application: Form GST ARA-01, fee Rs. 5,000. Authority for Advance Ruling (AAR): State/UT-level; ruling pronounced within 90 days. Appeal: to Appellate Authority for Advance Ruling (AAAR) within 30 days. Binding nature: ruling binds ONLY the applicant and jurisdictional GST officers for that applicant's transactions — does NOT bind other taxpayers. If obtained by fraud/misrepresentation — void ab initio.`,
    tags: ['advance ruling', 'section 97', 'GST', 'AAR', 'AAAR', 'classification', 'rate', 'ITC', 'ARA-01', '5000', '90 days', '30 days', 'binding', 'registration']
  },

  // ══════════════════════════════════════════
  // INCOME TAX ACT 2025
  // ══════════════════════════════════════════

  {
    id: 'it2025-overview', act: 'Income Tax Act 2025', section: 'Overview', title: 'New IT Act 2025 — Structure, Effective Date, Key Changes',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act-2025.aspx',
    content: `Income Tax Act 2025 received Presidential assent on 13 February 2025 and is effective from 1 April 2026 (Tax Year 2026-27 onwards). Replaces the Income Tax Act 1961. Key structural changes: (1) "Assessment Year" renamed "Tax Year" — Tax Year 2026-27 = FY 2026-27. (2) Sections renumbered — scrutiny notice (old 143(2)) = new Section 144; reassessment (old 148) = new Section 149; deductions (old 80C) = Schedule I. (3) New regime (equivalent of 115BAC) is the default — called "normal provisions." (4) Standard deduction for salaried persons: Rs. 75,000. (5) Language simplified and consolidated. All pending assessments for AY 2026-27 and earlier continue under IT Act 1961.`,
    tags: ['IT Act 2025', 'income tax act 2025', 'new act', '1 April 2026', 'tax year', 'section 144', 'section 149', 'schedule I', 'normal provisions', 'standard deduction', 'renumbered']
  },

  {
    id: 'it2025-rates', act: 'Income Tax Act 2025', section: 'Schedule I / Part I', title: 'Tax Rates for Tax Year 2026-27 — IT Act 2025 (Nil Tax Up to Rs. 12 Lakh)',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act-2025.aspx',
    content: `Tax rates under Income Tax Act 2025 for Tax Year 2026-27 (default/normal regime): Up to Rs. 4,00,000 — Nil (threshold raised from Rs. 3 lakh); Rs. 4,00,001–8,00,000 — 5%; Rs. 8,00,001–12,00,000 — 10%; Rs. 12,00,001–16,00,000 — 15%; Rs. 16,00,001–20,00,000 — 20%; Rs. 20,00,001–24,00,000 — 25%; Above Rs. 24,00,000 — 30%. Rebate: Rs. 60,000 for income up to Rs. 12,00,000 under normal regime — effective nil tax up to Rs. 12 lakh (Budget 2025). Surcharge: 10% for income > Rs. 50 lakh; 15% for > Rs. 1 crore; 25% for > Rs. 2 crore (capped at 15% for specified income). Health and Education Cess: 4%.`,
    tags: ['tax rates', 'IT Act 2025', 'schedule I', 'normal provisions', 'new regime', 'slabs', 'tax year 2026-27', '4 lakh', '12 lakh', 'nil tax', 'rebate', 'surcharge', '4%', 'cess', 'Budget 2025']
  },

  // ══════════════════════════════════════════
  // TDS ADDITIONAL SECTIONS
  // ══════════════════════════════════════════

  {
    id: 'it-194', act: 'Income Tax Act 1961', section: 'Sections 194A / 194I / 194J / 194Q', title: 'TDS on Interest, Rent, Professional Fees, and Goods Purchase',
    source: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx#section194A',
    content: `Section 194A: TDS on interest (other than bank): 10%; threshold Rs. 5,000. Bank interest (194A): 10%; threshold Rs. 40,000 (Rs. 50,000 for senior citizens). Section 194I: TDS on rent — plant/machinery: 2%; land/building/furniture: 10%; threshold Rs. 2,40,000/year. Section 194J: TDS on professional/technical services — 10% (professionals); 2% (technical services, call centres); threshold Rs. 30,000. No threshold for directors' fees. Section 194Q (from 1 July 2021): Buyer deducts TDS at 0.1% on goods purchase > Rs. 50 lakh/year from resident seller (buyer's turnover > Rs. 10 crore). Section 195: Payments to non-residents — 20% or as per DTAA (whichever lower). All TDS certificates: Form 16/16A.`,
    tags: ['TDS', 'section 194A', '194I', '194J', '194Q', 'section 195', 'income tax', 'interest', 'rent', 'professional fees', '10%', '2%', 'threshold', 'Form 16', 'non-resident', 'DTAA', '50 lakh']
  },

  // ══════════════════════════════════════════
  // COMPANIES ACT 2013 — FRAUD AND WINDING UP
  // ══════════════════════════════════════════

  {
    id: 'ca-447', act: 'Companies Act 2013', section: 'Section 447', title: 'Fraud — Definition and Criminal Punishment',
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 447 [Companies (Amendment) Act 2017]: "Fraud" = any act, omission, concealment of fact or abuse of position with intent to deceive, gain undue advantage, or injure the company/shareholders/creditors — whether or not there is wrongful gain or loss. Punishment: imprisonment 6 months–10 years AND fine equal to amount of fraud (minimum Rs. 1 lakh). If fraud involves public interest or ≥ Rs. 10 crore: minimum imprisonment 3 years. Section 211: SFIO (Serious Fraud Investigation Office) investigates complex fraud — has power to arrest and prosecute under Section 447. Conviction under Section 447 disqualifies a person from being a director under Section 164(1)(d).`,
    tags: ['fraud', 'section 447', 'companies act', 'punishment', 'imprisonment', 'fine', 'SFIO', 'section 211', 'director disqualification', '10 crore', 'public interest']
  },

  {
    id: 'ca-271', act: 'Companies Act 2013', section: 'Section 271', title: 'Winding Up — Circumstances (Compulsory)',
    source: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html?act=NTk2MQ==',
    content: `Section 271: Company may be wound up by the NCLT Tribunal if: (a) special resolution to wind up; (b) company acted against sovereignty/security of India; (c) Tribunal satisfied it is just and equitable to wind up; (d) default in filing financial statements or annual returns for 5 consecutive years; (e) unable to pay its debts. Section 272: Company deemed unable to pay debts if — creditor's unpaid debt > Rs. 1 lakh for 21 days after demand; or court execution returned unsatisfied. Note: Since IBC 2016, insolvency for companies primarily goes before NCLT under IBC. Winding up under Companies Act is now mainly for solvent companies (voluntary) or just-and-equitable cases.`,
    tags: ['winding up', 'section 271', 'companies act', 'NCLT', 'just and equitable', 'unable to pay debts', '1 lakh', '21 days', 'IBC', 'insolvency', 'Section 272', '5 years']
  },

  // ══════════════════════════════════════════
  // INSOLVENCY AND BANKRUPTCY CODE 2016
  // ══════════════════════════════════════════

  {
    id: 'ibc-7', act: 'Insolvency and Bankruptcy Code 2016', section: 'Section 7', title: 'CIRP Initiation by Financial Creditor',
    source: 'https://ibbi.gov.in/uploads/legalframwork/IBC%202016.pdf',
    content: `Section 7: A financial creditor may file before NCLT for initiating CIRP against a corporate debtor when a default has occurred. Minimum default threshold: Rs. 1 crore (as of May 2026). NCLT must admit or reject within 14 days. Default = non-payment of debt when due. On admission: moratorium declared under Section 14 — all suits, recovery, enforcement of security suspended. IRP appointed. Financial creditor includes bank, NBFC, debenture-holder, home buyers (treated as financial creditors per Supreme Court in Pioneer Urban Land case). Promoter's personal guarantee can be invoked simultaneously under Section 60.`,
    tags: ['CIRP', 'section 7', 'IBC', 'financial creditor', 'default', 'NCLT', '1 crore', 'moratorium', 'section 14', 'IRP', 'insolvency', 'home buyers', 'Pioneer Urban', 'NPA']
  },

  {
    id: 'ibc-9', act: 'Insolvency and Bankruptcy Code 2016', section: 'Section 9', title: 'CIRP Initiation by Operational Creditor',
    source: 'https://ibbi.gov.in/uploads/legalframwork/IBC%202016.pdf',
    content: `Section 9: An operational creditor (supplier of goods/services, employee, government) may initiate CIRP after: (a) delivering a demand notice (Form B); (b) if the debtor does not pay OR dispute the debt within 10 days. Minimum default: Rs. 1 crore. Key difference from Section 7: must first issue demand notice and wait 10 days. Pre-existing dispute is a complete defence — if corporate debtor shows a genuine dispute existed before the notice, NCLT must reject. Section 8: Demand notice procedure — operational creditor sends notice; corporate debtor has 10 days to pay or show dispute (supported by prior correspondence).`,
    tags: ['CIRP', 'section 9', 'IBC', 'operational creditor', 'demand notice', '10 days', 'dispute', 'section 8', 'NCLT', '1 crore', 'supplier', 'employee', 'pre-existing dispute']
  },

  {
    id: 'ibc-29a', act: 'Insolvency and Bankruptcy Code 2016', section: 'Section 29A', title: 'Ineligibility of Resolution Applicants — NPA Promoter Bar',
    source: 'https://ibbi.gov.in/uploads/legalframwork/IBC%202016.pdf',
    content: `Section 29A: Persons ineligible to submit a resolution plan include: undischarged insolvents; wilful defaulters; convicted of offence punishable ≥ 2 years; disqualified directors under Companies Act; promoter/management of the corporate debtor or any entity with NPA for > 1 year (NPA promoter bar — prevents original defaulters from regaining control at a haircut). Guarantors of the corporate debtor are also barred. Exception: Section 240A — NPA promoter bar does NOT apply to MSME corporate debtors, allowing MSME promoters to bid for their own company.`,
    tags: ['section 29A', 'IBC', 'resolution applicant', 'ineligible', 'wilful defaulter', 'NPA', 'promoter bar', 'MSME', 'section 240A', 'guarantor', 'resolution plan', 'disqualification']
  },

  // ══════════════════════════════════════════
  // FEMA 1999
  // ══════════════════════════════════════════

  {
    id: 'fema-6', act: 'Foreign Exchange Management Act 1999', section: 'Section 6 & Master Directions', title: 'FDI, ODI, ECB — Capital Account Transactions',
    source: 'https://www.rbi.org.in/scripts/BS_FemaNotifications.aspx',
    content: `FEMA Section 6: Capital account transactions are permissible if in accordance with RBI regulations. Key regimes: (1) FDI: automatic route for most sectors; government approval for defence, media, pharma (brownfield), satellites, banking. FDI prohibited in lottery, gambling, tobacco, atomic energy. (2) ODI: Indian companies can invest abroad up to 400% of net worth under automatic route. (3) ECB: minimum average maturity 3 years for general purpose; negative list includes real estate, capital market, equity. Compounding for FEMA violations: RBI may compound on payment — penalty up to 3x sum involved or Rs. 2 lakh (whichever higher), plus Rs. 5,000/day for continuing violation.`,
    tags: ['FEMA', 'FDI', 'ODI', 'ECB', 'capital account', 'automatic route', 'government route', 'section 6', 'RBI', 'foreign investment', 'net worth', '400%', 'compounding', 'penalty', 'LLP']
  },

  // ══════════════════════════════════════════
  // MSME DELAYED PAYMENT
  // ══════════════════════════════════════════

  {
    id: 'msme-16', act: 'MSMED Act 2006', section: 'Sections 15-16', title: 'MSME Delayed Payment — 3x Bank Rate Interest + Section 43B(h) Disallowance',
    source: 'https://msme.gov.in/msmed-act',
    content: `Section 15 (MSMED Act 2006): Buyer must pay MSME supplier within agreed time or within 45 days from acceptance of goods/services (no agreement). Section 16: For non-payment within 45 days, interest = 3 times the bank rate (RBI notified) compounded monthly — cannot be waived by agreement. Section 17: Recovery through MSME Facilitation Council (MSEFC) under Section 18 — arbitration/conciliation award enforceable as decree. Section 43B(h) of IT Act 1961 (Finance Act 2023, effective FY 2023-24): Buyer's payment to MSME supplier is deductible ONLY on actual payment — if not paid within 45 days, the amount is disallowed in the year of expenditure and deductible only in the year of actual payment. This applies only if the supplier is registered under MSMED Act.`,
    tags: ['MSME', 'delayed payment', 'section 15', 'section 16', 'MSMED Act', '45 days', '3x bank rate', 'interest', 'MSEFC', 'section 43B(h)', 'IT Act', 'disallowance', 'Finance Act 2023']
  },
];

// ─── BM25 Retrieval Engine ─────────────────────────────────

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s§]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function bm25Score(query: string, chunk: LegalChunk, avgDocLen: number): number {
  const k1 = 1.5, b = 0.75;
  const queryTokens = tokenize(query);
  const docText = `${chunk.title} ${chunk.content} ${chunk.tags.join(' ')} ${chunk.section} ${chunk.act}`;
  const docTokens = tokenize(docText);
  const docLen = docTokens.length;
  const N = LEGAL_KB.length;

  const tf: Record<string, number> = {};
  for (const t of docTokens) tf[t] = (tf[t] || 0) + 1;

  const df: Record<string, number> = {};
  for (const qt of queryTokens) {
    df[qt] = LEGAL_KB.filter(c => {
      const ct = tokenize(`${c.title} ${c.content} ${c.tags.join(' ')} ${c.section} ${c.act}`);
      return ct.includes(qt);
    }).length;
  }

  let score = 0;
  for (const qt of queryTokens) {
    const f = tf[qt] || 0;
    const n = df[qt] || 0;
    const idf = Math.log((N - n + 0.5) / (n + 0.5) + 1);
    const tfNorm = (f * (k1 + 1)) / (f + k1 * (1 - b + b * (docLen / avgDocLen)));
    score += idf * tfNorm;
  }
  return score;
}

export function retrieveChunks(query: string, topK = 4): LegalChunk[] {
  const allLens = LEGAL_KB.map(c =>
    tokenize(`${c.title} ${c.content} ${c.tags.join(' ')}`).length
  );
  const avgDocLen = allLens.reduce((a, b) => a + b, 0) / allLens.length;

  const scored = LEGAL_KB.map(chunk => ({
    chunk,
    score: bm25Score(query, chunk, avgDocLen),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(s => s.score > 0.3)
    .map(s => s.chunk);
}

export function buildContext(chunks: LegalChunk[]): string {
  if (chunks.length === 0) return '';
  return chunks.map(c =>
    `[SOURCE: ${c.act} · ${c.section} · ${c.title}]\n[VERIFY AT: ${c.source}]\n${c.content}`
  ).join('\n\n---\n\n');
}
