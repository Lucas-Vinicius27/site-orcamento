class DarkMode {
    constructor() {
        this.html = document.querySelector('html').classList;
        this.inputCheckbox = document.querySelector('input#dark-mode');
    }

    init() {
        const darkMode = this;
        darkMode.inputCheckbox.checked = darkMode.getStorage();
        darkMode.checkInput();
    }

    checkInput() {
        const darkMode = this;
        if (darkMode.inputCheckbox.checked) {
            darkMode.toggleHtml();
        }
        darkMode.inputCheckbox.addEventListener('click', () => {
            darkMode.toggleHtml();
            darkMode.setStorage();
        });
    }

    toggleHtml() {
        const darkMode = this;
        darkMode.html.toggle('dark-mode');
    }

    getStorage() {
        return JSON.parse(localStorage.getItem('dark-mode')) || false;
    }

    setStorage() {
        const darkMode = this;
        localStorage.setItem('dark-mode', JSON.stringify(darkMode.inputCheckbox.checked));
    }
}

const darkMode = new DarkMode();
darkMode.init();