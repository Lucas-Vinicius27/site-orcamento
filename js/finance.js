class Finance {
    constructor() {
        this.modal = document.querySelector('.modal-overlay').classList;
        this.modalEdit = document.querySelector('#modalEdit').classList;
        this.indexArray = 0;
        this.all = this.getStorage();
        this.transactionContainer = document.querySelector('#data-table tbody');
        this.description = document.querySelector('input#description');
        this.descriptionEdit = document.querySelector('input#descriptionEdit');
        this.amount = document.querySelector('input#amount');
        this.amountEdit = document.querySelector('input#amountEdit');
        this.date = document.querySelector('input#date');
        this.dateEdit = document.querySelector('input#dateEdit');
    }

    init() {
        const finance = this;
        finance.all.forEach(finance.addTransaction);
        finance.updateBalance();
        finance.setStorage(finance.all);
    }

    reload() {
        const finance = this;
        finance.clearTransaction();
        finance.init();
    }

    toggleModal() {
        const finance = this;
        finance.modal.toggle('active');
    }

    toggleModalEdit() {
        const finance = this;
        finance.modalEdit.toggle('active');
    }

    getStorage() {
        return JSON.parse(localStorage.getItem('transaction')) || [];
    }

    setStorage(transaction) {
        localStorage.setItem('transaction', JSON.stringify(transaction));
    }

    add(transaction) {
        const finance = this;
        finance.all.push(transaction);
        finance.reload();
    }

    addEdit(transaction) {
        const finance = this;
        const editTransaction = transaction;
        const novoAll = finance.all.map((transaction, indice) => {
            if (finance.indexArray === indice) {
                transaction.description = editTransaction.description;
                transaction.amount = editTransaction.amount;
                transaction.date = editTransaction.date;
            }
            return transaction;
        });
        finance.all = novoAll;
        finance.reload();
    }

    edit(index) {
        const finance = this;
        const splittedDate = finance.all[index].date.split('/');
        finance.indexArray = index;
        finance.toggleModalEdit();
        finance.descriptionEdit.value = finance.all[index].description;
        finance.amountEdit.value = finance.all[index].amount;
        finance.dateEdit.value = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
    }

    remove(index) {
        const finance = this;
        finance.all.splice(index, 1);
        finance.reload();
    }

    incomes() {
        const finance = this;
        let income = 0;
        finance.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        });
        return income;
    }

    expenses() {
        const finance = this;
        let expense = 0;
        finance.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        });
        return expense;
    }

    total() {
        const finance = this;
        return finance.incomes() + finance.expenses();
    }
    
    addTransaction(transaction, index) {
        const finance = new Finance();
        const tr = document.createElement('tr');
        tr.innerHTML = finance.innerHtmlTBody(transaction, index);
        tr.dataset.index = index;
        finance.transactionContainer.appendChild(tr);
    }
    
    innerHtmlTBody(transaction, index) {
        const finance = this;
        const cssClass = transaction.amount > 0 ? 'income' : 'expense';
        const amount = finance.formatCurrency(transaction.amount);
        const html = `<td class="description">${transaction.description}</td>
        <td class="${cssClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img class="pointer" src="images/edit.png" alt="Editar Transação" onclick="finance.edit(${index})">
        </td>
        <td>
            <img class="pointer" src="images/minus.svg" alt="Remover Transação" onclick="finance.remove(${index})">
        </td>`;
        return html;
    }

    updateBalance() {
        const finance = this;
        document.getElementById('incomeDisplay').innerHTML = finance.formatCurrency(finance.incomes());
        document.getElementById('expenseDisplay').innerHTML = finance.formatCurrency(finance.expenses());
        document.getElementById('totalDisplay').innerHTML = finance.formatCurrency(finance.total());
    }

    clearTransaction() {
        const finance = this;
        finance.transactionContainer.innerHTML = '';
    }

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : '';
        value = String(value).replace(/\D/g, '');
        value = Number(value) / 100;
        value = value.toLocaleString("pt-br", { style: 'currency', currency: 'BRL' });
        return signal + value;
    }

    formatAmount(value) {
        const signal = value < '0' ? '-' : '';
        value = String(value).replace(/\D/g, '');
        value = Number(signal + value);
        return Math.round(value);
    }

    formatDate(date) {
        const splittedDate = date.split('-');
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    }

    getValues() {
        const finance = this;
        return {
            description: finance.description.value,
            amount: finance.amount.value,
            date: finance.date.value
        };
    }

    getValuesEdit() {
        const finance = this;
        return {
            description: finance.descriptionEdit.value,
            amount: finance.amountEdit.value,
            date: finance.dateEdit.value,
        };
    }

    submit(event) {
        const finance = this;
        event.preventDefault();

        try {
            finance.validateFields();
            const transaction = finance.formatData();
            finance.add(transaction);
            finance.clearFields();
            finance.toggleModal();
        } catch (error) {
            alert(error.message);
        }
    }

    submitEdit(event) {
        const finance = this;
        event.preventDefault();

        try {
            finance.validateFieldsEdit();
            const transaction = finance.formatDataEdit();
            finance.addEdit(transaction);
            finance.toggleModalEdit();
        } catch (error) {
            alert(error.message);
        }
    }

    validateFields() {
        const finance = this;
        const { description, amount, date } = finance.getValues();
        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos!');
        }
    }

    validateFieldsEdit() {
        const finance = this;
        const { description, amount, date } = finance.getValuesEdit();
        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos!');
        }
    }

    formatData() {
        const finance = this;
        let { description, amount, date } = finance.getValues();
        amount = finance.formatAmount(amount);
        date = finance.formatDate(date);
        return {
            description,
            amount,
            date
        };
    }

    formatDataEdit() {
        const finance = this;
        let { description, amount, date } = finance.getValuesEdit();
        amount = finance.formatAmount(amount);
        date = finance.formatDate(date);
        return {
            description,
            amount,
            date
        };
    }

    clearFields() {
        const finance = this;
        finance.description.value = '';
        finance.amount.value = '';
        finance.date.value = '';
    }
}

const finance = new Finance();
finance.init();