let data = [];  // Variável para armazenar os dados carregados

// Função para carregar  arquivo JSON
async function loadData() {
    try {
        const response = await fetch('dados/dados.json');  
        data = await response.json();                     
        initializeChart();                          
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Função para desenhar a legenda
function drawLegend(ctx) {
    const legendX = 10;
    const legendY = 10;
    const legendBoxSize = 15;
    const legendGap = 5;


    ctx.fillStyle = '#C96868'; 
    ctx.fillRect(legendX, legendY, legendBoxSize, legendBoxSize);
    ctx.font = '14px Lato';
    ctx.fillStyle = '#000';
    ctx.fillText('Mulheres', legendX + legendBoxSize + legendGap, legendY + legendBoxSize - 3);

    ctx.fillStyle = '#7EACB5'; 
    ctx.fillRect(legendX + 100, legendY, legendBoxSize, legendBoxSize); 
    ctx.font = '14px Lato';
    ctx.fillStyle = '#000';
    ctx.fillText('Homens', legendX + legendBoxSize + legendGap + 100, legendY + legendBoxSize - 3);
}
// Função para desenhar o gráfico
function drawChart(ano) {
    const filteredData = data.filter(d => d.Ano === ano);
    const topCourses = filteredData.sort((a, b) => b.Total - a.Total).slice(0, 10);
    const cursos = topCourses.map(d => d.Curso);
    const mulheres = topCourses.map(d => d.Mulheres);
    const homens = topCourses.map(d => d.Homens);
    const totais = topCourses.map(d => d.Total);

    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    drawLegend(ctx);

    // Configurações das barras
    const barHeight = 20;
    const barGap = 1; 
    const groupGap = 20;
    const maxBarWidth = 300;
    const scaleStartX = 200; 
    const maxValue = Math.max(...mulheres, ...homens);
    ctx.font = '14px Lato'; 


    // Desenho das barras
    cursos.forEach((curso, index) => {
        const y = index * (barHeight + groupGap) + 50; 

        // barra das mulheres à esquerda
        const womenBarWidth = (mulheres[index] / maxValue) * maxBarWidth;
        ctx.fillStyle = '#C96868';
        ctx.fillRect(scaleStartX, y, womenBarWidth, barHeight);

        // barra dos homens à direita
        const menBarWidth = (homens[index] / maxValue) * maxBarWidth;
        ctx.fillStyle = '#7EACB5';
        ctx.fillRect(scaleStartX + womenBarWidth + barGap, y, menBarWidth, barHeight);

        // Desenho do rótulo do curso à esquerda das barras 
        ctx.fillStyle = '#000';
        ctx.fillText(curso, 10, y + barHeight / 2); 

        // Desenho do total à direita das barras
        const totalBarWidth = womenBarWidth + menBarWidth + barGap; 
        ctx.fillStyle = '#333';
        ctx.fillText(totais[index].toLocaleString(), scaleStartX + totalBarWidth + 10, y + barHeight / 2); 
        ctx.font = '14px Lato';
    });
}

// Função para inicializar os botões e o gráfico
function initializeChart() {
    const anos = [...new Set(data.map(d => d.Ano))];
    const canvas = document.getElementById('chartCanvas');

    anos.forEach(ano => {
        const button = document.createElement('button');
        button.innerText = ano;
        button.onclick = () => {
            drawChart(ano);
            setActiveButton(button);
        };
        document.getElementById('buttons').appendChild(button);
    });

    // Desenha o gráfico inicial com o primeiro ano disponível e marcar o botão como ativo
    drawChart(anos[0]);
    setActiveButton(document.querySelector('#buttons button'));
}

// Função para definir o botão ativo
function setActiveButton(activeButton) {
    document.querySelectorAll('#buttons button').forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

loadData();
