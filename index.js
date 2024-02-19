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
          title: { display: true, text: "B (мкТЛ)" }
        }
      },
      layout: {
        padding: 50,
      }
    },
  });
  document.getElementById("r").value = "0.15";
  document.getElementById("i").value = "10";
  document.getElementById("n").value = "100";

  const [r, i, n] = [0.15, 10, 100]; 
  make_plot(r, make_data(r, i, n));
}

const parse_input = () => {
  const r_inp = document.getElementById("r");
  const i_inp = document.getElementById("i");
  const n_inp = document.getElementById("n");

  const r_raw = r_inp.value;
  const i_raw = i_inp.value;
  const n_raw = n_inp.value;

  if (isNaN(r_raw) || isNaN(i_raw) || isNaN(n_raw)) {
    return [NaN, NaN, NaN];
  }

  const r = parseFloat(r_raw);
  const i = parseFloat(i_raw);
  const n = parseInt(n_raw);

  if (r <= 0 || i <= 0 || n <= 0) {
    return [NaN, NaN, NaN];
  }
  if (isNaN(r) || isNaN(i) || isNaN(n)) {
    return [NaN, NaN, NaN];
  }

  r_inp.value = r.toString();
  i_inp.value = i.toString();
  n_inp.value = n.toString();

  return [r, i / 1000, n];
}

const f = (r, i, x) => {
  const q0 = 1.256637 * 0.000001;

  const b1 = (q0 * i / 2) * (r * r) / ((x * x + r * r) ** 1.5);
  x -= r;
  const b2 = (q0 * i / 2) * (r * r) / ((x * x + r * r) ** 1.5);

  return b1 + b2;
}

const make_plot = (r, b_data) => {
  plot.destroy();
  plot = new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "B(x)",
          borderColor: "rgba(66, 200, 222, .8)",
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
          title: { display: true, text: "B (мкТЛ)" }
        }
      },
      layout: {
        padding: 50,
      },
      plugins: {
        annotation: {
          annotations: {
            line1: {
              type: "line",
              xMin: 0,
              xMax: 0,
              borderWidth: 2,
              borderColor: "red",
              label: {
                content: "Левая катушка",
                display: true,
                position: "start"
              }
            },
            line2: {
              type: "line",
              xMin: r,
              xMax: r,
              borderWidth: 2,
              borderColor: "red",
              label: {
                content: "Правая катушка",
                display: true,
                position: "start"
              }
            }
          }
        }
      }
    }
  });
}

const make_data = (r, i, n) => {
  const step = 3 * r / 100;
  let x = -r;

  const data = [];
  while (x < 2 * r) {
    data.push({
      x: x,
      y: f(r, i * n, x) * 1000000
    });
    x += step;
  }
  
  return data;
}
const run = () => {
  const [r, i, n] = parse_input();
  if (isNaN(r) || isNaN(n) || isNaN(i)) {
    alert("Некорретный ввод!");
    return;
  }
  make_plot(r, make_data(r, i, n));
}

