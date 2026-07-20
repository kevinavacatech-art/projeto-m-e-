document.addEventListener("DOMContentLoaded", () => {
    
    // --- CONTROLE DE MODO CLARO/ESCURO ---
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn.querySelector("i");
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        
        if (currentTheme === "dark") {
            document.documentElement.removeAttribute("data-theme");
            themeIcon.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            themeIcon.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        }
    });

    // --- LEITOR DE TELA (ACCESSIBILIDADE DE VOZ) ---
    const audioBtn = document.getElementById("audio-reader-btn");
    const audioIcon = audioBtn.querySelector("i");
    const readableContent = document.getElementById("readable-content");
    
    let isReading = false;
    let speechUtterance = null;

    // Função que extrai os textos organizados do site para leitura linear
    function getPageText() {
        const elements = readableContent.querySelectorAll("h1, h2, h3, p");
        let textToRead = "";
        
        elements.forEach(el => {
            textToRead += el.innerText + ". ";
        });
        
        return textToRead;
    }

    function speakText() {
        const text = getPageText();
        
        // Cancela leituras anteriores ativas
        window.speechSynthesis.cancel();

        speechUtterance = new SpeechSynthesisUtterance(text);
        speechUtterance.lang = "pt-BR"; // Configura a voz para Português
        
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(voice => voice.lang.includes("pt-BR") || voice.lang.includes("pt"));
        if (ptVoice) {
            speechUtterance.voice = ptVoice;
        }

        // Fim da fala natural
        speechUtterance.onend = () => {
            stopReading();
        };

        // Trata erros de voz
        speechUtterance.onerror = () => {
            stopReading();
        };

        window.speechSynthesis.speak(speechUtterance);
        
        isReading = true;
        audioBtn.classList.add("reading-active");
        audioIcon.className = "fas fa-volume-mute"; // Ícone muda para 'mutar'
        audioBtn.setAttribute("title", "Pausar leitura");
    }

    function stopReading() {
        window.speechSynthesis.cancel();
        isReading = false;
        audioBtn.classList.remove("reading-active");
        audioIcon.className = "fas fa-volume-up";
        audioBtn.setAttribute("title", "Ouvir texto da página");
    }

    audioBtn.addEventListener("click", () => {
        if (!('speechSynthesis' in window)) {
            alert("Seu navegador não suporta a função de acessibilidade por áudio.");
            return;
        }

        if (isReading) {
            stopReading();
        } else {
            speakText();
        }
    });

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
});