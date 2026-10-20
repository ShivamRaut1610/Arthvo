// =============================================
// ARTHVO — Financial Calculator Engine
// All NPS and retirement math in one place
// =============================================

export interface CorpusParams {
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  annualReturn?: number;
}

export interface CostOfDelayParams extends CorpusParams {
  delayYears?: number;
}

export type AvatarState = 'thriving' | 'stable' | 'struggling' | 'critical' | 'zero';

// =============================================
// CORPUS CALCULATOR
// FV of an annuity-due (contributions at start of each period)
// =============================================
export function calculateCorpus({
  currentAge,
  retirementAge,
  monthlyContribution,
  annualReturn = 10,
}: CorpusParams): number {
  const months = (retirementAge - currentAge) * 12;
  if (months <= 0) return 0;
  const r = annualReturn / 12 / 100;
  if (r === 0) return monthlyContribution * months;
  const corpus =
    monthlyContribution * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
  return Math.round(corpus);
}

// Total amount invested (principal)
export function getTotalInvested(monthlyContribution: number, currentAge: number, retirementAge: number): number {
  return monthlyContribution * (retirementAge - currentAge) * 12;
}

// Total returns = corpus - invested
export function getTotalReturns(corpus: number, totalInvested: number): number {
  return Math.max(0, corpus - totalInvested);
}

// Monthly pension estimate — SWR of 6% / 12
export function getMonthlyPension(corpus: number): number {
  return Math.round(corpus * 0.006);
}

// =============================================
// COST OF DELAY
// =============================================
export function getCostOfDelay({
  currentAge,
  retirementAge,
  monthlyContribution,
  annualReturn = 10,
  delayYears = 5,
}: CostOfDelayParams): number {
  const withoutDelay = calculateCorpus({ currentAge, retirementAge, monthlyContribution, annualReturn });
  const withDelay = calculateCorpus({
    currentAge: currentAge + delayYears,
    retirementAge,
    monthlyContribution,
    annualReturn,
  });
  return Math.max(0, withoutDelay - withDelay);
}

export interface DelayScenario {
  label: string;
  startAge: number;
  corpus: number;
  totalInvested: number;
  lossVsToday: number;
}

export function getDelayScenarios(
  currentAge: number,
  retirementAge: number,
  monthlyContribution: number,
  annualReturn = 10,
): DelayScenario[] {
  const delays = [0, 2, 5];
  const baseCorpus = calculateCorpus({ currentAge, retirementAge, monthlyContribution, annualReturn });

  return delays.map(d => {
    const startAge = currentAge + d;
    const corpus = calculateCorpus({ currentAge: startAge, retirementAge, monthlyContribution, annualReturn });
    const invested = getTotalInvested(monthlyContribution, startAge, retirementAge);
    return {
      label: d === 0 ? 'Start Today' : `Wait ${d} Years`,
      startAge,
      corpus,
      totalInvested: invested,
      lossVsToday: Math.max(0, baseCorpus - corpus),
    };
  });
}

// =============================================
// TAX BENEFIT CALCULATOR (Old Regime)
// =============================================
export interface TaxBenefitParams {
  annualIncome: number;
  annualContribution: number;
  regime: 'old' | 'new';
}

export interface TaxBenefitResult {
  benefit80CCD1: number;      // Part of 80C — up to ₹1.5L
  benefit80CCD1B: number;     // Extra ₹50,000 exclusively for NPS
  totalTaxSaved: number;
  effectiveCostPer100: number; // How many paisa does ₹1 in NPS actually cost
  marginalRate: number;
}

export function calculateTaxBenefit({ annualIncome, annualContribution, regime }: TaxBenefitParams): TaxBenefitResult {
  // Marginal tax rates (old regime, simplified)
  let marginalRate = 0;
  if (regime === 'new') {
    // New regime rates FY2024-25
    if (annualIncome > 1500000) marginalRate = 0.30;
    else if (annualIncome > 1200000) marginalRate = 0.20;
    else if (annualIncome > 900000) marginalRate = 0.15;
    else if (annualIncome > 600000) marginalRate = 0.10;
    else if (annualIncome > 400000) marginalRate = 0.05;
    else marginalRate = 0;
  } else {
    // Old regime
    if (annualIncome > 1000000) marginalRate = 0.30;
    else if (annualIncome > 500000) marginalRate = 0.20;
    else if (annualIncome > 250000) marginalRate = 0.05;
    else marginalRate = 0;
  }

  // 80CCD(1) — part of 80C limit of ₹1.5L
  // Eligible: min(contribution, 10% of income, 150000)
  const eligible80CCD1 = Math.min(annualContribution, annualIncome * 0.10, 150000);
  const benefit80CCD1 = Math.round(eligible80CCD1 * marginalRate * 1.04); // +4% cess

  // 80CCD(1B) — additional ₹50,000 (only old regime gives this in NPS)
  const eligible1B = regime === 'old' ? Math.min(annualContribution - eligible80CCD1, 50000) : 0;
  const benefit80CCD1B = Math.round(Math.max(0, eligible1B) * marginalRate * 1.04);

  const totalTaxSaved = benefit80CCD1 + benefit80CCD1B;
  const effectiveContribution = Math.max(1, annualContribution - totalTaxSaved);
  const effectiveCostPer100 = Math.round((effectiveContribution / annualContribution) * 100);

  return { benefit80CCD1, benefit80CCD1B, totalTaxSaved, effectiveCostPer100, marginalRate };
}

