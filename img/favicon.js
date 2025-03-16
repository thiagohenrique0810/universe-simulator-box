// Script para gerar um favicon procedural para o simulador do sistema solar
// Este script cria uma imagem de um sistema planetário estilizado

// Importar a versão estática do favicon como fallback
import { applyStaticFavicon } from './favicon-static.js';

// Função para gerar o favicon
function generateFavicon() {
    // Criar um canvas para desenhar o favicon
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Fundo do espaço (preto com gradiente sutil)
    const bgGradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 64);
    bgGradient.addColorStop(0, '#0a0a20');
    bgGradient.addColorStop(1, '#000005');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Adicionar algumas estrelas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 64;
        const y = Math.random() * 64;
        const size = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Desenhar o sol (centro)
    const sunGradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 12);
    sunGradient.addColorStop(0, '#ffdd33');
    sunGradient.addColorStop(1, '#ff8800');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(32, 32, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Adicionar brilho ao sol
    ctx.fillStyle = 'rgba(255, 255, 150, 0.2)';
    ctx.beginPath();
    ctx.arc(32, 32, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Desenhar órbitas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.5;
    
    // Primeira órbita
    ctx.beginPath();
    ctx.arc(32, 32, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Segunda órbita
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.stroke();
    
    // Desenhar planetas
    // Planeta 1 (azul - Terra)
    ctx.fillStyle = '#3399ff';
    ctx.beginPath();
    ctx.arc(32 + 20 * Math.cos(Math.PI/4), 32 + 20 * Math.sin(Math.PI/4), 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Planeta 2 (vermelho - Marte)
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.arc(32 + 28 * Math.cos(-Math.PI/3), 32 + 28 * Math.sin(-Math.PI/3), 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Retornar a URL de dados do favicon
    return canvas.toDataURL('image/png');
}

// Função para aplicar o favicon ao documento
function applyFavicon() {
    const faviconUrl = generateFavicon();
    
    // Remover favicon existente, se houver
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        document.head.removeChild(existingFavicon);
    }
    
    // Criar e adicionar o novo favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = faviconUrl;
    document.head.appendChild(link);
    
    console.log('Favicon gerado e aplicado com sucesso!');
}

// Exportar as funções
export { generateFavicon, applyFavicon, applyStaticFavicon }; 