// Dados iniciais sem lançamentos (entradas e saidas zerados)
const inicial = [
  {nome:"Dorflex",estoqueInicial:50,entradas:0,saidas:0},
  {nome:"Torsilax",estoqueInicial:50,entradas:0,saidas:0},
  {nome:"Eno",estoqueInicial:22,entradas:0,saidas:0},
  {nome:"Paracetamol",estoqueInicial:40,entradas:0,saidas:0},
  {nome:"Nimesulida",estoqueInicial:12,entradas:0,saidas:0},
  {nome:"Gelol",estoqueInicial:5,entradas:0,saidas:0},
  {nome:"Esparadrapo",estoqueInicial:0,entradas:0,saidas:0},
  {nome:"Faixa",estoqueInicial:10,entradas:0,saidas:0},
  {nome:"Dipirona",estoqueInicial:20,entradas:0,saidas:0},
  {nome:"Bandeide",estoqueInicial:7,entradas:0,saidas:0},
  {nome:"Soro fisiológico",estoqueInicial:4,entradas:0,saidas:0}
];

const setores = [
  "ADM FABRIL","ENSAQUE - 1° TURNO","ENSAQUE - 2° TURNO","ENSAQUE - 3° TURNO","TORRE",
  "MANUTENÇÃO","MOEGA","CARREGAMENTO 1° TURNO","CARREGAMENTO 2° TURNO","ALMOXARIFADO",
  "ESTOQUE","SILO BOLSA","GOIÂNIA","EMPACOTAMENTO - 1º TURNO","EMPACOTAMENTO - 2º TURNO",
  "EMPACOTAMENTO - 3º TURNO","MANUTENÇÃO ELETRICA","LIMPEZA FÁBRIL","REFEITÓRIO"
];

// Função para pegar mês anterior no formato 'YYYY-MM'
function getMesAnterior() {
  const hoje = new Date();
  let ano = hoje.getFullYear();
  let mes = hoje.getMonth(); // 0 = Janeiro
  if(mes === 0){
    mes = 12;
    ano -= 1;
  }
  return `${ano}-${String(mes).padStart(2,'0')}`;
}

const relPadraoMes = getMesAnterior();

const relPadraoCompleto = {
  [relPadraoMes]: {
    "ADM FABRIL": {
      "Bandeide": 1,
      "Dipirona": 8,
      "Eno": 9,
      "Paracetamol": 15,
      "Torsilax": 1
    },
    "ALMOXARIFADO": {
      "Dipirona": 2
    },
    "CARREGAMENTO 1° TURNO": {
      "Bandeide": 1,
      "Dipirona": 3,
      "Dorflex": 9,
      "Eno": 7,
      "Nimesulida": 1,
      "Paracetamol": 10,
      "Torsilax": 18
    },
    "CARREGAMENTO 2° TURNO": {
      "Eno": 1
    },
    "EMPACOTAMENTO - 1° TURNO": {
      "Bandeide": 5,
      "Dipirona": 4,
      "Eno": 3,
      "Nimesulida": 1,
      "Paracetamol": 2
    },
    "EMPACOTAMENTO - 2° TURNO": {
      "Dipirona": 2,
      "Eno": 1
    },
    "EMPACOTAMENTO - 3° TURNO": {
      "Eno": 1,
      "Paracetamol": 1
    },
    "ENSAQUE - 1° TURNO": {
      "Bandeide": 3
    },
    "ENSAQUE - 2° TURNO": {
      "Bandeide": 1,
      "Dipirona": 1
    },
    "LIMPEZA FÁBRIL": {
      "Dipirona": 1,
      "Dorflex": 4,
      "Eno": 4,
      "Torsilax": 2
    },
    "MANUTENÇÃO": {
      "Dorflex": 1,
      "Eno": 4,
      "Torsilax": 2
    },
    "MOEGA": {
      "Dipirona": 9,
      "Dorflex": 10
    },
    "TORRE": {
      "Bandeide": 7,
      "Dorflex": 1,
      "Nimesulida": 1
    }
  }
};

let meds;
let rel = {};

// Mapeamento para agrupar setores por setor geral
const setorGeralMap = {
  "ENSAQUE - 1° TURNO": "ENSAQUE",
  "ENSAQUE - 2° TURNO": "ENSAQUE",
  "ENSAQUE - 3° TURNO": "ENSAQUE",
  "CARREGAMENTO 1° TURNO": "CARREGAMENTO",
  "CARREGAMENTO 2° TURNO": "CARREGAMENTO",
  "EMPACOTAMENTO - 1° TURNO": "EMPACOTAMENTO",
  "EMPACOTAMENTO - 2° TURNO": "EMPACOTAMENTO",
  "EMPACOTAMENTO - 3° TURNO": "EMPACOTAMENTO",
  "ADM FABRIL": "ADM FABRIL",
  "TORRE": "TORRE",
  "MANUTENÇÃO": "MANUTENÇÃO",
  "MOEGA": "MOEGA",
  "ALMOXARIFADO": "ALMOXARIFADO",
  "ESTOQUE": "ESTOQUE",
  "SILO BOLSA": "SILO BOLSA",
  "GOIÂNIA": "GOIÂNIA",
  "LIMPEZA FÁBRIL": "LIMPEZA FÁBRIL",
  "REFEITÓRIO": "REFEITÓRIO",
  "MANUTENÇÃO ELETRICA": "MANUTENÇÃO ELETRICA"
};

