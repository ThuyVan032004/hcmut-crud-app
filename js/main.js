// Mở form đăng nhập
document.getElementById('openFormBtn').addEventListener('click', function () {
    document.getElementById('formContainer').style.display = 'block';
});

// Đóng form đăng nhập
function closeLoginForm() {
    document.getElementById('formContainer').style.display = 'none';
}
document.querySelector('.close-btn').addEventListener('click', closeLoginForm);

// Chuyển tab trong form đăng nhập
function openTab(event, tabId) {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => link.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

document.getElementById('defaultTab').click();

const tabs = document.querySelectorAll('.tab-container button');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        console.log(`Tab ${tab.textContent} được chọn.`);
    });
});

// Hàm thêm vào bảng
document.addEventListener("DOMContentLoaded", function () {
    const addRowBtn = document.getElementById("addRowBtn");
    const addRowForm = document.getElementById("addRowForm");
    const newRowForm = document.getElementById("newRowForm");
    const closeFormBtn = document.querySelector(".close-btn");

    // Mở form thêm hàng
    addRowBtn.addEventListener("click", function () {
        addRowForm.style.display = "block";
    });

    // Đóng form thêm hàng
    function closeForm() {
        addRowForm.style.display = "none";
    }

    // Xử lý khi submit form
    newRowForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Lấy giá trị từ form
        const newRow = [
            document.getElementById("PersonType").value,
            document.getElementById("NameStyle").value,
            document.getElementById("FirstName").value,
            document.getElementById("LastName").value,
            document.getElementById("EmailPromotion").value,
            document.getElementById("EmailAddress").value,
            document.getElementById("AddressLine1").value,
            document.getElementById("City").value,
            document.getElementById("StateProvinceName").value,
            document.getElementById("AddressType").value,
            document.getElementById("PostalCode").value
        ];

        // Thêm dữ liệu vào bảng
        addRowToTable(newRow);

        // Đóng form
        closeForm();

        // Reset form
        newRowForm.reset();
    });

    // Hàm thêm hàng vào bảng
    function addRowToTable(row) {
        const tableBody = document.querySelector("#dataTable tbody");
        const tr = document.createElement("tr");

        row.forEach(col => {
            const td = document.createElement("td");
            td.textContent = col;
            tr.appendChild(td);
        });

        // Thêm nút "Xóa" vào cột cuối
        const actionTd = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Xóa";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function () {
            tr.remove(); // Xóa hàng khỏi bảng
        });
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    }

    // Gắn hàm đóng form vào nút đóng
    window.closeForm = closeForm;

    // Update the addCustomer function to handle form submission
    async function addCustomer(event) {
        event.preventDefault();
        
        // Get form data
        const formData = {
            PersonType: document.getElementById("PersonType").value,
            NameStyle: document.getElementById("NameStyle").value,
            FirstName: document.getElementById("FirstName").value,
            LastName: document.getElementById("LastName").value,
            EmailPromotion: document.getElementById("EmailPromotion").value,
            EmailAddress: document.getElementById("EmailAddress").value,
            AddressLine1: document.getElementById("AddressLine1").value,
            City: document.getElementById("City").value,
            StateProvinceName: document.getElementById("StateProvinceName").value,
            AddressType: document.getElementById("AddressType").value,
            PostalCode: document.getElementById("PostalCode").value
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/customer/addCustomer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Thêm khách hàng thành công:', data);
            
            // Refresh the table
            await getAllCustomers();
            
            // Close the form and reset it
            document.getElementById("addRowForm").style.display = "none";
            document.getElementById("newRowForm").reset();
        } catch (error) {
            console.error('Lỗi khi thêm khách hàng:', error);
            alert('Có lỗi xảy ra khi thêm khách hàng');
        }
    }

    // Make addCustomer function globally available
    window.addCustomer = addCustomer;

    async function getAllCustomers() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/customer/getAllCustomer', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Danh sách khách hàng:', data);
            updateTable(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng:', error);
        }
    }
    

    function updateTable(customers) {
        const tableBody = document.querySelector("#dataTable tbody");
        tableBody.innerHTML = "";
        for (let i = 0; i < customers.length; i++) {
            const customer = customers[i];
            const row = document.createElement('tr');
            // Extracting relevant fields from the customer object
            const rowData = [
                customer.PersonType,
                customer.NameStyle,
                customer.FirstName,
                customer.LastName,
                customer.EmailPromotion,
                customer.AddressLine1,
                customer.City,
                customer.StateProvinceName,
                customer.CountryRegionName,
                customer.PostalCode,
                customer.EmailAddress,
                customer.AddressType
            ];
            for (let j = 0; j < rowData.length; j++) {
                const cell = document.createElement('td');
                cell.textContent = rowData[j];
                row.appendChild(cell);
            }

            // Create action cell with both Edit and Delete buttons
            const actionCell = document.createElement('td');
            
            // Create Edit button
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', () => editCustomer(customer.BusinessEntityID));
            
            // Create Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Xóa';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteCustomer(customer.BusinessEntityID));
            
            // Add some space between buttons
            actionCell.appendChild(editBtn);
            actionCell.appendChild(document.createTextNode(' ')); // Add space between buttons
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        }
    }
    
    // Tải danh sách khách hàng khi trang tải xong
    getAllCustomers();
});
