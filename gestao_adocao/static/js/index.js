let currentIndex = 0;
let autoSlide;
const track = document.getElementById('cardsDogs');

function moveSlide(direction) {
    const cards = document.querySelectorAll('.dogCard');
    const container = document.querySelector('.carousel-container');
    
    // 1. Calcular larguras
    const cardWidth = cards[0].offsetWidth + 20; // largura + gap
    const visibleCards = Math.floor(container.offsetWidth / cardWidth);
    
    // 2. Definir o limite máximo
    // O limite é o total de cards menos quantos aparecem na tela
    const maxIndex = cards.length - visibleCards;

    currentIndex += direction;

    // 3. Lógica do Ciclo Infinito
    if (currentIndex > maxIndex) {
        currentIndex = 0; // Volta para o começo
    } else if (currentIndex < 0) {
        currentIndex = maxIndex; // Vai para o final
    }

    // 4. Executar o movimento
    const moveAmount = currentIndex * cardWidth;
    track.style.transform = `translateX(-${moveAmount}px)`;
}

// Ajustar carrossel quando a janela mudar de tamanho
window.addEventListener('resize', () => moveSlide(0));

function startAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => moveSlide(1), 3000);
}

// Inicia o carrossel
startAutoSlide();