// Função para zerar e carregar relatório padrão no estoque
function carregarPadraoComRelatorio(){
  meds = inicial.map(m => {
    let totalSaidas = 0;
    Object.keys(relPadraoCompleto).forEach(mes => {
      const setoresMes = relPadraoCompleto[mes];
      Object.keys(setoresMes).forEach(setor => {
        const medsSetor = setoresMes[setor];
        if(medsSetor[m.nome]) totalSaidas += medsSetor[m.nome];
      });
    });
    return {
      nome: m.nome,
      estoqueInicial: m.estoqueInicial,
      entradas: 0,
      saidas: totalSaidas
    };
  });

  rel = JSON.parse(JSON.stringify(relPadraoCompleto));
  save();
  renderEstoque();
  renderRelatorio();
  renderGrafico();
}

// Carregar dados do localStorage ou padrão
let storageMeds = JSON.parse(localStorage.getItem("meds") || "null");
let storageRel = JSON.parse(localStorage.getItem("rel") || "null");

if(!storageMeds || !storageRel){
  carregarPadraoComRelatorio();
}else{
  meds = storageMeds;
  rel = storageRel;
}

// Helpers
const $ = sel => document.querySelector(sel);
const est = m => m.estoqueInicial + m.entradas - m.saidas;

function save(){
  localStorage.setItem("meds", JSON.stringify(meds));
  localStorage.setItem("rel", JSON.stringify(rel));
  localStorage.setItem("lastUpdate", new Date().toISOString());
  $("#last-update").textContent = "Última atualização: " + new Date().toLocaleString("pt-BR");
}

function renderEstoque(){
  const tb=$("#meds-table"); 
  tb.innerHTML="";
  meds.forEach((m,i)=>{
    const low=est(m)<3?"low":"";
    const opts=setores.map(s=>`<option value="${s}">${s}</option>`).join("");
    tb.insertAdjacentHTML("beforeend",`
      <tr class="${low}">
        <td>${m.nome}</td>
        <td>${m.estoqueInicial}</td>
        <td>${m.entradas}</td>
        <td>${m.saidas}</td>
        <td>${est(m)}</td>
        <td>
          <select id="set-${i}">
            <option disabled selected>Setor</option>
            ${opts}
          </select>
        </td>
        <td>
          <input id="q-${i}" type="number" value="0" />
          <button onclick="lancar(${i})">Lançar</button>
          <button onclick="corrigir(${i})">Corrigir</button>
        </td>
      </tr>`);
  });
}

function renderRelatorio(){
  const tb = $("#relatorio-table");
  tb.innerHTML = "";

  const meses = Object.keys(rel).sort().reverse();

  if(meses.length === 0){
    tb.innerHTML = "<tr><td colspan='4'>— Nenhuma saída registrada —</td></tr>";
    return;
  }

  meses.forEach(mes => {
    const setoresMes = Object.keys(rel[mes]).sort();
    setoresMes.forEach(setor => {
      const medsSetor = Object.keys(rel[mes][setor]).sort();
      medsSetor.forEach(medicamento => {
        const qtd = rel[mes][setor][medicamento];
        if(qtd > 0){
          tb.insertAdjacentHTML("beforeend", `
            <tr>
              <td>${mes}</td>
              <td>${setor}</td>
              <td>${medicamento}</td>
              <td>${qtd}</td>
            </tr>
          `);
        }
      });
    });
  });
}

window.lancar = i => {
  const qtd = Number($("#q-" + i).value);
  const setor = $("#set-" + i).value;
  if (!qtd) return alert("Informe a quantidade.");

  const m = meds[i];
  const mesAtual = new Date().toISOString().slice(0,7);

  if (qtd > 0) {
    m.entradas += qtd;
  } else {
    if (!setor || setor === "Setor") return alert("Selecione o setor da saída.");
    const saida = Math.abs(qtd);
    if (saida > est(m)) return alert("Estoque insuficiente.");

    m.saidas += saida;

    rel[mesAtual] ??= {};
    rel[mesAtual][setor] ??= {};
    rel[mesAtual][setor][m.nome] ??= 0;
    rel[mesAtual][setor][m.nome] += saida;
  }

  $("#q-" + i).value = 0;
  $("#set-" + i).value = "Setor";
  save();
  renderEstoque();
  renderRelatorio();
  renderGrafico();
};

