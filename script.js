const transactionsUl = document.querySelector("#transactions")
const balanceDisplay = document.querySelector("#balance")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")


const localStorageTransactions = JSON.parse(localStorage
    .getItem("transactions"))

let transactions = localStorage
    .getItem("transactions") !== null ? localStorageTransactions : []

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

function addTransactions({ id, name, amount }) {
    const operator = amount < 0 ? "-" : "+"
    const CSSClass = amount < 0 ? "minus" : "plus"
    const amountAbs = Math.abs(amount)
    const li = document.createElement("li")

    li.classList.add(CSSClass)
    li.innerHTML = `
    ${name} <span>${operator} R$ ${amountAbs.toFixed(2)}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.prepend(li)
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id)
    updateLocalStorage()
    init()
}

function getTotal(transactionsAmounts) {
    return transactionsAmounts
        .reduce((acc, transaction) => acc + transaction, 0)
        .toFixed(2)
}

function getIncome(transactionsAmounts) {
    return transactionsAmounts
        .filter(transaction => transaction >= 0)
        .reduce((acc, transaction) => acc + transaction, 0)
        .toFixed(2)
}

function getExpense(transactionsAmounts) {
    return Math.abs(transactionsAmounts
        .filter(transaction => transaction < 0)
        .reduce((acc, transaction) => acc + transaction, 0))
        .toFixed(2)
}

function updateBalanceValues() {
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount )

    balanceDisplay.textContent = `R$ ${getTotal(transactionsAmounts)}`
    incomeDisplay.textContent = `R$ ${getIncome(transactionsAmounts)}`
    expenseDisplay.textContent = `R$ ${getExpense(transactionsAmounts)}`
}

function generateId() {
    return Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
}

function init() {
    transactionsUl.innerHTML = ""
    transactions.forEach(addTransactions)
    updateBalanceValues()
}

function addToTransactionArray(transactionName, transactionAmount) {
    transactions.push({
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

function clearInputs() {
    inputTransactionName.value = ""
    inputTransactionAmount.value = ""
}

function handleFormSubmit(event) {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    if(!transactionName || !transactionAmount) { 
        alert("Informe Nome e Valor da transação") 
        return
    }

    addToTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    clearInputs()
}

init()
form.addEventListener("submit", handleFormSubmit)