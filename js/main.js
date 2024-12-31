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
            document.getElementById("AddressLine1").value,
            document.getElementById("City").value,
            document.getElementById("StateProvince").value,
            document.getElementById("CountryRegion").value,
            document.getElementById("PostalCode").value,
            document.getElementById("EmailAddress").value,
            document.getElementById("AddressType").value
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
            AddressLine1: document.getElementById("AddressLine1").value,
            City: document.getElementById("City").value,
            StateProvince: document.getElementById("StateProvince").value,
            PostalCode: document.getElementById("PostalCode").value,
            EmailAddress: document.getElementById("EmailAddress").value,
            AddressType: document.getElementById("AddressType").value
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
    // Hàm xóa khách hàng
    async function deleteCustomer(businessEntityID) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/customer/deleteCustomer/${businessEntityID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Xóa khách hàng ${businessEntityID} thành công:`, data);

            // Refresh the customer table after deletion
            await getAllCustomers();
        } catch (error) {
            console.error(`Lỗi khi xóa khách hàng ${businessEntityID}:`, error);
            alert('Có lỗi xảy ra khi xóa khách hàng');
        }
    }

    // Hàm chỉnh sửa thông tin khách hàng
    async function editCustomer(businessEntityID) {
        console.log('BusinessEntityID:', businessEntityID);
    
        // Lấy dữ liệu cũ từ bảng
        const row = document.querySelector(`#dataTable tbody tr[data-id='${businessEntityID}']`);
        if (!row) {
            console.error(`Không tìm thấy hàng với BusinessEntityID: ${businessEntityID}`);
            alert('Hàng không tồn tại!');
            return;
        }
    
        const oldData = Array.from(row.querySelectorAll('td')).slice(0, -1).map(td => td.textContent);
    
        // Hiển thị form nhập dữ liệu mới
        const updatedData = {
            PersonType: prompt('Nhập Person Type mới:', oldData[0]),
            NameStyle: prompt('Nhập Name Style mới (true/false):', oldData[1]).toLowerCase() === 'true', // Chuyển thành boolean
            FirstName: prompt('Nhập First Name mới:', oldData[2]),
            LastName: prompt('Nhập Last Name mới:', oldData[3]),
            EmailPromotion: parseInt(prompt('Nhập Email Promotion mới (0 hoặc 1):', oldData[4])), // Chuyển thành số
            AddressLine1: prompt('Nhập Address Line 1 mới:', oldData[5]),
            City: prompt('Nhập City mới:', oldData[6]),
            StateProvinceName: prompt('Nhập State Province mới:', oldData[7]),
            CountryRegionName: prompt('Nhập Country Region mới:', oldData[8]),
            PostalCode: prompt('Nhập Postal Code mới:', oldData[9]),
            EmailAddress: prompt('Nhập Email Address mới:', oldData[10]),
            AddressType: prompt('Nhập Address Type mới:', oldData[11])
        };
    
        // Kiểm tra dữ liệu nhập vào
        if (Object.values(updatedData).some(value => value === null || value === '')) {
            alert('Thông tin nhập không đầy đủ hoặc bị hủy.');
            return;
        }
    
        try {
            console.log('Dữ liệu gửi đi:', updatedData); // Log dữ liệu gửi đi
    
            const response = await fetch(`http://127.0.0.1:8000/api/customer/updateCustomer/${businessEntityID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Lấy thông tin lỗi chi tiết
                console.error(`Lỗi HTTP! Status: ${response.status}`, errorText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(`Chỉnh sửa khách hàng ${businessEntityID} thành công:`, data);
    
            // Làm mới danh sách khách hàng
            await getAllCustomers();
        } catch (error) {
            console.error(`Lỗi khi chỉnh sửa khách hàng ${businessEntityID}:`, error.message);
            alert('Có lỗi xảy ra khi chỉnh sửa khách hàng. Vui lòng kiểm tra lại.');
        }
    }
    
    


    function updateTable(customers) {
        const tableBody = document.querySelector("#dataTable tbody");
        tableBody.innerHTML = "";
        for (let i = 0; i < customers.length; i++) {
            const customer = customers[i];
            const row = document.createElement('tr');
            // Extracting relevant fields from the customer object
            row.setAttribute('data-id', customer.BusinessEntityID);
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
