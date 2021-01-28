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
    }
];

const balance = {
    incomes() { },
    expenses() { },
    total() { }
};

const tbody = {
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
    }
};

const utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : '';
        return value;
    }
};

transaction.forEach((transaction) => {
    tbody.addTransaction(transaction);
});