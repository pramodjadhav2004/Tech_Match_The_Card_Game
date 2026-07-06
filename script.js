document.addEventListener('DOMContentLoaded', function () {
    const TECH_ICONS = ['🌐', '🎨', '🐍', '☕', '⚛️', '🐘', '🐛', '🗄️', '🚀', '☁️', '🤖', '🔐'];

    let fmmCards = [], fmmFlipped = [], fmmMatched = new Set();
    let fmmFlipCount = 0, fmmErrorCount = 0, fmmTimerInt = null, fmmSecs = 0;
    let fmmStarted = false, fmmLocked = false;

    const fmmBoardEl = document.getElementById('fmm-board');
    const fmmTimerEl = document.getElementById('fmm-timer');
    const fmmFlipsEl = document.getElementById('fmm-flips');
    const fmmErrorsEl = document.getElementById('fmm-errors');
    const fmmStartBtn = document.getElementById('fmm-start-btn');
    const fmmResetBtn = document.getElementById('fmm-reset-btn');
    const fmmWinMsg = document.getElementById('fmm-win-msg');
    const fmmWinStats = document.getElementById('fmm-win-stats');
    
    function fmmFmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
    function fmmShuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = 0 | (Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
    
    function fmmBuildBoard() {
        if (!fmmBoardEl) return;
        fmmBoardEl.innerHTML = '';
        fmmCards = fmmShuffle([...TECH_ICONS, ...TECH_ICONS].map((icon, i) => ({ icon: icon, uid: i })));
        fmmCards.forEach((card, idx) => {
            const el = document.createElement('div');
            el.className = 'fmm-card';
            el.dataset.idx = idx;
            el.dataset.icon = card.icon; 
            el.innerHTML = `<div class="fmm-face fmm-front">⌨️</div><div class="fmm-face fmm-back">${card.icon}</div>`;
            el.addEventListener('click', fmmOnClick);
            fmmBoardEl.appendChild(el);
        }); 
    } 


    function fmmOnClick(e) {
        if (!fmmStarted || fmmLocked) return;
        const el = e.currentTarget;
        const idx = parseInt(el.dataset.idx, 10);
        
        if (fmmMatched.has(idx) || fmmFlipped.find(c => c.idx === idx) || fmmFlipped.length >= 2) return;

        el.classList.add('fmm-flipped');
        fmmFlipped.push({ idx, el, icon: el.dataset.icon });
        fmmFlipCount++;
        if (fmmFlipsEl) fmmFlipsEl.textContent = fmmFlipCount;

        if (fmmFlipped.length === 2) {
            fmmLocked = true;
            setTimeout(fmmCheck, 900);
        }
    }

    function fmmCheck() {
        const [a, b] = fmmFlipped;
        if (a.icon === b.icon) {
            a.el.classList.add('fmm-matched'); b.el.classList.add('fmm-matched');
            fmmMatched.add(a.idx); fmmMatched.add(b.idx);
            fmmFlipped = []; fmmLocked = false;
            if (fmmMatched.size === fmmCards.length) fmmWin();
        } else {
            fmmErrorCount++;
            if (fmmErrorsEl) fmmErrorsEl.textContent = fmmErrorCount;
            a.el.classList.add('fmm-shake'); b.el.classList.add('fmm-shake');
            setTimeout(() => {
                a.el.classList.remove('fmm-flipped', 'fmm-shake');
                b.el.classList.remove('fmm-flipped', 'fmm-shake');
                fmmFlipped = []; fmmLocked = false;
            }, 1000);
        }
    }
});