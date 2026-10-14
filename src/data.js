// Cybercrime Analytics & Forecasting Dataset (Source: Official NCRB Data 2020-2024)

export const historicalData = [
  { year: 2020, cases: 50035, yoy: null, note: "Baseline Year" },
  { year: 2021, cases: 52974, yoy: 5.87, note: "Modest Growth" },
  { year: 2022, cases: 65893, yoy: 24.39, note: "Accelerating Trend" },
  { year: 2023, cases: 86420, yoy: 31.15, note: "Peak YoY Growth Rate" },
  { year: 2024, cases: 101928, yoy: 17.94, note: "Crossed 100K Cases" }
];

export const forecastData = [
  { year: 2025, cases: 112620, isForecast: true },
  { year: 2026, cases: 126343, isForecast: true },
  { year: 2027, cases: 140066, isForecast: true }
];

export const stateData = [
  { rank: 1, state: "Telangana", cases: 27230, share: 26.71, category: "High Volume" },
  { rank: 2, state: "Karnataka", cases: 21993, share: 21.58, category: "High Volume" },
  { rank: 3, state: "Uttar Pradesh", cases: 11073, share: 10.86, category: "High Volume" },
  { rank: 4, state: "Maharashtra", cases: 9922, share: 9.73, category: "High Volume" },
  { rank: 5, state: "Bihar", cases: 6380, share: 6.26, category: "Moderate Volume" },
  { rank: 6, state: "Tamil Nadu", cases: 5793, share: 5.68, category: "Moderate Volume" },
  { rank: 7, state: "Kerala", cases: 2962, share: 2.91, category: "Moderate Volume" },
  { rank: 8, state: "Andhra Pradesh", cases: 2528, share: 2.48, category: "Moderate Volume" },
  { rank: 9, state: "Odisha", cases: 2501, share: 2.45, category: "Emerging Area" },
  { rank: 10, state: "Haryana", cases: 1815, share: 1.78, category: "Emerging Area" }
];

export const crimeHeadData = [
  { rank: 1, category: "Computer Related Offences", cases: 36920, share: 36.22, icon: "laptop", color: "#6366f1" },
  { rank: 2, category: "Financial Fraud", cases: 29758, share: 29.20, icon: "credit-card", color: "#06b6d4" },
  { rank: 3, category: "Online Cheating", cases: 19296, share: 18.93, icon: "shield-alert", color: "#f59e0b" },
  { rank: 4, category: "Obscene / Sexually Explicit Content", cases: 6990, share: 6.86, icon: "eye-off", color: "#ec4899" },
  { rank: 5, category: "Other Offences", cases: 4109, share: 4.03, icon: "more-horizontal", color: "#8b5cf6" }
];

export const modelStats = {
  modelName: "Ordinary Least Squares (OLS) Linear Regression",
  formula: "y = a + bx",
  slope: 13723, // annual trend increase (~13,723 cases/yr)
  rSquared: 0.949, // goodness-of-fit
  backtestYear: 2024,
  backtestActual: 101928,
  backtestPredicted: 94349,
  backtestError: 7.44, // absolute percentage error
  totalGrowth5Yr: 103.71, // 2020 to 2024
  top5StatesShare: 75.15,
  top3CrimeHeadsShare: 84.35
};

export const techStackDetails = {
  analyticalModel: {
    name: "Linear Regression Trend Model",
    equation: "y = a + b · x",
    description: "Short-horizon predictive forecasting based on annual registered case velocity from 2020 to 2024.",
    metrics: [
      { label: "R² Fit Score", value: "0.949 (94.9%)" },
      { label: "Annual Trend (b)", value: "+13,723 cases / year" },
      { label: "Backtest MAPE", value: "7.44% Error" }
    ]
  },
  reportLanguagesTools: [
    { name: "Python 3.x", role: "Primary Analytics Language" },
    { name: "Pandas & NumPy", role: "Data Cleaning & Matrix Operations" },
    { name: "Scikit-Learn", role: "Linear Regression Modelling" },
    { name: "Matplotlib / Seaborn", role: "Initial Exploratory Charting" }
  ],
  dashboardLanguagesTools: [
    { name: "HTML5 & Semantic Markup", role: "Structured Web Layout" },
    { name: "CSS3 Vanilla & Glassmorphism", role: "Modern Light Gradient Styling" },
    { name: "JavaScript (ES6+)", role: "Dynamic Logic & Interactive Simulator" },
    { name: "Chart.js 4.4", role: "Interactive Dynamic Canvas Visualizations" },
    { name: "Lucide Icons", role: "Vector UI Iconography" }
  ]
};