window.corrigir = i => {
  const m = meds[i];
  const s = prompt(`Corrigir ${m.nome}\nInicial,Entradas,Saídas`, `${m.estoqueInicial},${m.entradas},${m.saidas}`);
  if (!s) return;
  const p = s.split(",").map(n => parseInt(n, 10));
  if (p.length !== 3 || p.some(isNaN)) return alert("Dados inválidos.");
  [m.estoqueInicial, m.entradas, m.saidas] = p;
  save();
  renderEstoque();
  renderRelatorio();
  renderGrafico();
};

$("#reset").onclick = () => {
  if(confirm("Resetar estoque?")){
    carregarPadraoComRelatorio();
  }
};

$("#tab-estoque").onclick = () => {
  $("#tab-estoque").classList.add("active");
  $("#tab-relatorio").classList.remove("active");
  $("#estoque-content").style.display = "block";
  $("#relatorio-content").style.display = "none";
};

$("#tab-relatorio").onclick = () => {
  $("#tab-relatorio").classList.add("active");
  $("#tab-estoque").classList.remove("active");
  $("#estoque-content").style.display = "none";
  $("#relatorio-content").style.display = "block";
  renderRelatorio();
};

$("#tab-grafico").onclick = () => {
  $("#tab-grafico").classList.add("active");
  $("#tab-estoque").classList.remove("active");
  $("#tab-relatorio").classList.remove("active");
  $("#estoque-content").style.display = "none";
  $("#relatorio-content").style.display = "none";
  $("#grafico-content").style.display = "block";
  renderGrafico();
};

$("#btn-entrar").onclick = () => {
  $("#login-screen").style.display = "none";
  $("#app-screen").style.display = "block";
  save();
  renderEstoque();
  renderRelatorio();
  renderGrafico();
};

window.onload = () => {
  const lu = localStorage.getItem("lastUpdate");
  if(lu) $("#last-update").textContent = "Última atualização: " + new Date(lu).toLocaleString("pt-BR");
  initParticles();
};

// Gráfico com Chart.js
let chartInstance = null;

function renderGrafico(){
  const ctx = document.getElementById("graficoEstoque").getContext("2d");

  const meses = Object.keys(rel).sort();

  let setoresPresentes = new Set();
  meses.forEach(mes => {
    Object.keys(rel[mes]).forEach(setor => {
      const setorGeral = setorGeralMap[setor] || setor;
      setoresPresentes.add(setorGeral);
    });
  });
  setoresPresentes = [...setoresPresentes].sort();

  const datasets = setoresPresentes.map((setorGeral, i) => {
    return {
      label: setorGeral,
      data: meses.map(mes => {
        const dadosMes = rel[mes];
        let soma = 0;
        Object.keys(dadosMes).forEach(setor => {
          if((setorGeralMap[setor] || setor) === setorGeral){
            const medsSetor = dadosMes[setor];
            Object.values(medsSetor).forEach(qtd => soma += qtd);
          }
        });
        return soma;
      }),
      backgroundColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
      borderWidth: 1
    };
  });

  if(chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 15,
            padding: 15,
            font: { size: 14, weight: 'bold' }
          }
        },
        title: {
          display: true,
          text: 'Saídas Mensais por Setor Geral',
          font: { size: 18, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Quantidade de Saídas' }
        },
        x: {
          title: { display: true, text: 'Meses (YYYY-MM)' }
        }
      }
    }
  });
}

// Partículas para a tela de login
function initParticles(){
  const canvas = document.getElementById("particles-canvas");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  const particles = [];
  const maxParticles = 80;

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function random(min,max){ return Math.random()*(max-min)+min; }

  class Particle{
    constructor(){
      this.x = random(0,width);
      this.y = random(0,height);
      this.radius = random(1,3);
      this.speedX = random(-0.3,0.3);
      this.speedY = random(-0.3,0.3);
      this.alpha = random(0.1,0.7);
    }
    update(){
      this.x += this.speedX;
      this.y += this.speedY;

      if(this.x < 0 || this.x > width) this.speedX = -this.speedX;
      if(this.y < 0 || this.y > height) this.speedY = -this.speedY;
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
      ctx.fillStyle = `rgba(0,170,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for(let i=0;i<maxParticles;i++){
    particles.push(new Particle());
  }

  function animate(){
    ctx.clearRect(0,0,width,height);
    particles.forEach(p=>{
      p.update();
      p.draw();
    });

    for(let i=0;i<maxParticles;i++){
      for(let j=i+1;j<maxParticles;j++){
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x-p2.x;
        const dy = p1.y-p2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,170,255,${(120-dist)/120 * 0.3})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p1.x,p1.y);
          ctx.lineTo(p2.x,p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
