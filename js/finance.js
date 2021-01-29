const modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active');
    }
};

const requestApp = {
    all: [
        {
            id: 1,
            description: 'Luz',
            amount: -50000,
            date: '23/01/2021',
        },
        {
            id: 2,
            description: 'Criação Website',
            amount: 500000,
            date: '23/01/2021',
        },
        {
            id: 3,
            description: 'Internet',
            amount: -20000,
            date: '23/01/2021',
        },
    ],
    add(transaction) {
        this.all.push(transaction);
        App.reload();
    },
    remove(index) {
        this.all.splice(index, 1);
        App.reload();
    },
    incomes() {
        let income = 0;
        this.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        });
        return income;
    },
    expenses() {
        let expense = 0;
        this.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        });
        return expense;
    },
    total() {
        return this.incomes() + this.expenses();
    }
};

const main = {
    transactionContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = this.innerHTMLTBody(transaction);
        this.transactionContainer.appendChild(tr);
    },
    innerHTMLTBody(transaction) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
        const amount = utils.formatCurrency(transaction.amount);
        const html =`<td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="images/minus.svg" alt="Remover Transação">
        </td>`;
        return html;
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(requestApp.incomes());
        document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(requestApp.expenses());
        document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(requestApp.total());
    },
    clearTransaction() {
        this.transactionContainer.innerHTML = '';
    }
};

const utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : '';
        value = String(value).replace(/\D/g, '');
        value = Number(value) / 100;
        value = value.toLocaleString("pt-br", { style: 'currency', currency: 'BRL' });
        return signal + value;
    }
};

const Form = {
};

const App = {
    init() {
        requestApp.all.forEach((transaction) => {
            main.addTransaction(transaction);
        });

        main.updateBalance();
    },
    reload() {
        main.clearTransaction();
        this.init();
    }
}

App.init();