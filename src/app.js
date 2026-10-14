import Chart from 'chart.js/auto';
import { historicalData, forecastData, stateData, crimeHeadData, modelStats } from './data.js';

// Color definitions matching CSS
const COLOR = {
  indigo: '#6366F1',
  indigoDk: '#4338CA',
  rose: '#FB7185',
  amber: '#F59E0B',
  teal: '#14B8A6',
  violet: '#A78BFA',
  grid: 'rgba(99,102,241,0.08)'
};

// Global Chart References
let trendChart = null;
let yoyChart = null;
let stateChart = null;
let crimeHeadChart = null;
let forecastChart = null;

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  initTrendChart();
  initYoYChart();
  initStateSection();
  initCrimeHeadSection();
  initForecastChart();
  setupSimulator();
  setupTechModal();
});

/* ==========================================================================
   1. ScrollSpy Navigation
   ========================================================================== */
function setupNavigation() {
  const navLinks = document.querySelectorAll('#navlinks a.nav-link');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach(sec => sec && observer.observe(sec));
}

/* ==========================================================================
   2. National Trend Line Chart
   ========================================================================== */
function initTrendChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historicalData.map(d => d.year),
      datasets: [{
        label: 'Registered cases',
        data: historicalData.map(d => d.cases),
        borderColor: COLOR.indigo,
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointBackgroundColor: COLOR.indigo,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#201B3F',
          callbacks: {
            label: (ctx) => ` Cases: ${ctx.raw.toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        y: {
          grid: { color: COLOR.grid },
          ticks: {
            callback: (v) => (v / 1000).toFixed(0) + 'k'
          }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ==========================================================================
   3. Year-on-Year Growth Bar Chart
   ========================================================================== */
function initYoYChart() {
  const ctx = document.getElementById('yoyChart').getContext('2d');
  const yoySeries = historicalData.filter(d => d.yoy !== null);

  yoyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: yoySeries.map(d => d.year),
      datasets: [{
        label: 'YoY % change',
        data: yoySeries.map(d => d.yoy),
        backgroundColor: yoySeries.map(d => d.year === 2023 ? COLOR.rose : COLOR.violet),
        borderRadius: 8,
        maxBarThickness: 52
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#201B3F',
          callbacks: {
            label: (ctx) => ` YoY Growth: +${ctx.raw}%`
          }
        }
      },
      scales: {
        y: {
          grid: { color: COLOR.grid },
          ticks: { callback: (v) => v + '%' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ==========================================================================
   4. State-wise Chart & Table
   ========================================================================== */
function initStateSection() {
  const ctx = document.getElementById('stateChart').getContext('2d');

  stateChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stateData.map(s => s.state),
      datasets: [{
        label: 'Cases (2024)',
        data: stateData.map(s => s.cases),
        backgroundColor: COLOR.indigo,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#201B3F',
          callbacks: {
            label: (ctx) => {
              const item = stateData[ctx.dataIndex];
              return ` ${item.cases.toLocaleString('en-IN')} cases (${item.share}% share)`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: COLOR.grid },
          ticks: { callback: (v) => (v / 1000).toFixed(0) + 'k' }
        },
        y: { grid: { display: false } }
      }
    }
  });

  renderStateTable(stateData);

  // Search filter listener
  const searchInput = document.getElementById('stateSearchInput');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = stateData.filter(s => s.state.toLowerCase().includes(q));
    renderStateTable(filtered);
  });
}

function renderStateTable(data) {
  const tbody = document.getElementById('stateTableBody');
  tbody.innerHTML = '';
  data.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="rank-badge">${s.rank}</span></td>
      <td><strong>${s.state}</strong></td>
      <td>${s.cases.toLocaleString('en-IN')}</td>
      <td>${s.share}%</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================================================
   5. Crime Head Doughnut Chart & Table
   ========================================================================== */
function initCrimeHeadSection() {
  const ctx = document.getElementById('crimeHeadChart').getContext('2d');

  crimeHeadChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: crimeHeadData.map(c => c.category),
      datasets: [{
        data: crimeHeadData.map(c => c.cases),
        backgroundColor: [COLOR.indigo, COLOR.rose, COLOR.amber, COLOR.teal, COLOR.violet],
        borderColor: '#F7F6FD',
        borderWidth: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, font: { size: 10.5 }, padding: 14 }
        },
        tooltip: {
          backgroundColor: '#201B3F',
          callbacks: {
            label: (ctx) => {
              const item = crimeHeadData[ctx.dataIndex];
              return ` ${item.cases.toLocaleString('en-IN')} cases (${item.share}%)`;
            }
          }
        }
      },
      cutout: '65%'
    }
  });

  const tbody = document.getElementById('crimeHeadTableBody');
  tbody.innerHTML = '';
  crimeHeadData.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="rank-badge">${c.rank}</span></td>
      <td><strong>${c.category}</strong></td>
      <td>${c.cases.toLocaleString('en-IN')}</td>
      <td>${c.share}%</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================================================
   6. Forecast Chart with Error Band (±7.44%)
   ========================================================================== */
function initForecastChart() {
  const ctx = document.getElementById('forecastChart').getContext('2d');

  const fLabels = [
    ...historicalData.map(d => d.year),
    ...forecastData.map(d => d.year)
  ];

  const actualSeries = [
    ...historicalData.map(d => d.cases),
    null, null, null
  ];

  const predSeries = [
    null, null, null, null,
    historicalData[historicalData.length - 1].cases,
    ...forecastData.map(d => d.cases)
  ];

  const errFrac = modelStats.backtestError / 100;
  const upperBand = predSeries.map(v => v === null ? null : Math.round(v * (1 + errFrac)));
  const lowerBand = predSeries.map(v => v === null ? null : Math.round(v * (1 - errFrac)));

  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fLabels,
      datasets: [
        {
          label: 'Actual Data',
          data: actualSeries,
          borderColor: COLOR.indigo,
          backgroundColor: 'transparent',
          spanGaps: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: COLOR.indigo,
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Projected',
          data: predSeries,
          borderColor: COLOR.rose,
          borderDash: [7, 5],
          backgroundColor: 'transparent',
          spanGaps: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: COLOR.rose,
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Error band (±7.44%)',
          data: upperBand,
          borderColor: 'transparent',
          backgroundColor: 'rgba(251, 113, 133, 0.12)',
          fill: '+1',
          pointRadius: 0,
          spanGaps: true
        },
        {
          label: 'lower',
          data: lowerBand,
          borderColor: 'transparent',
          backgroundColor: 'rgba(251, 113, 133, 0.12)',
          fill: false,
          pointRadius: 0,
          spanGaps: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            filter: (item) => item.text !== 'lower'
          }
        },
        tooltip: {
          backgroundColor: '#201B3F',
          callbacks: {
            label: (ctx) => {
              if (ctx.raw === null) return '';
              return ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString('en-IN')} cases`;
            }
          }
        }
      },
      scales: {
        y: {
          grid: { color: COLOR.grid },
          ticks: { callback: (v) => (v / 1000).toFixed(0) + 'k' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ==========================================================================
   7. Interactive Scenario Simulator Slider
   ========================================================================== */
function setupSimulator() {
  const slider = document.getElementById('sim-slider');
  const slopeDisplay = document.getElementById('sim-slope-val');
  const val2025 = document.getElementById('sim-val-2025');
  const val2026 = document.getElementById('sim-val-2026');
  const val2027 = document.getElementById('sim-val-2027');
  const btnReset = document.getElementById('btn-reset-sim');

  const base2024 = 101928;

  function updateSimulator() {
    const slope = parseInt(slider.value, 10);
    slopeDisplay.innerText = `+${slope.toLocaleString('en-IN')} / yr`;

    const p2025 = base2024 + slope;
    const p2026 = base2024 + (slope * 2);
    const p2027 = base2024 + (slope * 3);

    val2025.innerText = p2025.toLocaleString('en-IN');
    val2026.innerText = p2026.toLocaleString('en-IN');
    val2027.innerText = p2027.toLocaleString('en-IN');

    // Update Forecast Chart datasets
    if (forecastChart) {
      const errFrac = modelStats.backtestError / 100;
      const newPred = [null, null, null, null, base2024, p2025, p2026, p2027];
      const newUpper = newPred.map(v => v === null ? null : Math.round(v * (1 + errFrac)));
      const newLower = newPred.map(v => v === null ? null : Math.round(v * (1 - errFrac)));

      forecastChart.data.datasets[1].data = newPred;
      forecastChart.data.datasets[2].data = newUpper;
      forecastChart.data.datasets[3].data = newLower;
      forecastChart.update();
    }
  }

  slider.addEventListener('input', updateSimulator);

  btnReset.addEventListener('click', () => {
    slider.value = 13723;
    updateSimulator();
  });
}

/* ==========================================================================
   8. Tech Specification Modal
   ========================================================================== */
function setupTechModal() {
  const modal = document.getElementById('techModal');
  const openBtn = document.getElementById('btn-open-tech-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  const ackBtn = document.getElementById('btn-ack-modal');

  function open() { modal.classList.add('active'); }
  function close() { modal.classList.remove('active'); }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  ackBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}