// =============================================
// NPS vs OTHER INVESTMENTS
// =============================================
export interface InvestmentComparison {
  name: string;
  rate: number;
  corpus: number;
  color: string;
  isNPS: boolean;
}

export function compareInvestments(
  monthlyContribution: number,
  currentAge: number,
  retirementAge: number,
): InvestmentComparison[] {
  const options = [
    { name: 'NPS', rate: 10.5, color: '#F5A623', isNPS: true },
    { name: 'PPF', rate: 7.1, color: '#6366F1', isNPS: false },
    { name: 'Fixed Deposit', rate: 6.5, color: '#22C55E', isNPS: false },
    { name: 'Savings A/C', rate: 3.5, color: '#94A3B8', isNPS: false },
  ];

  return options.map(o => ({
    ...o,
    corpus: calculateCorpus({ currentAge, retirementAge, monthlyContribution, annualReturn: o.rate }),
  }));
}

// =============================================
// GIG WORKER CALCULATOR
// Self-employed: 80CCD(1) = 20% of gross income
// =============================================
export interface GigWorkerResult {
  recommendedContribution: number;
  minContribution: number;
  taxDeductible: number;
  taxSaved: number;
  corpus: number;
  monthlyPension: number;
}

export function calculateGigWorker(
  monthlyIncome: number,
  savePct: number,
  currentAge: number,
  retirementAge: number,
): GigWorkerResult {
  const annualIncome = monthlyIncome * 12;
  const recommended = Math.round(monthlyIncome * (savePct / 100));
  const min = Math.round(monthlyIncome * 0.05);

  // Self-employed 80CCD(1) = 20% of gross (not 10%)
  const annualContrib = recommended * 12;
  const taxDeductible = Math.min(annualContrib, annualIncome * 0.20);
  const marginalRate = annualIncome > 1000000 ? 0.312 : annualIncome > 500000 ? 0.208 : 0.052;
  const taxSaved = Math.round(taxDeductible * marginalRate);

  const corpus = calculateCorpus({ currentAge, retirementAge, monthlyContribution: recommended });

  return {
    recommendedContribution: recommended,
    minContribution: min,
    taxDeductible,
    taxSaved,
    corpus,
    monthlyPension: getMonthlyPension(corpus),
  };
}

// =============================================
// AVATAR STATE
// =============================================
export function getAvatarState(corpus: number, currentAge: number): AvatarState {
  const target = (60 - currentAge) * 12 * 5000;
  const ratio = corpus / target;
  if (ratio >= 1.0) return 'thriving';
  if (ratio >= 0.7) return 'stable';
  if (ratio >= 0.4) return 'struggling';
  if (ratio >= 0.1) return 'critical';
  return 'zero';
}

export function getAvatarStatePercent(corpus: number, currentAge: number): number {
  const target = (60 - currentAge) * 12 * 5000;
  return Math.min(100, Math.round((corpus / target) * 100));
}

// =============================================
// FORMATTING
// =============================================
export function formatCorpus(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPct(rate: number): string {
  return `${rate}%`;
}

// Corpus growth chart data — year by year
export function getCorpusGrowthData(
  currentAge: number,
  retirementAge: number,
  monthlyContribution: number,
  annualReturn = 10,
): { age: number; corpus: number; invested: number }[] {
  const data = [];
  for (let age = currentAge; age <= retirementAge; age += 5) {
    const corpus = calculateCorpus({ currentAge, retirementAge: age, monthlyContribution, annualReturn });
    const invested = getTotalInvested(monthlyContribution, currentAge, age);
    data.push({ age, corpus, invested });
  }
  return data;
}
