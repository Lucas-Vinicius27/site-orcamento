const modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active');
    }
};

const transaction = [
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
];

const balance = {
    all: transaction,
    add(transaction) {
        this.all.push(transaction);
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
        document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(balance.incomes());
        document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(balance.expenses());
        document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(balance.total());
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

const App = {
    init() {
        balance.all.forEach((transaction) => {
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

balance.add({
            id: 4,
            description: 'APP',
            amount: 200000,
            date: '24/01/2021'
        });