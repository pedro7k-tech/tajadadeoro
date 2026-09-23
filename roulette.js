document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('roulette-overlay');
    const btnSpin = document.getElementById('btn-spin');
    const wheel = document.getElementById('wheel');
    const popup = document.getElementById('roulette-popup');
    const btnContinue = document.getElementById('btn-continue');
    
    if (!overlay) return;

    // Para testes, a roleta sempre aparece. (Descomente o código abaixo em produção)
    /*
    const hasSpun = localStorage.getItem('hasSpunRoulette');
    if (hasSpun) {
        overlay.classList.add('hidden');
    } else {
        document.body.style.overflow = 'hidden';
    }
    */
    document.body.style.overflow = 'hidden';

    const audioSpin = document.getElementById('audio-spin');
    const audioWin = document.getElementById('audio-win');

    let isSpinning = false;

    btnSpin.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        
        // Tocar som de giro
        if (audioSpin) {
            audioSpin.currentTime = 0;
            audioSpin.volume = 0.6;
            audioSpin.play().catch(e => console.log('Áudio bloqueado:', e));
        }
        
        // Desabilita o botão
        btnSpin.style.opacity = '0.5';
        btnSpin.style.cursor = 'not-allowed';
        
        // Cálculo da rotação:
        // A fatia 0 (R$ 40) está entre 0 e 51.42 graus (centro: 25.71).
        // Queremos que ela pare no ponteiro inferior (180 graus).
        // Rotação base para alinhar: 180 - 25.71 = 154.29 graus.
        // Adicionamos 5 voltas completas (1800 graus).
        const randomOffset = Math.floor(Math.random() * 20) - 10; // Variação de -10 a +10 graus para parecer mais natural
        const targetRotation = 1800 + 154.29 + randomOffset;
        
        wheel.style.transform = `rotate(${targetRotation}deg)`;
        
        // Aguarda a animação terminar (5 segundos de transição + 0.5s de delay)
        setTimeout(() => {
            // Pausar som de giro e tocar o de vitória
            if (audioSpin) audioSpin.pause();
            if (audioWin) {
                audioWin.currentTime = 0;
                audioWin.volume = 1.0;
                audioWin.play().catch(e => console.log('Áudio bloqueado:', e));
            }
            
            popup.classList.add('active');
            // localStorage.setItem('hasSpunRoulette', 'true');
            
            // Ação pós-roleta concluída
        }, 5500); 
    });

    btnContinue.addEventListener('click', () => {
        overlay.classList.add('hidden');
        document.body.style.overflow = ''; // Restaura o scroll
    });
});
