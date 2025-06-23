 
        // Initialize data
        let courses = JSON.parse(localStorage.getItem('eduadmin-courses')) || [
            { id: '1', name: 'Web Development', tutor: 'Ian Njoroge', tutorPhone: '+254741261579', description: 'Full stack web development course' },
            { id: '2', name: 'Data Science', tutor: 'Victor', tutorPhone: '+254704230381', description: 'Data analysis and machine learning' },
            { id: '3', name: 'Cybersecurity', tutor: 'Excel', tutorPhone: '+254117487554', description: 'Cybersecurity fundamentals and practices' },
            { id: '4', name: 'Graphics Design & Architecture', tutor: 'Iann Abungana', tutorPhone: '+254759097157', description: 'Design principles and architectural concepts' },
            { id: '5', name: 'YouTube, TikTok Monetization & Social Media Management', tutor: 'Telvin', tutorPhone: '+254746550166', description: 'Social media marketing and monetization strategies' },
            { id: '6', name: 'Virtual Assistant, Digital Marketing & Chat Moderation', tutor: 'Caleb', tutorPhone: '+254791870469', description: 'Virtual assistance and digital marketing techniques' }
        ];

        let students = JSON.parse(localStorage.getItem('eduadmin-students')) || [
            { id: '1', name: 'Michael Johnson', email: 'michael@example.com', phone: '+1 (555) 123-4567', courseId: '1', status: 'Paid', createdAt: new Date('2023-05-15') },
            { id: '2', name: 'Sarah Davis', email: 'sarah@example.com', phone: '+1 (555) 987-6543', courseId: '2', status: 'Paid', createdAt: new Date('2023-06-10') },
            { id: '3', name: 'Robert Garcia', email: 'robert@example.com', phone: '+1 (555) 456-7890', courseId: '3', status: 'Pending', createdAt: new Date('2023-06-18') },
            { id: '4', name: 'Emily Thompson', email: 'emily@example.com', phone: '+1 (555) 234-5678', courseId: '4', status: 'Paid', createdAt: new Date('2023-05-28') },
            { id: '5', name: 'David Wilson', email: 'david@example.com', phone: '+1 (555) 876-5432', courseId: '5', status: 'Paid', createdAt: new Date('2023-06-05') },
            { id: '6', name: 'Jennifer Taylor', email: 'jennifer@example.com', phone: '+1 (555) 345-6789', courseId: '6', status: 'Paid', createdAt: new Date('2023-06-12') }
        ];

        let conversations = JSON.parse(localStorage.getItem('eduadmin-conversations')) || [
            { id: '1', name: 'Michael Johnson', lastMessage: 'Hi, when is the next class?', time: '10:30 AM', unread: 2 },
            { id: '2', name: 'Sarah Davis', lastMessage: 'I submitted my assignment', time: 'Yesterday', unread: 0 },
            { id: '3', name: 'Robert Garcia', lastMessage: 'Can I get an extension?', time: 'Yesterday', unread: 1 },
            { id: '4', name: 'Emily Thompson', lastMessage: 'Thank you for the feedback!', time: 'Jun 15', unread: 0 },
            { id: '5', name: 'David Wilson', lastMessage: 'I have a question about the project', time: 'Jun 14', unread: 0 }
        ];

        let messages = JSON.parse(localStorage.getItem('eduadmin-messages')) || {
            '1': [
                { id: '1', text: 'Hi, when is the next class?', time: '10:30 AM', sender: 'student' },
                { id: '2', text: 'The next class is on Wednesday at 2 PM.', time: '10:32 AM', sender: 'admin' },
                { id: '3', text: 'Thanks! Will there be any pre-reading?', time: '10:35 AM', sender: 'student' }
            ],
            '2': [
                { id: '1', text: 'I submitted my assignment', time: 'Yesterday', sender: 'student' },
                { id: '2', text: 'Got it! I will review it by tomorrow.', time: 'Yesterday', sender: 'admin' }
            ]
        };

        // DOM elements
        const courseCardsContainer = document.getElementById('courseCardsContainer');
        const studentsTableBody = document.getElementById('studentsTableBody');
        const paidStudentsTableBody = document.getElementById('paidStudentsTableBody');
        const addStudentBtn = document.getElementById('addStudentBtn');
        const addPaidStudentBtn = document.getElementById('addPaidStudentBtn');
        const addCourseBtn = document.getElementById('addCourseBtn');
        const addStudentModal = document.getElementById('addStudentModal');
        const addCourseModal = document.getElementById('addCourseModal');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const totalStudentsElement = document.getElementById('totalStudents');
        const activeCoursesElement = document.getElementById('activeCourses');
        const newStudentsElement = document.getElementById('newStudents');
        const pendingMessagesElement = document.getElementById('pendingMessages');
        const courseChartCanvas = document.getElementById('courseChart');
        const conversationsContainer = document.getElementById('conversationsContainer');
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const chatRecipientName = document.getElementById('chatRecipientName');
        const chatRecipientAvatar = document.getElementById('chatRecipientAvatar');
        const themeToggle = document.getElementById('themeToggle');
        const profileAvatarImg = document.getElementById('profileAvatarImg');
        const userAvatarImg = document.getElementById('userAvatarImg');
        const profileName = document.getElementById('profileName');
        const userName = document.getElementById('userName');
        const editAvatarBtn = document.getElementById('editAvatarBtn');
        const filterDropdown = document.getElementById('filterDropdown');
        const saveProfileBtn = document.getElementById('saveProfileBtn');

        let courseChart;
        let activeConversationId = null;
        let currentFilter = 'all';

        // Save data to localStorage
        function saveData() {
            localStorage.setItem('eduadmin-courses', JSON.stringify(courses));
            localStorage.setItem('eduadmin-students', JSON.stringify(students));
            localStorage.setItem('eduadmin-conversations', JSON.stringify(conversations));
            localStorage.setItem('eduadmin-messages', JSON.stringify(messages));
        }

        // Initialize the dashboard
        function initDashboard() {
            // Initialize chart
            initChart();
            
            // Render courses
            renderCourseCards();
            
            // Render students
            renderStudents();
            
            // Render conversations
            renderConversations();
            
            // Set up event listeners
            setupEventListeners();
            
            // Update stats
            updateStats();
            
            // Load user profile
            loadUserProfile();
        }

        // Initialize the chart
      function initChart() {
    const ctx = courseChartCanvas.getContext('2d');
    courseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courses.map(course => course.name),
            datasets: [{
                label: 'Number of Paid Students',
                data: courses.map(course => {
                    return students.filter(s => s.courseId === course.id && s.status === 'Paid').length;
                }),
                backgroundColor: courses.map(() => {
                    const colors = ['#4361ee', '#4cc9f0', '#fca311', '#f72585', '#7209b7', '#3a0ca3'];
                    return colors[Math.floor(Math.random() * colors.length)];
                }),
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Add this line
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        precision: 0 // Only show whole numbers
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: false // Ensure all labels are shown
                    }
                }
            }
        }
    });
}

        // Render course cards
        function renderCourseCards() {
            courseCardsContainer.innerHTML = '';
            
            courses.forEach(course => {
                const paidStudents = students.filter(s => s.courseId === course.id && s.status === 'Paid').length;
                
                const card = document.createElement('div');
                card.className = 'course-card';
                card.dataset.id = course.id;
                
              // In your renderCourseCards function, update the card HTML to:
card.innerHTML = `
    <h3>${course.name}</h3>
    <div class="tutor-info">
        <div><strong>Tutor:</strong> ${course.tutor || 'Not assigned'}</div>
        <div><strong>WhatsApp:</strong> ${course.tutorPhone || 'Not provided'}</div>
    </div>
    <div class="student-count">${paidStudents} Paid Students</div>
    <div class="action-buttons">
        <button class="edit-details-btn" data-id="${course.id}">
            <i class="fas fa-edit"></i> Edit Details
        </button>
        <button class="delete-course-btn" data-id="${course.id}">
            <i class="fas fa-trash"></i>
        </button>
    </div>
`;
                
                // Add click event to show students
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        showCourseStudents(course.id);
                    }
                });
                
                // Add event to edit button
                const editBtn = card.querySelector('.edit-details-btn');
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openCourseDetailsModal(course.id);
                });
                
                // Add event to delete button
                const deleteBtn = card.querySelector('.delete-course-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteCourse(course.id);
                });
                
                courseCardsContainer.appendChild(card);
            });
        }

        // Show students for a course
        function showCourseStudents(courseId) {
            const course = courses.find(c => c.id === courseId);
            if (!course) return;
            
            // Hide all course cards
            document.querySelectorAll('.course-card').forEach(card => {
                card.style.display = 'none';
            });
            
            // Create back button
            const backButton = document.createElement('button');
            backButton.className = 'btn btn-outline';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Courses';
            backButton.addEventListener('click', () => {
                renderCourseCards();
                backButton.remove();
            });
            
            // Insert back button at the top
            courseCardsContainer.insertBefore(backButton, courseCardsContainer.firstChild);
            
            // Create students table
            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            tableContainer.style.marginTop = '20px';
            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Contact</th>
                        <th>Payment Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="courseStudentsTableBody"></tbody>
            `;
            
            tableContainer.appendChild(table);
            courseCardsContainer.appendChild(tableContainer);
            
            // Render students for this course (paid only)
            const courseStudents = students.filter(s => 
        s.courseId === courseId && s.status === 'Paid'
    );
    
    const courseStudentsTableBody = document.getElementById('courseStudentsTableBody');
    courseStudentsTableBody.innerHTML = '';
    
    courseStudents.forEach(student => {
        const row = document.createElement('tr');
                // Generate initials
                const names = student.name.split(' ');
                let initials = '';
                if (names.length > 0) {
                    initials = names[0].charAt(0);
                    if (names.length > 1) {
                        initials += names[names.length - 1].charAt(0);
                    }
                }
                
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 36px; height: 36px; border-radius: 50%; background: #4361ee; display: flex; align-items: center; justify-content: center; color: white; font-weight: 500;">${initials}</div>
                            <div>
                                <div style="font-weight: 500;">${student.name}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">${student.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${student.phone}</td>
                    <td>${formatDate(student.createdAt)}</td>
                    <td>
                        <button class="action-btn whatsapp" title="Message on WhatsApp" data-phone="${student.phone}">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button class="action-btn delete" title="Delete" data-id="${student.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                // Add delete event
                const deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteStudent(student.id);
                });
                
                courseStudentsTableBody.appendChild(row);
            });
        }

        // Render students
        function renderStudents() {
            studentsTableBody.innerHTML = '';
            paidStudentsTableBody.innerHTML = '';
            
            // Filter students based on current filter
            let filteredStudents = students;
            if (currentFilter !== 'all') {
                filteredStudents = students.filter(s => s.status === currentFilter);
            }
            
            filteredStudents.forEach(student => {
                const course = courses.find(c => c.id === student.courseId);
                const courseName = course ? course.name : 'Unknown Course';
                
                // Generate initials
                const names = student.name.split(' ');
                let initials = '';
                if (names.length > 0) {
                    initials = names[0].charAt(0);
                    if (names.length > 1) {
                        initials += names[names.length - 1].charAt(0);
                    }
                }
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 36px; height: 36px; border-radius: 50%; background: #4361ee; display: flex; align-items: center; justify-content: center; color: white; font-weight: 500;">${initials}</div>
                            <div>
                                <div style="font-weight: 500;">${student.name}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">${student.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${courseName}</td>
                    <td>${student.phone}</td>
                    <td><span class="status-badge ${student.status === 'Paid' ? 'status-active' : 'status-inactive'}">${student.status}</span></td>
                    <td>
                        <button class="action-btn whatsapp" title="Message on WhatsApp" data-phone="${student.phone}">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button class="action-btn delete" title="Delete" data-id="${student.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                // Add delete event
                const deleteBtn = row.querySelector('.action-btn.delete');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteStudent(student.id);
                });
                
                studentsTableBody.appendChild(row);
                
                // Add to paid students table if status is Paid
                if (student.status === 'Paid') {
                    const paidRow = row.cloneNode(true);
                    // Remove the delete button from paid students table
                    paidRow.querySelector('.action-btn.delete').remove();
                    paidStudentsTableBody.appendChild(paidRow);
                }
            });
        }

        // Render conversations
        function renderConversations() {
            conversationsContainer.innerHTML = '';
            
            conversations.forEach(conversation => {
                const conversationItem = document.createElement('div');
                conversationItem.className = 'conversation-item';
                conversationItem.dataset.id = conversation.id;
                
                // Generate initials
                const names = conversation.name.split(' ');
                let initials = '';
                if (names.length > 0) {
                    initials = names[0].charAt(0);
                    if (names.length > 1) {
                        initials += names[names.length - 1].charAt(0);
                    }
                }
                
                conversationItem.innerHTML = `
                    <div class="conversation-avatar">${initials}</div>
                    <div class="conversation-info">
                        <h4>${conversation.name}</h4>
                        <p>${conversation.lastMessage}</p>
                    </div>
                    <div class="conversation-time">${conversation.time}</div>
                `;
                
                conversationItem.addEventListener('click', () => {
                    openConversation(conversation.id);
                });
                
                conversationsContainer.appendChild(conversationItem);
            });
        }

        // Open conversation
        function openConversation(conversationId) {
            activeConversationId = conversationId;
            const conversation = conversations.find(c => c.id === conversationId);
            
            if (!conversation) return;
            
            // Update UI
            chatRecipientName.textContent = conversation.name;
            
            // Generate initials for avatar
            const names = conversation.name.split(' ');
            let initials = '';
            if (names.length > 0) {
                initials = names[0].charAt(0);
                if (names.length > 1) {
                    initials += names[names.length - 1].charAt(0);
                }
            }
            chatRecipientAvatar.textContent = initials;
            
            // Render messages
            renderMessages(conversationId);
            
            // Mark as read
            conversation.unread = 0;
            renderConversations();
        }

        // Render messages
        function renderMessages(conversationId) {
            chatMessages.innerHTML = '';
            
            if (!messages[conversationId]) {
                chatMessages.innerHTML = '<div class="message-info"><p>No messages yet</p></div>';
                return;
            }
            
            messages[conversationId].forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${message.sender === 'admin' ? 'sent' : 'received'}`;
                
                messageDiv.innerHTML = `
                    <div>${message.text}</div>
                    <div class="message-time">${message.time}</div>
                `;
                
                chatMessages.appendChild(messageDiv);
            });
            
            // Scroll to bottom of chat
            function academyScrollToBottom() {
                academyChatMessages.scrollTop = academyChatMessages.scrollHeight;
            }
        }

        // Set up event listeners
        function setupEventListeners() {
            // Tab switching
            const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
            const contentSections = document.querySelectorAll('.content-section');
            
            
           // Update your tab switching event listener
sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = this.getAttribute('data-target');
        
        sidebarLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${target}-section`) {
                section.classList.add('active');
                
                // Only initialize/update chart when analytics tab is opened
                if (target === 'analytics') {
                    // Destroy existing chart if it exists
                    if (courseChart) {
                        courseChart.destroy();
                    }
                    // Initialize new chart
                    initChart();
                }
            }
        });
        
        updatePageTitle(target);
    });
});
            // Add student buttons
            addStudentBtn.addEventListener('click', () => {
                addStudentModal.style.display = 'flex';
                populateCourseDropdown();
            });
            
            addPaidStudentBtn.addEventListener('click', () => {
                addStudentModal.style.display = 'flex';
                populateCourseDropdown();
            });
            
            // Add course button
            addCourseBtn.addEventListener('click', () => {
                addCourseModal.style.display = 'flex';
                document.getElementById('courseName').value = '';
            });
            
            // Save student
            document.getElementById('saveStudent').addEventListener('click', addStudent);
            
            // Save course
            document.getElementById('saveCourse').addEventListener('click', addCourse);
            // Add these to your existing setupEventListeners function:
document.getElementById('saveCourseDetails').addEventListener('click', saveCourseDetails);
document.getElementById('cancelEditCourse').addEventListener('click', () => {
    document.getElementById('editCourseModal').style.display = 'none';
});
            // Close modals
            document.querySelectorAll('.modal-close, .modal-footer .btn-outline').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                });
            });
            
            // WhatsApp buttons
            document.addEventListener('click', function(e) {
                if (e.target.closest('.action-btn.whatsapp')) {
                    const phone = e.target.closest('.action-btn.whatsapp').getAttribute('data-phone');
                    openWhatsApp(phone);
                }
            });
            
            // Send message
            sendMessageBtn.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Theme toggle
            themeToggle.addEventListener('click', toggleTheme);
            
            // Edit avatar
            editAvatarBtn.addEventListener('click', () => {
                document.getElementById('avatarInput').click();
            });
            
            // Avatar upload
            document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);
            
            // Filter button
            document.getElementById('filterStudents').addEventListener('click', function() {
                filterDropdown.classList.toggle('show');
            });
            
            // Filter options
            document.querySelectorAll('.filter-option').forEach(option => {
                option.addEventListener('click', function() {
                    currentFilter = this.getAttribute('data-filter');
                    renderStudents();
                    filterDropdown.classList.remove('show');
                });
            });
            
            // Save profile
            saveProfileBtn.addEventListener('click', saveProfile);
            
            // Close filter dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.filter-container')) {
                    filterDropdown.classList.remove('show');
                }
            });
        }

        // Populate course dropdown
        function populateCourseDropdown() {
            const select = document.getElementById('studentCourse');
            select.innerHTML = '<option value="">Select a course</option>';
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                select.appendChild(option);
            });
        }

        // Add new student
        function addStudent() {
            const name = document.getElementById('studentName').value;
            const email = document.getElementById('studentEmail').value;
            const phone = document.getElementById('studentPhone').value;
            const courseId = document.getElementById('studentCourse').value;
            const status = document.getElementById('studentStatus').value;
            
            if (!name || !email || !phone || !courseId) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            const newStudent = {
                id: Date.now().toString(),
                name: name,
                email: email,
                phone: phone,
                courseId: courseId,
                status: status,
                createdAt: new Date()
            };
            
            students.push(newStudent);
            saveData();
            renderStudents();
            updateStats();
            showToast('Student added successfully!', 'success');
            addStudentModal.style.display = 'none';
            
            // Reset form
            document.getElementById('studentName').value = '';
            document.getElementById('studentEmail').value = '';
            document.getElementById('studentPhone').value = '';
            document.getElementById('studentCourse').value = '';
        }

        // Add new course
        function addCourse() {
            const name = document.getElementById('courseName').value.trim();
            
            if (!name) {
                showToast('Please enter a course name', 'error');
                return;
            }
            
            // Check if course already exists
            if (courses.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                showToast('Course already exists', 'error');
                return;
            }
            
            // Add new course
            const newCourse = {
                id: Date.now().toString(),
                name: name,
                tutor: '',
                tutorPhone: '',
                description: ''
            };
            
            courses.push(newCourse);
            saveData();
            renderCourseCards();
            updateStats();
            addCourseModal.style.display = 'none';
            showToast('Course added successfully!', 'success');
        }

        // Delete course
        function deleteCourse(courseId) {
            if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
                courses = courses.filter(c => c.id !== courseId);
                saveData();
                renderCourseCards();
                updateStats();
                showToast('Course deleted successfully', 'success');
            }
        }

        // Delete student
        function deleteStudent(studentId) {
            if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
                students = students.filter(s => s.id !== studentId);
                saveData();
                renderStudents();
                updateStats();
                showToast('Student deleted successfully', 'success');
            }
        }

        // Send message
        function sendMessage() {
            const message = messageInput.value.trim();
            if (!message || !activeConversationId) return;
            
            // Add message to conversation
            if (!messages[activeConversationId]) {
                messages[activeConversationId] = [];
            }
            
            const newMessage = {
                id: Date.now().toString(),
                text: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: 'admin'
            };
            
            messages[activeConversationId].push(newMessage);
            saveData();
            
            // Update UI
            renderMessages(activeConversationId);
            
            // Clear input
            messageInput.value = '';
            
            // Update last message in conversation
            const conversation = conversations.find(c => c.id === activeConversationId);
            if (conversation) {
                conversation.lastMessage = message;
                conversation.time = 'Just now';
                saveData();
                renderConversations();
            }
        }

        // Toggle theme
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            // Save preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }

        // Load user profile
        function loadUserProfile() {
            const savedName = localStorage.getItem('userName') || 'Admin Johnson';
            const savedAvatar = localStorage.getItem('avatar') || '';
            
            profileName.textContent = savedName;
            userName.textContent = savedName;
            
            if (savedAvatar) {
                profileAvatarImg.src = savedAvatar;
                userAvatarImg.src = savedAvatar;
            } else {
                // Show initials
                const names = savedName.split(' ');
                let initials = '';
                if (names.length > 0) {
                    initials = names[0].charAt(0);
                    if (names.length > 1) {
                        initials += names[names.length - 1].charAt(0);
                    }
                }
                profileAvatarImg.parentElement.textContent = initials;
                userAvatarImg.parentElement.textContent = initials;
            }
            
            // Set form values
            const firstName = savedName.split(' ')[0] || 'Admin';
            const lastName = savedName.split(' ')[1] || 'Johnson';
            document.getElementById('firstName').value = firstName;
            document.getElementById('lastName').value = lastName;
            
            // Load theme preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }

        // Save profile
        function saveProfile() {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('userEmail').value;
            const phone = document.getElementById('userPhone').value;
            const bio = document.getElementById('bio').value;
            
            const fullName = `${firstName} ${lastName}`;
            
            // Update UI
            profileName.textContent = fullName;
            userName.textContent = fullName;
            
            // Save to localStorage
            localStorage.setItem('userName', fullName);
            
            showToast('Profile updated successfully!', 'success');
        }

        // Handle avatar upload
        function handleAvatarUpload(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                
                // Update avatars
                profileAvatarImg.src = imageUrl;
                userAvatarImg.src = imageUrl;
                
                // Save to localStorage
                localStorage.setItem('avatar', imageUrl);
                
                // Hide initials
                document.querySelectorAll('.user-avatar, .profile-avatar').forEach(el => {
                    el.textContent = '';
                });
            };
            reader.readAsDataURL(file);
        }

        // Update chart
        function updateChart() {
            if (!courseChart) return;
            
            courseChart.data.labels = courses.map(course => course.name);
            courseChart.data.datasets[0].data = courses.map(course => {
                return students.filter(s => s.courseId === course.id && s.status === 'Paid').length;
            });
            
            courseChart.update();
        }

        // Update stats
        function updateStats() {
            totalStudentsElement.textContent = students.length;
            activeCoursesElement.textContent = courses.length;
            
            // Count new students this month
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const newThisMonth = students.filter(s => {
                const studentDate = new Date(s.createdAt);
                return studentDate.getMonth() === currentMonth && 
                       studentDate.getFullYear() === currentYear;
            }).length;
            
            newStudentsElement.textContent = newThisMonth;
            
            // Count pending messages
            const pendingMessages = conversations.reduce((total, conv) => total + conv.unread, 0);
            pendingMessagesElement.textContent = pendingMessages;
        }

        // Open WhatsApp
        function openWhatsApp(phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone) {
                window.open(`https://wa.me/${cleanPhone}`, '_blank');
            } else {
                showToast('Invalid phone number', 'error');
            }
        }

        // Show toast notification
        function showToast(message, type) {
            toastMessage.textContent = message;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }

        // Helper functions
      function formatDate(date) {
    // If it's a string, convert to Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

        function updatePageTitle(target) {
            const titles = {
                dashboard: {
                    title: 'Student Management Dashboard',
                    description: 'Monitor and manage all student activities in real-time'
                },
                students: {
                    title: 'Student Management',
                    description: 'View and manage all enrolled students'
                },
                courses: {
                    title: 'Course Management',
                    description: 'Manage courses and view enrolled students'
                },
                analytics: {
                    title: 'Performance Analytics',
                    description: 'Analyze student and course performance metrics'
                },
                messages: {
                    title: 'Messaging Center',
                    description: 'Communicate with students and staff'
                },
                settings: {
                    title: 'System Settings',
                    description: 'Configure application preferences'
                }
            };
            
            if (titles[target]) {
                document.getElementById('pageTitle').textContent = titles[target].title;
                document.getElementById('pageDescription').textContent = titles[target].description;
            }
        }
function openCourseDetailsModal(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    document.getElementById('editCourseName').value = course.name;
    document.getElementById('editCourseTutor').value = course.tutor || '';
    document.getElementById('editCourseWhatsApp').value = course.tutorPhone || '';
    
    // Store the course ID in the modal for saving later
    document.getElementById('editCourseModal').dataset.courseId = courseId;
    
    document.getElementById('editCourseModal').style.display = 'flex';
}

function saveCourseDetails() {
    const courseId = document.getElementById('editCourseModal').dataset.courseId;
    const tutor = document.getElementById('editCourseTutor').value.trim();
    const whatsapp = document.getElementById('editCourseWhatsApp').value.trim();
    
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
        courses[courseIndex].tutor = tutor;
        courses[courseIndex].tutorPhone = whatsapp;
        saveData();
        renderCourseCards();
        showToast('Course details updated successfully!', 'success');
    }
    
    document.getElementById('editCourseModal').style.display = 'none';
}

        // Initialize dashboard when DOM is loaded
        document.addEventListener('DOMContentLoaded', initDashboard);
    