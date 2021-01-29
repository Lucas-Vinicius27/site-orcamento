const modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active');
    }
};

const StorageApp = {
    get() {
        return JSON.parse(localStorage.getItem('transaction')) || []
    },
    set(transactions) {
        localStorage.setItem('transaction', JSON.stringify(transactions));
    }
};

const requestApp = {
    all: StorageApp.get(),
    add(transaction) {
        requestApp.all.push(transaction);
        App.reload();
    },
    remove(index) {
        requestApp.all.splice(index, 1);
        App.reload();
    },
    incomes() {
        let income = 0;
        requestApp.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        });
        return income;
    },
    expenses() {
        let expense = 0;
        requestApp.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        });
        return expense;
    },
    total() {
        return requestApp.incomes() + requestApp.expenses();
    }
};

const main = {
    transactionContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = main.innerHTMLTBody(transaction, index);
        tr.dataset.index = index;
        main.transactionContainer.appendChild(tr);
    },
    innerHTMLTBody(transaction, index) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
        const amount = utils.formatCurrency(transaction.amount);
        const html =`<td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="images/minus.svg" alt="Remover Transação" onclick="requestApp.remove(${index})">
        </td>`;
        return html;
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(requestApp.incomes());
        document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(requestApp.expenses());
        document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(requestApp.total());
    },
    clearTransaction() {
        main.transactionContainer.innerHTML = '';
    }
};

const utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : '';
        value = String(value).replace(/\D/g, '');
        value = Number(value) / 100;
        value = value.toLocaleString("pt-br", { style: 'currency', currency: 'BRL' });
        return signal + value;
    },
    formatAmount(value) {
        return Number(value) * 100;
    },
    formatDate(date) {
        const splittedDate = date.split('-');
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },
};

const Form = {
    description: document.querySelector('input#descripton'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        };
    },
    submit(event) {
        event.preventDefault();
        try {
            Form.validateFields();
            const transaction = Form.formatData();
            requestApp.add(transaction);
            Form.clearFields();
            modal.close();
        }
        catch (error) {
            alert(error.message);
        }
    },
    validateFields() {
        const { description, amount, date } = Form.getValues();
        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos!');
        }
    },
    formatData() {
        let { description, amount, date } = Form.getValues();
        amount = utils.formatCurrency(amount);
        date = utils.formatDate(date);
        return {
            description,
            amount,
            date
        };
    },
    clearFields() {
        Form.description.value = '';
        Form.amount.value = '';
        Form.date.value = '';
    },
};

const App = {
    init() {
        requestApp.all.forEach(main.addTransaction);
        main.updateBalance();
        StorageApp.set(requestApp.all);
    },
    reload() {
        main.clearTransaction();
        App.init();
    }
};

App.init();