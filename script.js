// Expense Management Application
class ExpenseManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.categories = {
            income: [
                'Lương',
                'Thưởng',
                'Đầu tư',
                'Kinh doanh',
                'Khác'
            ],
            expense: [
                'Ăn uống',
                'Di chuyển',
                'Nhà ở',
                'Mua sắm',
                'Giải trí',
                'Y tế',
                'Giáo dục',
                'Tiện ích',
                'Khác'
            ]
        };
        this.currentTransactionType = null;
        this.editingTransactionId = null;
        this.expenseChart = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateCategories();
        this.updateSummary();
        this.renderTransactions();
        this.updateChart();
        this.setDefaultDate();
    }

    setupEventListeners() {
        // Add transaction buttons
        document.getElementById('addIncomeBtn').addEventListener('click', () => {
            this.showTransactionForm('income');
        });

        document.getElementById('addExpenseBtn').addEventListener('click', () => {
            this.showTransactionForm('expense');
        });

        // Form submission
        document.getElementById('transactionFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransactionSubmit();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideTransactionForm();
        });

        // Filters
        document.getElementById('filterType').addEventListener('change', () => {
            this.renderTransactions();
        });

        document.getElementById('filterCategory').addEventListener('change', () => {
            this.renderTransactions();
        });

        // Modal events
        const modal = document.getElementById('editModal');
        const closeBtn = document.querySelector('.close');
        const cancelEditBtn = document.getElementById('cancelEditBtn');

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        cancelEditBtn.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Edit form submission
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditSubmit();
        });
    }

    populateCategories() {
        const categorySelect = document.getElementById('category');
        const editCategorySelect = document.getElementById('editCategory');
        const filterCategorySelect = document.getElementById('filterCategory');

        // Clear existing options
        categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
        editCategorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
        filterCategorySelect.innerHTML = '<option value="all">Tất cả danh mục</option>';

        // Add categories based on current transaction type
        if (this.currentTransactionType) {
            const categories = this.categories[this.currentTransactionType];
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }

        // Add all categories to filter
        Object.values(this.categories).flat().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterCategorySelect.appendChild(option);
        });
    }

    showTransactionForm(type) {
        this.currentTransactionType = type;
        this.populateCategories();
        
        const form = document.getElementById('transactionForm');
        const formTitle = document.getElementById('formTitle');
        
        formTitle.textContent = type === 'income' ? 'Thêm Thu Nhập' : 'Thêm Chi Tiêu';
        form.style.display = 'block';
        form.classList.add('fade-in');
        
        // Reset form
        document.getElementById('transactionFormElement').reset();
        this.setDefaultDate();
    }

    hideTransactionForm() {
        const form = document.getElementById('transactionForm');
        form.style.display = 'none';
        this.currentTransactionType = null;
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    handleTransactionSubmit() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        if (!description || !amount || !category || !date) {
            this.showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        const transaction = {
            id: Date.now(),
            type: this.currentTransactionType,
            description,
            amount,
            category,
            date,
            createdAt: new Date().toISOString()
        };

        this.transactions.unshift(transaction);
        this.saveToLocalStorage();
        this.updateSummary();
        this.renderTransactions();
        this.updateChart();
        this.hideTransactionForm();
        this.showNotification('Giao dịch đã được thêm thành công!', 'success');
    }

    renderTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        const filterType = document.getElementById('filterType').value;
        const filterCategory = document.getElementById('filterCategory').value;

        let filteredTransactions = this.transactions;

        // Apply type filter
        if (filterType !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
        }

        // Apply category filter
        if (filterCategory !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
        }

        if (filteredTransactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <h3>Không có giao dịch nào</h3>
                    <p>Hãy thêm giao dịch đầu tiên của bạn!</p>
                </div>
            `;
            return;
        }

        transactionsList.innerHTML = filteredTransactions.map(transaction => {
            const formattedAmount = this.formatCurrency(transaction.amount);
            const formattedDate = this.formatDate(transaction.date);
            
            return `
                <div class="transaction-item fade-in" data-id="${transaction.id}">
                    <div class="transaction-info">
                        <div class="transaction-icon ${transaction.type}">
                            <i class="fas fa-${transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}"></i>
                        </div>
                        <div class="transaction-details">
                            <h4>${transaction.description}</h4>
                            <p>${transaction.category} • ${formattedDate}</p>
                        </div>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${formattedAmount}
                    </div>
                    <div class="transaction-actions">
                        <button class="action-btn edit" onclick="expenseManager.editTransaction(${transaction.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="expenseManager.deleteTransaction(${transaction.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        this.editingTransactionId = id;
        this.currentTransactionType = transaction.type;
        
        // Populate edit form
        document.getElementById('editDescription').value = transaction.description;
        document.getElementById('editAmount').value = transaction.amount;
        document.getElementById('editDate').value = transaction.date;
        
        // Populate categories for edit form
        const editCategorySelect = document.getElementById('editCategory');
        editCategorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
        this.categories[transaction.type].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            if (category === transaction.category) {
                option.selected = true;
            }
            editCategorySelect.appendChild(option);
        });

        this.openModal();
    }

    openModal() {
        document.getElementById('editModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTransactionId = null;
    }

    handleEditSubmit() {
        const description = document.getElementById('editDescription').value.trim();
        const amount = parseFloat(document.getElementById('editAmount').value);
        const category = document.getElementById('editCategory').value;
        const date = document.getElementById('editDate').value;

        if (!description || !amount || !category || !date) {
            this.showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        const transactionIndex = this.transactions.findIndex(t => t.id === this.editingTransactionId);
        if (transactionIndex === -1) return;

        this.transactions[transactionIndex] = {
            ...this.transactions[transactionIndex],
            description,
            amount,
            category,
            date,
            updatedAt: new Date().toISOString()
        };

        this.saveToLocalStorage();
        this.updateSummary();
        this.renderTransactions();
        this.updateChart();
        this.closeModal();
        this.showNotification('Giao dịch đã được cập nhật thành công!', 'success');
    }

    deleteTransaction(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;

        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.updateSummary();
        this.renderTransactions();
        this.updateChart();
        this.showNotification('Giao dịch đã được xóa thành công!', 'success');
    }

    updateSummary() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpense').textContent = this.formatCurrency(totalExpense);
        document.getElementById('balance').textContent = this.formatCurrency(balance);

        // Update balance color
        const balanceElement = document.getElementById('balance');
        balanceElement.className = 'amount ' + (balance >= 0 ? 'income' : 'expense');
    }

    updateChart() {
        const expenseTransactions = this.transactions.filter(t => t.type === 'expense');
        const categoryData = {};

        expenseTransactions.forEach(transaction => {
            if (categoryData[transaction.category]) {
                categoryData[transaction.category] += transaction.amount;
            } else {
                categoryData[transaction.category] = transaction.amount;
            }
        });

        const ctx = document.getElementById('expenseChart').getContext('2d');
        
        if (this.expenseChart) {
            this.expenseChart.destroy();
        }

        if (Object.keys(categoryData).length === 0) {
            document.getElementById('expenseChart').style.display = 'none';
            return;
        }

        document.getElementById('expenseChart').style.display = 'block';

        this.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#C9CBCF',
                        '#4BC0C0'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed.toLocaleString('vi-VN')} ₫ (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export data functionality
    exportData() {
        const data = {
            transactions: this.transactions,
            summary: {
                totalIncome: this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
                totalExpense: this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
                balance: this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
                        this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Dữ liệu đã được xuất thành công!', 'success');
    }

    // Import data functionality
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.transactions && Array.isArray(data.transactions)) {
                    this.transactions = data.transactions;
                    this.saveToLocalStorage();
                    this.updateSummary();
                    this.renderTransactions();
                    this.updateChart();
                    this.showNotification('Dữ liệu đã được nhập thành công!', 'success');
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                this.showNotification('Lỗi khi nhập dữ liệu!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application
const expenseManager = new ExpenseManager();

// Add export/import functionality to window for easy access
window.exportData = () => expenseManager.exportData();
window.importData = (file) => expenseManager.importData(file);

// Add some sample data for demonstration
if (expenseManager.transactions.length === 0) {
    const sampleData = [
        {
            id: Date.now() - 4,
            type: 'income',
            description: 'Lương tháng 12',
            amount: 15000000,
            category: 'Lương',
            date: '2024-12-01',
            createdAt: new Date(Date.now() - 4).toISOString()
        },
        {
            id: Date.now() - 3,
            type: 'expense',
            description: 'Mua sắm cuối tuần',
            amount: 500000,
            category: 'Mua sắm',
            date: '2024-12-02',
            createdAt: new Date(Date.now() - 3).toISOString()
        },
        {
            id: Date.now() - 2,
            type: 'expense',
            description: 'Ăn trưa',
            amount: 150000,
            category: 'Ăn uống',
            date: '2024-12-03',
            createdAt: new Date(Date.now() - 2).toISOString()
        },
        {
            id: Date.now() - 1,
            type: 'income',
            description: 'Thưởng dự án',
            amount: 2000000,
            category: 'Thưởng',
            date: '2024-12-04',
            createdAt: new Date(Date.now() - 1).toISOString()
        }
    ];
    
    expenseManager.transactions = sampleData;
    expenseManager.saveToLocalStorage();
    expenseManager.updateSummary();
    expenseManager.renderTransactions();
    expenseManager.updateChart();
} 