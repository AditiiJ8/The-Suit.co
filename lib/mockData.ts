export const harveyQuotes = {
  general: [
    "The law doesn't wait. Neither should you.",
    "Every word in a contract matters. We make sure you don't miss any.",
    "In law, precision is power.",
    "Your legal strategy starts here.",
    "Knowledge is the only weapon that never dulls.",
  ],
  research: [
    "Facts are everything. Understand them completely.",
    "The ITA is your roadmap. Let's navigate it together.",
    "Compliance isn't a burden—it's your shield.",
  ],
  plainEnglish: [
    "Jargon obscures truth. We reveal it.",
    "Every Indian law simplified. Every clause decoded.",
    "Plain language, powerful understanding.",
  ],
  compliance: [
    "Deadlines missed are wars lost.",
    "Compliance creates confidence.",
    "One checklist. Zero surprises.",
  ],
};

export const researchConversations = [
  {
    id: 1,
    title: "GST ITC Eligibility",
    messages: [
      {
        type: "user",
        text: "What are the conditions for claiming ITC on capital goods under GST?",
      },
      {
        type: "ai",
        sections: [
          {
            title: "ITC on Capital Goods",
            content:
              "Input Tax Credit (ITC) on capital goods is available under Section 49 of the CGST Act, 2017, subject to the following conditions:",
            citations: ["CGST Act, Section 49"],
          },
          {
            title: "Key Eligibility Criteria",
            content:
              "The goods must be used in the course of business. The recipient must be registered under GST. The capital goods must be acquired on or after 1st July 2017.",
            citations: ["GST Rules, Rule 36"],
          },
          {
            title: "Conditions Met",
            risks: [
              { text: "Invoice properly received", risk: "LOW" },
              { text: "Goods for business use", risk: "LOW" },
              { text: "Recipient GST registered", risk: "MEDIUM" },
            ],
            citations: ["CGST Rules, 2017"],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Section 143(2) Assessment",
    messages: [
      {
        type: "user",
        text: "What rights do I have during a Section 143(2) income tax assessment?",
      },
      {
        type: "ai",
        sections: [
          {
            title: "Section 143(2) Assessment Rights",
            content:
              "A Section 143(2) assessment is an in-depth examination of your tax returns. You have the right to:",
            citations: ["Income Tax Act, Section 143(2)"],
          },
          {
            title: "Your Rights",
            content:
              "Request a copy of the notice. Submit objections within the specified time. Seek relief for unabated losses. Appeal to the CIT(A) if dissatisfied.",
            citations: ["Income Tax Rules, Rule 11"],
          },
          {
            title: "Critical Actions",
            risks: [
              { text: "Seek professional guidance", risk: "HIGH" },
              { text: "Maintain proper documentation", risk: "MEDIUM" },
              { text: "Meet filing deadlines", risk: "HIGH" },
            ],
          },
        ],
      },
    ],
  },
];

export const gstShowCauseNotice = {
  id: 1,
  title: "GST Show Cause Notice - ITC Excess Claim",
  type: "notice",
  content: `Government of India
Department of Revenue
Central Tax Office, Mumbai

Notice under Section 62(1) of the CGST Act, 2017

TO: ABC Pvt Ltd, Mumbai
AY: 2023-24

SHOW CAUSE NOTICE

Your filed GSTR-3B returns show an ITC claim of Rs. 45,00,000 on supplies to unregistered entities. As per our cross-verification with recipient records, 30% of these supplies lack proper evidence.

You are required to SHOW CAUSE within 30 days as to why penalty under Section 122 should not be imposed.

Sections Involved: 62, 122, 140 of CGST Act, 2017
REFERENCE: DRC/11/2024`,

  analysis: {
    overallRisk: "HIGH",
    riskScore: 78,
    issues: [
      {
        title: "Unsubstantiated ITC Claim",
        risk: "HIGH",
        section: "Section 62(1)",
        details:
          "ITC claimed on supplies to unregistered entities without proper evidence. This triggers audit under CGST Act.",
        keyText:
          "30% of ITC claims lack supporting documents from recipient side.",
      },
      {
        title: "Missing Recipient Confirmation",
        risk: "HIGH",
        section: "Rule 36 Compliance",
        details:
          "Recipient GSTR-1 does not reflect the supplies claimed in your GSTR-3B. Cross-verification failed.",
        keyText: "Critical gap in GSTR matching.",
      },
      {
        title: "Penalty Exposure",
        risk: "MEDIUM",
        section: "Section 122",
        details:
          "If non-compliance is established, penalty up to 10% of tax owed could be imposed.",
        keyText: "Estimated exposure: Rs. 4,50,000 (assuming 10% rate)",
      },
    ],
    missingClauses: [
      "Valid invoice-wise ITC reconciliation",
      "Recipient-side GSTR-1 confirmation",
      "Business justification for supply pattern",
    ],
    suggestedActions: [
      {
        action: "Verify with customers",
        urgency: "CRITICAL",
        deadline: "15 days",
        responsible: "Accounts Manager",
      },
      {
        action: "File written reply to SCN",
        urgency: "CRITICAL",
        deadline: "30 days",
        responsible: "Tax Consultant",
      },
      {
        action: "Collect supporting evidence",
        urgency: "CRITICAL",
        deadline: "10 days",
        responsible: "Finance Team",
      },
    ],
  },
};

export const caseResults = [
  {
    id: 1,
    caseTitle:
      "Tata Consultancy Services Ltd. v. Union of India (2004 SCC)",
    court: "Supreme Court",
    year: 2004,
    summary:
      "Landmark judgment on software exports and service tax applicability. Established liability framework for IT services provided to overseas clients.",
    citation: "2004 SCC 528",
    relevance: 9.2,
  },
  {
    id: 2,
    caseTitle:
      "BCCI v. Commissioner of Income Tax (2018 SCC)",
    court: "Supreme Court",
    year: 2018,
    summary:
      "Addressed GST classification of cricket event rights. Clarified the nature of 'supplies' under GST law for entertainment services.",
    citation: "2018 SCC 416",
    relevance: 8.7,
  },
  {
    id: 3,
    caseTitle:
      "DLF Ltd. v. Commissioner of Income Tax (2008 SCC)",
    court: "Supreme Court",
    year: 2008,
    summary:
      "Decision on capital gains taxation and real estate development. Important for understanding property transaction taxation frameworks.",
    citation: "2008 SCC 635",
    relevance: 8.1,
  },
  {
    id: 4,
    caseTitle:
      "Wockhardt Ltd. v. Directorate of Revenue Intelligence (2015 SCC)",
    court: "Supreme Court",
    year: 2015,
    summary:
      "Clarified liability for customs duties on imported pharmaceutical raw materials. Important for supply chain compliance.",
    citation: "2015 SCC 291",
    relevance: 7.9,
  },
  {
    id: 5,
    caseTitle:
      "HCL Technologies Ltd. v. Commissioner of Income Tax (2016 SCC)",
    court: "Supreme Court",
    year: 2016,
    summary:
      "Addressed deduction eligibility for software development costs. Landmark ruling on technology sector taxation.",
    citation: "2016 SCC 453",
    relevance: 8.4,
  },
];

export const glossaryTerms = [
  {
    term: "ITC",
    category: "GST",
    definition:
      "Input Tax Credit - tax paid on inputs that can be claimed as credit against output tax liability.",
    example:
      'If you paid Rs. 10,000 GST on purchase of raw materials and collected Rs. 8,000 GST from customers, you pay only Rs. 2,000 (8,000 - 10,000 = -2,000, resulting in refund).',
  },
  {
    term: "GSTR-1",
    category: "GST",
    definition:
      "Return filed by GST-registered suppliers showing outward supplies of goods/services.",
    example:
      "If you are a manufacturer selling goods to 100 businesses, GSTR-1 contains details of all 100 sales.",
  },
  {
    term: "GSTR-2A",
    category: "GST",
    definition:
      "Statement showing inward supplies received from registered suppliers, auto-populated from GSTR-1 filings.",
    example:
      "Your GSTR-2A shows all purchases you made from GST-registered suppliers in a month.",
  },
  {
    term: "GSTR-3B",
    category: "GST",
    definition:
      "Monthly provisional return where taxpayer declares output tax, ITC, and net tax liability.",
    example:
      "In GSTR-3B, you report total sales (output), total GST paid on purchases (input), and remit the difference.",
  },
  {
    term: "Section 143(2)",
    category: "Tax",
    definition:
      "Income tax assessment by the revenue authority after detailed examination of the return.",
    example:
      "If your income tax return shows business income of Rs. 50 lakhs, an assessment officer may examine it under Section 143(2) and may increase it based on evidence.",
  },
  {
    term: "TDS",
    category: "Tax",
    definition:
      "Tax Deducted at Source - tax deducted by the payer and deposited with the government on behalf of the payee.",
    example:
      "An employer deducting Rs. 10,000 from your salary as income tax and depositing it with the government.",
  },
  {
    term: "ITR",
    category: "Tax",
    definition:
      "Income Tax Return - annual return filed by individuals/entities to declare income and pay tax.",
    example:
      "Salary earner files ITR-1 annually showing salary income and paying tax due on it.",
  },
  {
    term: "Exempted Supply",
    category: "GST",
    definition:
      "Supply of goods/services that are exempt from GST under the exemption list.",
    example:
      "Educational services provided by schools/colleges are exempted from GST. No GST is charged on tuition fees.",
  },
  {
    term: "Reverse Charge",
    category: "GST",
    definition:
      "Mechanism where the recipient becomes responsible for paying GST instead of the supplier.",
    example:
      "Services provided by unregistered suppliers to registered recipients trigger reverse charge. Recipient pays GST directly.",
  },
  {
    term: "Blocking of ITC",
    category: "GST",
    definition:
      "Denial of ITC when certain conditions are not met, as per GST rules.",
    example:
      "If you don't file GSTR-3B on time, your ITC for that month may be blocked until filing is done.",
  },
  {
    term: "Penalty",
    category: "Tax",
    definition:
      "Financial charge imposed by tax authorities for non-compliance with tax laws.",
    example:
      "Failure to file GST return on time can result in a penalty of Rs. 100-500 per day under GST law.",
  },
  {
    term: "Assessment Year",
    category: "Tax",
    definition:
      "Financial year immediately following the financial year in which income is earned.",
    example:
      "Income earned in FY 2023-24 (April 2023 to March 2024) is assessed in AY 2024-25.",
  },
  {
    term: "Business Income",
    category: "Tax",
    definition:
      "Income derived from business/professional activities, taxed under different rules than salary income.",
    example:
      "Income from running a law practice is business income, taxed at slab rates after allowing specified deductions.",
  },
  {
    term: "Deduction",
    category: "Tax",
    definition:
      "Expenses allowed to be subtracted from gross income to arrive at taxable income.",
    example:
      "If your business revenue is Rs. 100 lakhs and expenses are Rs. 60 lakhs, deduction is Rs. 60 lakhs, leaving taxable income of Rs. 40 lakhs.",
  },
  {
    term: "Loss Carryforward",
    category: "Tax",
    definition:
      "Ability to carry forward business losses to future years to set off against future profits.",
    example:
      "Business incurred loss of Rs. 10 lakhs in FY 2023-24. This loss can be set off in FY 2024-25 if profits are made.",
  },
  {
    term: "Deemed Income",
    category: "Tax",
    definition:
      "Income attributed to a person by tax law even if not actually received, based on specific conditions.",
    example:
      "If you maintain a property in a city and don't rent it out, the rent you could have earned is deemed income under Section 23.",
  },
  {
    term: "Due Date",
    category: "Compliance",
    definition:
      "Last date for filing returns, paying taxes, or submitting compliance documents.",
    example:
      "ITR filing due date for FY 2023-24 is July 31, 2024. Filing after this attracts late filing penalties.",
  },
  {
    term: "Show Cause Notice",
    category: "Compliance",
    definition:
      'Formal notice issued by tax authority requiring explanation for discrepancies or violations found in audit.',
    example:
      "GST authority issues SCN asking you to explain why ITC was claimed on supplies to unregistered entities.",
  },
  {
    term: "Reconciliation",
    category: "GST",
    definition:
      "Process of matching GST data filed in GSTR-1 (supplies) with GSTR-2A (purchases) to ensure consistency.",
    example:
      "You filed Rs. 100 lakhs sales in GSTR-1, but your customer's GSTR-2A shows only Rs. 80 lakhs purchase. Reconciliation reveals a gap of Rs. 20 lakhs.",
  },
  {
    term: "Input Tax",
    category: "GST",
    definition:
      "GST paid on inputs (raw materials, services, etc.) used in business. Can be claimed as ITC.",
    example:
      "You purchased cloth for Rs. 100 + Rs. 18 GST. The Rs. 18 is input tax, claimable as ITC.",
  },
];

export const complianceChecklists = [
  {
    id: 1,
    title: "FY 2023-24 Compliance Checklist",
    period: "April 2023 - March 2024",
    parties: "Individual Assessee",
    items: [
      {
        action: "File Income Tax Return (ITR)",
        section: "Income Tax",
        deadline: "July 31, 2024",
        responsible: "Self / CA",
        urgency: "CRITICAL",
      },
      {
        action: "File Belated ITR if missed",
        section: "Income Tax",
        deadline: "December 31, 2024",
        responsible: "Self / CA",
        urgency: "HIGH",
      },
      {
        action: "File GST Return (GSTR-3B) monthly",
        section: "GST",
        deadline: "20th of next month",
        responsible: "Accounts Manager",
        urgency: "CRITICAL",
      },
      {
        action: "File GST Annual Return (GSTR-9)",
        section: "GST",
        deadline: "December 31, 2024",
        responsible: "Accounts Manager",
        urgency: "HIGH",
      },
      {
        action: "Maintain audit records",
        section: "Records",
        deadline: "Throughout the year",
        responsible: "Finance Team",
        urgency: "MEDIUM",
      },
    ],
  },
];
