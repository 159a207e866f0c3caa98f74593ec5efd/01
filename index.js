const canvas = document.getElementById("canvas").getContext("2d");

let plot = undefined;

const setup = () => {
  plot = new Chart(canvas, {
    type: "line",
    data: { datasets: [] },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "x (м)" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "B (мкТЛ)" } }
      },
      layout: {
        padding: 50,
      }
    },
  });
  document.getElementById("r").value = "0.15";
  document.getElementById("n").value = "100";
  document.getElementById("i").value = "10";
}

const parse_input = () => {
  const r_inp = document.getElementById("r");
  const n_inp = document.getElementById("n");
  const i_inp = document.getElementById("i");
  
  const r_raw = r_inp.value;
  const n_raw = n_inp.value;
  const i_raw = i_inp.value;

  if (isNaN(r_raw) || isNaN(n_raw) || isNaN(i_raw)) {
    return [NaN, NaN, NaN];
  }
  
  const r = parseFloat(r_raw);
  const n = parseInt(n_raw);
  const i = parseFloat(i_raw);

  if (r <= 0 || n <= 0 || i <= 0) {
    return [NaN, NaN, NaN];
  }
  if (isNaN(r) || isNaN(n) || isNaN(i)) {
    return [NaN, NaN, NaN];
  }

  r_inp.value = r.toString();
  n_inp.value = n.toString();
  i_inp.value = i.toString();

  return [r, n, i / 1000];
}

const f = (r, i, x) => {
  const q0 = 1.256637 * 0.000001;

  const b1 = (q0 * i / 2) * (r * r) / ((x * x + r * r) ** 1.5);
  x -= r;
  const b2 = (q0 * i / 2) * (r * r) / ((x * x + r * r) ** 1.5);

  return b1 + b2;
}

const make_plot = b_data => {
  plot.destroy();
  plot = new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "B(x)",
          borderColor: 'rgba(75, 192, 192, 1)',
          data: b_data,
          lineTension: 0.4,
          pointRadius: 0 
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "x (м)" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "B (мкТЛ)" } }
      },
      layout: {
        padding: 50,
      }
    },
  });
}

const run = () => {
  const [r, n, i] = parse_input();
  if (isNaN(r) || isNaN(n) || isNaN(i)) {
    alert("Некорретный ввод!");
    return;
  }

  const step = 2 * r / 100;
  let x = 0;

  const data = [];
  while (x < 2 * r) {
    data.push({
      x: x,
      y: f(r, i, x) * 10**6
    });
    x += step;
  }

  make_plot(data);
}

