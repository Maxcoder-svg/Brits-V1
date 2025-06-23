// Sample student data for admin dashboard
const students = {
    'web-dev': [
        { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 555-1234', date: '2023-10-15', paid: true, schedule: 'Morning', status: 'Active' },
        { id: 2, name: 'Emily Johnson', email: 'emily@example.com', phone: '+1 555-5678', date: '2023-10-18', paid: true, schedule: 'Evening', status: 'Active' },
        { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1 555-9012', date: '2023-10-20', paid: false, schedule: 'Not set', status: 'Active' },
        { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', phone: '+1 555-3456', date: '2023-10-22', paid: true, schedule: 'Morning', status: 'Active' },
        { id: 5, name: 'Robert Wilson', email: 'robert@example.com', phone: '+1 555-7890', date: '2023-10-24', paid: false, schedule: 'Not set', status: 'Active' }
    ],
    'data-science': [
        { id: 6, name: 'Jennifer Miller', email: 'jennifer@example.com', phone: '+1 555-2345', date: '2023-10-14', paid: true, schedule: 'Evening', status: 'Active' },
        { id: 7, name: 'David Taylor', email: 'david@example.com', phone: '+1 555-6789', date: '2023-10-16', paid: true, schedule: 'Morning', status: 'Active' },
        { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+1 555-0123', date: '2023-10-19', paid: true, schedule: 'Evening', status: 'Active' }
    ],
    'cybersecurity': [
        { id: 9, name: 'James Martinez', email: 'james@example.com', phone: '+1 555-4567', date: '2023-10-17', paid: false, schedule: 'Not set', status: 'Active' },
        { id: 10, name: 'Patricia Robinson', email: 'patricia@example.com', phone: '+1 555-8901', date: '2023-10-21', paid: true, schedule: 'Morning', status: 'Active' }
    ],
    'cloud-computing': [
        { id: 11, name: 'Daniel Clark', email: 'daniel@example.com', phone: '+1 555-1234', date: '2023-10-15', paid: true, schedule: 'Evening', status: 'Active' },
        { id: 12, name: 'Elizabeth Rodriguez', email: 'elizabeth@example.com', phone: '+1 555-5678', date: '2023-10-23', paid: true, schedule: 'Morning', status: 'Active' }
    ]
};

  // Global variables
        let currentCourse = 'web-dev';
        let allStudents = [];
        
        
        // Initialize the dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadStudents();
            updateCourseStats();
            showStudents(currentCourse);
        });
        
        // Load students from localStorage
        function loadStudents() {
            const savedStudents = localStorage.getItem('students');
            if (savedStudents) {
                allStudents = JSON.parse(savedStudents);
                showNotification('Student data loaded from storage');
            } else {
                // Initialize with an empty array if no data exists
                allStudents = [];
                localStorage.setItem('students', JSON.stringify(allStudents));
            }
        }
        
        // Save students to localStorage
        function saveStudents() {
            localStorage.setItem('students', JSON.stringify(allStudents));
            showNotification('Student data saved successfully');
        }
        
        // Update course statistics
        function updateCourseStats() {
            const courses = {
                'web-dev': 'WEB DEVELOPMENT',
                'data-science': 'Data Science',
                'cybersecurity': 'Cybersecurity',
                'graphics-design': 'GRAPHICS DESIGN'
            };
            
            let totalStudents = 0;
            let totalCompleted = 0;
            let totalPaid = 0;
            
            for (const courseId in courses) {
                const courseStudents = allStudents.filter(student => student.course === courseId);
                const completed = courseStudents.filter(s => s.status === 'Completed').length;
                const paid = courseStudents.filter(s => s.paymentStatus === 'Paid').length;
                const completionRate = courseStudents.length > 0 ? 
                    Math.round((completed / courseStudents.length) * 100) : 0;
                
                document.getElementById(`${courseId}-students`).textContent = `Students: ${courseStudents.length}`;
                document.getElementById(`${courseId}-rate`).textContent = `${completionRate}%`;
                
                // Update totals
                totalStudents += courseStudents.length;
                totalCompleted += completed;
                totalPaid += paid;
            }
            
            // Update overall stats
            document.getElementById('total-students').textContent = totalStudents;
            
            const avgCompletion = totalStudents > 0 ? 
                Math.round((totalCompleted / totalStudents) * 100) : 0;
            document.getElementById('completion-rate').textContent = `${avgCompletion}%`;
            
            const paidRate = totalStudents > 0 ? 
                Math.round((totalPaid / totalStudents) * 100) : 0;
            document.getElementById('paid-rate').textContent = `${paidRate}%`;
        }
        
        // Show students for a specific course
        function showStudents(courseId) {
            currentCourse = courseId;
            const courseNames = {
                'web-dev': 'WEB DEVELOPMENT',
                'data-science': 'Data Science',
                'cybersecurity': 'Cybersecurity',
                'graphics-design': 'GRAPHICS DESIGN'
            };
            
            document.querySelector('#student-list-title span').textContent = `${courseNames[courseId]} Students`;
            
            const filteredStudents = allStudents.filter(student => student.course === courseId);
            renderStudentTable(filteredStudents);
        }
        
        // Filter students based on search input
        function filterStudents() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            
            if (!searchTerm) {
                showStudents(currentCourse);
                return;
            }
            
            const filteredStudents = allStudents.filter(student => 
                student.course === currentCourse &&
                (student.name.toLowerCase().includes(searchTerm) ||
                 student.email.toLowerCase().includes(searchTerm) ||
                 student.phone.includes(searchTerm))
            );
            
            renderStudentTable(filteredStudents);
        }
        
        // Render the student table
        function renderStudentTable(students) {
            const tableBody = document.getElementById('students-list');
            tableBody.innerHTML = '';
            
            if (students.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="no-students">
                            <i class="fas fa-user-graduate" style="font-size: 3rem; margin-bottom: 15px;"></i>
                            <h3>No students found</h3>
                            <p>Try adding students or adjusting your search</p>
                        </td>
                    </tr>
                `;
                return;
            }
            
            students.forEach(student => {
                const row = document.createElement('tr');
                
                // Format date
                const date = new Date(student.enrollmentDate);
                const formattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
                
                // Status badge class
                let statusClass = '';
                if (student.status === 'Active') statusClass = 'status-active';
                else if (student.status === 'Pending') statusClass = 'status-pending';
                else if (student.status === 'Completed') statusClass = 'status-completed';
                
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>${formattedDate}</td>
                    <td class="${student.paymentStatus === 'Paid' ? 'payment-paid' : 'payment-pending'}">
                        ${student.paymentStatus}
                    </td>
                    <td>${student.schedule}</td>
                    <td><span class="status-badge ${statusClass}">${student.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="whatsapp-btn" onclick="messageStudent('${student.phone}')">
                                <i class="fab fa-whatsapp"></i> Message
                            </button>
                            <button class="delete-btn" onclick="deleteStudent('${student.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        // Open WhatsApp to message student
        function messageStudent(phone) {
            // Remove any non-digit characters and add country code if missing
            const cleanPhone = phone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/${cleanPhone}`;
            window.open(whatsappUrl, '_blank');
        }
        
        // Delete a student
        function deleteStudent(studentId) {
            if (confirm('Are you sure you want to delete this student?')) {
                allStudents = allStudents.filter(student => student.id !== studentId);
                saveStudents();
                updateCourseStats();
                showStudents(currentCourse);
                showNotification('Student deleted successfully!');
            }
        }
        
        // Add mock students for demonstration
        function addMockStudents() {
            const mockStudents = [
                {
                    id: 'st1',
                    name: 'Alex Johnson',
                    email: 'alex.johnson@example.com',
                    phone: '+15551234567',
                    enrollmentDate: '2023-10-15',
                    paymentStatus: 'Paid',
                    schedule: 'Full-time',
                    status: 'Active',
                    course: 'web-dev'
                },
                {
                    id: 'st2',
                    name: 'Maria Garcia',
                    email: 'maria.g@example.com',
                    phone: '+15559876543',
                    enrollmentDate: '2023-11-02',
                    paymentStatus: 'Paid',
                    schedule: 'Part-time',
                    status: 'Active',
                    course: 'web-dev'
                },
                {
                    id: 'st3',
                    name: 'David Kim',
                    email: 'david.kim@example.com',
                    phone: '+15557778899',
                    enrollmentDate: '2023-09-20',
                    paymentStatus: 'Pending',
                    schedule: 'Full-time',
                    status: 'Active',
                    course: 'data-science'
                },
                {
                    id: 'st4',
                    name: 'Sarah Williams',
                    email: 'sarahw@example.com',
                    phone: '+15553334455',
                    enrollmentDate: '2023-08-05',
                    paymentStatus: 'Paid',
                    schedule: 'Part-time',
                    status: 'Completed',
                    course: 'cybersecurity'
                },
                {
                    id: 'st5',
                    name: 'James Wilson',
                    email: 'j.wilson@example.com',
                    phone: '+15556667788',
                    enrollmentDate: '2023-12-01',
                    paymentStatus: 'Paid',
                    schedule: 'Full-time',
                    status: 'Active',
                    course: 'graphics-design'
                },
                {
                    id: 'st6',
                    name: 'Emma Thompson',
                    email: 'emma.t@example.com',
                    phone: '+15554443322',
                    enrollmentDate: '2023-11-20',
                    paymentStatus: 'Pending',
                    schedule: 'Part-time',
                    status: 'Active',
                    course: 'web-dev'
                },
                {
                    id: 'st7',
                    name: 'Michael Brown',
                    email: 'm.brown@example.com',
                    phone: '+15551112233',
                    enrollmentDate: '2023-10-30',
                    paymentStatus: 'Paid',
                    schedule: 'Full-time',
                    status: 'Active',
                    course: 'data-science'
                },
                {
                    id: 'st8',
                    name: 'Olivia Davis',
                    email: 'olivia.d@example.com',
                    phone: '+15559998877',
                    enrollmentDate: '2023-09-15',
                    paymentStatus: 'Paid',
                    schedule: 'Part-time',
                    status: 'Completed',
                    course: 'cybersecurity'
                }
            ];
            
            // Add mock students to existing data
            allStudents = [...allStudents, ...mockStudents];
            saveStudents();
            updateCourseStats();
            showStudents(currentCourse);
            showNotification('Test students added successfully!');
        }
        
        // Reset all data
        function resetData() {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                allStudents = [];
                saveStudents();
                updateCourseStats();
                showStudents(currentCourse);
                showNotification('All data has been reset', 'error');
            }
        }
        
        // Show notification
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> <span>${message}</span>`;
            notification.className = `notification ${type === 'error' ? 'error' : ''} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Placeholder function for navigation
        function showHome() {
            alert('Navigating to home page...');
        }
// Course details
const courseDetails = {
    'web-dev': {
        title: 'Web Development Fundamentals',
        desc: 'Learn HTML, CSS, and JavaScript to build modern, responsive websites from scratch. This comprehensive course covers everything from basic web structure to advanced interactivity and modern frameworks.',
        duration: '8 weeks',
        salary: '$1,200+',
        rate: '96%'
    },
    'data-science': {
        title: 'Data Science & Analytics',
        desc: 'Master Python, statistics, and machine learning to extract valuable insights from complex datasets. This course covers data manipulation, visualization, and predictive modeling techniques.',
        duration: '12 weeks',
        salary: '$1,500+',
        rate: '92%'
    },
    'cybersecurity': {
        title: 'Cybersecurity Essentials',
        desc: 'Protect systems and networks from digital attacks with essential security principles and techniques. Learn about threat analysis, encryption, network security, and ethical hacking.',
        duration: '10 weeks',
        salary: '$1,400+',
        rate: '89%'
    },
    'GRAPHICS DESIGN & Architecture': {
        title: 'GRAPHICS DESIGN & Architecture',
        desc: 'Master the art of visually communicating ideas using typography, imagery, color, and layout principles',
        duration: '12 weeks',
        salary: '$1,450+',
        rate: '91%'
    },
    'YOUTUBE,TIKTOK MONETIZATION & SOCIAL MEDIA MANAGEMENT': {
        title: 'YOUTUBE,TIKTOK MONETIZATION & SOCIAL MEDIA MANAGEMENT',
        desc: 'Master content creation, audience growth, and monetization on YouTube, TikTok, and social media..',
        duration: '9 weeks',
        salary: '$1,350+',
        rate: '88%'
    },
    'VIRTUAL ASSISTANT, DIGITAL MARKETING & CHAT MODERATION': {
        title: 'VIRTUAL ASSISTANT, DIGITAL MARKETING & CHAT MODERATION',
        desc: 'Master virtual assistance, digital marketing strategies, and effective, engaging chat moderation',
        duration: '14 weeks',
        salary: '$1,800+',
        rate: '85%'
    }
};

// Course card data
/*
 * Beginner-friendly course modules for each course.
 * Each module is broken down into simple, easy-to-follow steps.
 * Designed for students with little or no prior experience.
 */

const beginnerCourseModules = {
    'web-dev': [
        {
            title: 'Module 1: Introduction to the Web',
            content: `<ul>
                <li>What is the Internet?</li>
                <li>How websites work</li>
                <li>Overview of browsers and servers</li>
            </ul>`
        },
        {
            title: 'Module 2: Getting Started with HTML',
            content: `<ul>
                <li>What is HTML?</li>
                <li>Creating your first HTML page</li>
                <li>Basic tags: headings, paragraphs, links</li>
                <li>Adding images</li>
            </ul>`
        },
        {
            title: 'Module 3: Structuring Content with HTML',
            content: `<ul>
                <li>Lists (ordered and unordered)</li>
                <li>Tables and simple forms</li>
                <li>Semantic tags (header, nav, main, footer)</li>
            </ul>`
        },
        {
            title: 'Module 4: Introduction to CSS',
            content: `<ul>
                <li>What is CSS?</li>
                <li>Adding color and fonts</li>
                <li>Changing text and background</li>
                <li>Basic box model (margin, padding, border)</li>
            </ul>`
        },
        {
            title: 'Module 5: Layout with CSS',
            content: `<ul>
                <li>Arranging elements (block vs inline)</li>
                <li>Simple layouts with Flexbox</li>
                <li>Making pages responsive</li>
            </ul>`
        },
        {
            title: 'Module 6: Introduction to JavaScript',
            content: `<ul>
                <li>What is JavaScript?</li>
                <li>Adding JavaScript to your page</li>
                <li>Simple variables and alerts</li>
            </ul>`
        },
        {
            title: 'Module 7: Interactivity with JavaScript',
            content: `<ul>
                <li>Buttons and click events</li>
                <li>Changing content with JavaScript</li>
                <li>Simple input validation</li>
            </ul>`
        },
        {
            title: 'Module 8: Project - Build Your First Website',
            content: `<ul>
                <li>Plan your website</li>
                <li>Build pages step by step</li>
                <li>Style and add interactivity</li>
                <li>Review and publish</li>
            </ul>`
        }
    ],
    'data-science': [
        {
            title: 'Module 1: What is Data Science?',
            content: `<ul>
                <li>Introduction to data and its importance</li>
                <li>Real-world examples</li>
            </ul>`
        },
        {
            title: 'Module 2: Python Basics',
            content: `<ul>
                <li>Installing Python</li>
                <li>Running your first Python script</li>
                <li>Variables and simple math</li>
            </ul>`
        },
        {
            title: 'Module 3: Working with Data',
            content: `<ul>
                <li>Lists and dictionaries</li>
                <li>Reading and writing files</li>
                <li>Simple data input/output</li>
            </ul>`
        },
        {
            title: 'Module 4: Data Analysis with Pandas',
            content: `<ul>
                <li>What is Pandas?</li>
                <li>Loading CSV files</li>
                <li>Viewing and filtering data</li>
            </ul>`
        },
        {
            title: 'Module 5: Visualizing Data',
            content: `<ul>
                <li>Introduction to Matplotlib</li>
                <li>Creating simple charts</li>
                <li>Understanding your data visually</li>
            </ul>`
        },
        {
            title: 'Module 6: Introduction to Statistics',
            content: `<ul>
                <li>Mean, median, mode</li>
                <li>Basic data summary</li>
            </ul>`
        },
        {
            title: 'Module 7: Simple Machine Learning',
            content: `<ul>
                <li>What is machine learning?</li>
                <li>Basic prediction with scikit-learn</li>
                <li>Evaluating results</li>
            </ul>`
        },
        {
            title: 'Module 8: Mini Project - Analyze a Dataset',
            content: `<ul>
                <li>Choose a simple dataset</li>
                <li>Clean, analyze, and visualize</li>
                <li>Share your findings</li>
            </ul>`
        }
    ],
    'cybersecurity': [
        {
            title: 'Module 1: Introduction to Cybersecurity',
            content: `<ul>
                <li>What is cybersecurity?</li>
                <li>Why is it important?</li>
            </ul>`
        },
        {
            title: 'Module 2: Understanding Threats',
            content: `<ul>
                <li>WK.1 Overview of cybersecurity, basic security concepts</li>
                <li>Security threats and vulnerabilities, security frameworks</li>
                <li>Security standards and regulations</li>
            </ul>`
        },
        {
            title: 'Module 3: Network Security and Policies',
            content: `<ul>
                <li>WK.2 Network fundamentals, network security</li>
                <li>System security, user authentication and authorization</li>
                <li>Security policies and procedures</li>
            </ul>`
        },
        {
            title: 'Module 4: Network Security',
            content: `<ul>
                <li>WK.3 Network threats (malware, phishing), firewalls</li>
                <li>Intrusion detection and prevention systems</li>
                <li>: Secure network architecture</li>
                <li>WK.4 Network segmentation, access control</li>
                <li>Network monitoring and ncident response</li>
                <li> Network security best practices</li>
            </ul>`
        },
        {
            title: 'Module 5: System Security',
            content: `<ul>
                <li>WK.5 Operating system security, patch management</li>
                <li>System hardening, vulnerability assessment</li>
                <li>System security best practices</li>
                <li>WK.6 User authentication and authorization</li>
                <li>Access control models, identity AND privilege management</li>
                <li>System security policies and procedures</li>
            </ul>`
        },
        {
            title: 'Module 6: Cryptography',
            content: `<ul>
                <li>WK.7 Introduction to cryptography, symmetric encryption</li>
                <li>Asymmetric encryption, digital signatures</li>
                <li>Cryptographic protocols (SSL/TLS)</li>
                <li>WK.8 Cryptographic applications (PGP, SSH)</li>
                <li> Cryptanalysis and attacks</li>
                <li>Cryptographic best practices
</li>
            </ul>`
        },
        {
            title: 'Module 7: Threats and incident Response',
            content: `<ul>
                <li>WK.9 Common cyber threats (malware, ransomware)</li>
                <li>: Incident response planning and procedures</li>
                <li>Threat intelligence and hunting</li>
                <li>WK.10  Incident response tools and techniques</li>
                <li> Post-incident activities and review</li>
                <li> Threat and incident response best practices</li>
            </ul>`
        },
        {
            title: 'Module 8:  Security Best Practices and Review',
            content: `<ul>
                <li>Wk.11 Security awareness and training</li>
                <li>Security policies and procedures</li>
                <li>Risk management and assessment</li>
                <li>WK.12 Compliance and regulatory requirements</li>
                <li>Final project and review</li>
                <li>Course wrap-up and Q&A</li>
            </ul>`
        },
            {
            title: 'CONGRATULATIONS, YOU ARE ALMOST GRADUATING🥳',
            content: `<ul>
                <li>Provision of certificate</li>
                <li>School contact:</li>
                <li>Tutor contact:</li>
                <li>Congratulations😍😁</li>

            </ul>`
        }
    ],
    'GRAPHICS DESIGN & Architecture': [
        {
            title: 'Module 1: Foundations',
            content: `<ul>
                <li>Introduction to design</li>
                <li>Where we see design every day</li>
                <li> What is Graphic Design?</li>
                <li>Types: Branding, Web, Editorial</li>
                <li> Careers in Design</li>
               <li> Project: Create a mood board</li>

            </ul>`
        },
        {
            title: 'Module 2: Elements & Principles',
            content: `<ul>
                <li>Color basics</li>
                <li>Shapes and lines</li>
                <li>Typography (fonts)</li>
                <li>Composition and layout</li>
                <li>Project: Design a simple poster</li>
            </ul>`
        },
        {
            title: 'Module 3:Color & Typography',
            content: `<ul>
                <li>Color wheel, schemes, emotion</li>
                <li>Typography basics: Fonts, hierarchy</li>
                <li>Font pairing challenge</li>
                <li>Project: Create a color palette</li>
            </ul>`
        },
        {
            title: 'Module 4: Layout & Composition',
            content: `<ul>
                <li>Grids, rule of thirds, whitespace</li>
                <li>Print vs screen layouts</li>
                <li>Magazine or flyer design</li>
            </ul>`
        },
        {
            title: 'Module 5: Design Tools',
            content: `<ul>
                <li>Canva Basics</li>
                <li>Photoshop Basics</li>
                <li>Illustrator Basics</li>
                <li>Print vs Digital Projects</li>
            </ul>`
        },
        {
            title: 'Module 6:  Canva',
            content: `<ul>
                <li>Templates, elements, layers</li>
                <li>Editing and cropping</li>
               <li> Export formats </li>
                <li>Project: Social media pack</li>

            </ul>`
        },
        {
            title: 'Module 7: Photoshop',
            content: `<ul>
                <li>Layers, masks, retouching</li>
                <li>Compositing images</li>
                <li>Project: Photo manipulation poster</li>
            </ul>`
        },
        {
            title: 'Module 8: Mini Project - Illustrator',
            content: `<ul>
                <li>Vector vs raster</li>
                <li>Pen tool, icon creation</li>
                <li>Project: Personal logo design</li>
            </ul>`
        },
         {
            title: 'Module 9: Print vs Digital',
            content: `<ul>
                <li>File types: JPG, PNG, PDF</li>
                <li>Print: Bleed, CMYK</li>
                <li>Project: Flyer + banner + card</li>
            </ul>`
        },
        {
            title: 'Module 10: Branding, Portfolio & Career',
            content: `<ul>
                <li>Branding</li>
                <li>UI Design (Optional)</li>
                <li>Process & Review</li>
                <li>: Final Portfolio</li>
            </ul>`
        },
             {
            title: 'Module 11: Branding Design',
            content: `<ul>
                <li>Logo design</li>
                <li>Brand colors, type, voice</li>
                <li>Project: Brand style guide</li>
            </ul>`
        },
           {
            title: 'Module 12: UI Design Basics',
            content: `<ul>
                <li>UI vs UX</li>
                <li>Wireframes, Figma intro</li>
                <li>Project: Mobile app screens</li>
            </ul>`
        },
               {
            title: 'Module 13: Design Process',
            content: `<ul>
                <li>Design thinking</li>
                <li>Feedback, client process</li>
                <li>Peer review: Improve past work</li>
            </ul>`
        },
                 {
            title: 'Module 14: Final Portfolio',
            content: `<ul>
                <li>Choose top 3–5 works</li>
                <li>Polish and export</li>
                <li>Present portfolio to class</li>
            </ul>`
        },
               {
            title: 'CONGRATULATIONS, YOU ARE ALMOST GRADUATING🥳',
            content: `<ul>
                <li>Provision of certificate</li>
                <li>School contact:</li>
                <li>Tutor contact:</li>
                <li>Congratulations😍😁</li>

            </ul>`
        }
     

        
    ],
    'YOUTUBE,TIKTOK MONETIZATION & SOCIAL MEDIA MANAGEMENT': [
        {
            title: 'Module 1: Introduction to Social Media',
            content: `<ul>
                <li>What is social media?</li>
                <li>Popular platforms overview</li>
            </ul>`
        },
        {
            title: 'Module 2: Creating Your First Account',
            content: `<ul>
                <li>Setting up YouTube and TikTok</li>
                <li>Basic profile setup</li>
            </ul>`
        },
        {
            title: 'Module 3: Making Simple Videos',
            content: `<ul>
                <li>Recording with your phone</li>
                <li>Basic editing tips</li>
            </ul>`
        },
        {
            title: 'Module 4: Posting and Sharing Content',
            content: `<ul>
                <li>Uploading videos</li>
                <li>Writing good captions</li>
            </ul>`
        },
        {
            title: 'Module 5: Growing Your Audience',
            content: `<ul>
                <li>Understanding hashtags</li>
                <li>Engaging with viewers</li>
            </ul>`
        },
        {
            title: 'Module 6: Monetization Basics',
            content: `<ul>
                <li>How creators earn money</li>
                <li>Simple requirements for monetization</li>
            </ul>`
        },
        {
            title: 'Module 7: Social Media Management',
            content: `<ul>
                <li>Scheduling posts</li>
                <li>Using free management tools</li>
            </ul>`
        },
        {
            title: 'Module 8: Mini Project - Launch Your Channel',
            content: `<ul>
                <li>Create and post your first video</li>
                <li>Share with friends and family</li>
            </ul>`
        }
    ],
    'VIRTUAL ASSISTANT, DIGITAL MARKETING & CHAT MODERATION': [
        {
            title: 'Module 1: What is a Virtual Assistant?',
            content: `<ul>
                <li>Introduction to virtual assistance</li>
                <li>Common tasks and tools</li>
            </ul>`
        },
        {
            title: 'Module 2: Communication Skills',
            content: `<ul>
                <li>Writing simple emails</li>
                <li>Basic phone etiquette</li>
            </ul>`
        },
        {
            title: 'Module 3: Introduction to Digital Marketing',
            content: `<ul>
                <li>What is digital marketing?</li>
                <li>Simple marketing channels</li>
            </ul>`
        },
        {
            title: 'Module 4: Social Media Basics',
            content: `<ul>
                <li>Managing Facebook and Instagram pages</li>
                <li>Scheduling posts</li>
            </ul>`
        },
        {
            title: 'Module 5: Chat Moderation Essentials',
            content: `<ul>
                <li>What is chat moderation?</li>
                <li>Simple rules for moderating</li>
            </ul>`
        },
        {
            title: 'Module 6: Using Online Tools',
            content: `<ul>
                <li>Google Docs and Sheets basics</li>
                <li>Simple task management</li>
            </ul>`
        },
        {
            title: 'Module 7: Time Management',
            content: `<ul>
                <li>Planning your day</li>
                <li>Staying organized</li>
            </ul>`
        },
        {
            title: 'Module 8: Mini Project - Assist a Small Business',
            content: `<ul>
                <li>Help with emails or social media for a local business</li>
                <li>Share your experience</li>
            </ul>`
        }
    ]
};
const courses = [
    {
        id: 'web-dev',
        title: 'Web Development',
        desc: 'Master HTML, CSS, JavaScript and modern frameworks to build responsive websites and web applications.',
        duration: '8 weeks',
        level: 'Beginner'
    },
    {
        id: 'data-science',
        title: 'Data Science',
        desc: 'Learn Python, statistics, and machine learning to extract valuable insights from complex datasets.',
        duration: '12 weeks',
        level: 'Intermediate'
    },
    {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        desc: 'Protect systems and networks from digital attacks with essential security principles and techniques.',
        duration: '10 weeks',
        level: 'Intermediate'
    },
    {
        id: 'GRAPHICS DESIGN & Architecture',
        title: 'GRAPHICS DESIGN & Architecture',
        desc: 'Master the art of visually communicating ideas using typography, imagery, color, and layout principles',
        duration: '12 weeks',
        level: 'Intermediate'
    },
    {
        id: 'YOUTUBE,TIKTOK MONETIZATION & SOCIAL MEDIA MANAGEMENT',
        title: 'YOUTUBE,TIKTOK MONETIZATION & SOCIAL MEDIA MANAGEMENT',
        desc: 'Master content creation, audience growth, and monetization on YouTube, TikTok, and social media..',
        duration: '9 weeks',
        level: 'Intermediate'
    },
    {
        id: 'VIRTUAL ASSISTANT, DIGITAL MARKETING & CHAT MODERATION',
        title: 'VIRTUAL ASSISTANT, DIGITAL MARKETING & CHAT MODERATION',
        desc: 'Master virtual assistance, digital marketing strategies, and effective, engaging chat moderation..',
        duration: '14 weeks',
        level: 'Advanced'
    }
];

// Current registration details
let currentRegistration = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    level: '',
    amount: 0,
    receipt: '',
    schedule: ''
};

// DOM elements
const mainContent = document.getElementById('main-content');
const navMenu = document.getElementById('nav-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const coursesContainer = document.getElementById('courses-container');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Render courses
    renderCourses();
    
    // Auto-scroll for courses section
    setInterval(() => {
        const coursesSection = document.getElementById('courses');
        if (coursesSection.style.display === 'block') {
            const scrollPos = window.scrollY;
            const coursesTop = coursesSection.offsetTop;
            
            if (scrollPos >= coursesTop - 100 && scrollPos <= coursesTop + 500) {
                window.scrollTo({
                    top: scrollPos + 1,
                    behavior: 'smooth'
                });
            }
        }
    }, 5000);
});

// Render courses to the page
function renderCourses() {
    coursesContainer.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image">
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="200" fill="#1E293B"/>
                    <rect x="50" y="50" width="300" height="30" rx="5" fill="#334155"/>
                    <rect x="50" y="90" width="250" height="30" rx="5" fill="#334155"/>
                    <rect x="50" y="130" width="200" height="30" rx="5" fill="#F59E0B"/>
                </svg>
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.desc}</p>
                <div class="course-meta">
                    <span><i class="far fa-clock"></i> ${course.duration}</span>
                    <span><i class="far fa-user"></i> ${course.level}</span>
                </div>
            </div>
        `;
        courseCard.addEventListener('click', () => showCourseDetail(course.id));
        coursesContainer.appendChild(courseCard);
    });
}
  // Load student data from backend API
   async function loadStudents(courseId) {
    try {
        const response = await fetch(`/api/students?course=${courseId}`);  // Using backticks (`)
        const data = await response.json();
        courses[courseId].students = data;
        updateDashboard();
    } catch (error) {
        console.error("Error loading students:", error);
        // Optional: Add user-friendly error handling here
    }
    if (!courseId) {
    console.error("No courseId provided");
    return;
}
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
}


    // Update all course cards with accurate counts
    function updateDashboard() {
        document.querySelectorAll('.admin-course-card').forEach(card => {
            const courseId = card.getAttribute('data-course');
            const course = courses[courseId];
            const paidStudents = course.students.filter(s => s.payment_confirmed).length;
            const totalStudents = paidStudents + course.initialCount;
            
            card.querySelector('p:nth-child(2)').textContent = 
                `Students: ${totalStudents}`;
        });
    }

    // Payment confirmation handler (typically called via webhook)
    window.confirmPayment = function(studentId, courseId) {
        const student = courses[courseId].students.find(s => s.id === studentId);
        if (student) {
            student.payment_confirmed = true;
            updateDashboard();
        }
    };

    // Initialize all courses

// Navigation functions
function showHome() {
    hideAllSections();
    document.getElementById('home').style.display = 'flex';
    setActiveNav('home');
}

function showAbout() {
    hideAllSections();
    document.getElementById('about').style.display = 'block';
    setActiveNav('about');
}

function showCourses() {
    hideAllSections();
    document.getElementById('courses').style.display = 'block';
    setActiveNav('courses');
}

function showAdmin() {
    openModal('admin-login-modal');
}

// Define modules for each course
const courseModules = {
    'web-dev': [
        {
            title: 'Module 1: HTML Fundamentals',
            content: `<p>Learn the building blocks of WEB DEVELOPMENT with HTML5.</p>
                <ul>
                    <li>HTML document structure</li>
                    <li>Semantic HTML elements</li>
                    <li>Forms and input types</li>
                    <li>Accessibility best practices</li>
                </ul>`
        },
        {
            title: 'Module 2: CSS Styling',
            content: `<p>Master the art of styling web pages with CSS3.</p>
                <ul>
                    <li>CSS selectors and properties</li>
                    <li>Flexbox and Grid layouts</li>
                    <li>Responsive design principles</li>
                    <li>CSS animations and transitions</li>
                </ul>`
        },
        {
            title: 'Module 3: JavaScript Programming',
            content: `<p>Add interactivity to your websites with JavaScript.</p>
                <ul>
                    <li>Variables, data types, and operators</li>
                    <li>Functions and control structures</li>
                    <li>DOM manipulation</li>
                    <li>Event handling</li>
                </ul>`
        },
        {
            title: 'Module 4: Modern Frameworks',
            content: `<p>Explore popular frontend frameworks and libraries.</p>
                <ul>
                    <li>Introduction to React.js</li>
                    <li>Vue.js fundamentals</li>
                    <li>Component-based architecture</li>
                    <li>State management</li>
                </ul>`
        }
    ],
    'data-science': [
        {
            title: 'Module 1: Python Programming',
            content: `<p>Learn Python basics for data analysis.</p>
                <ul>
                    <li>Syntax and data structures</li>
                    <li>Pandas and NumPy</li>
                    <li>Data cleaning</li>
                </ul>`
        },
        {
            title: 'Module 2: Statistics & Visualization',
            content: `<p>Understand statistics and visualize data.</p>
                <ul>
                    <li>Descriptive statistics</li>
                    <li>Matplotlib and Seaborn</li>
                    <li>Data storytelling</li>
                </ul>`
        },
        {
            title: 'Module 3: Machine Learning',
            content: `<p>Introduction to machine learning concepts.</p>
                <ul>
                    <li>Supervised vs unsupervised learning</li>
                    <li>Scikit-learn basics</li>
                    <li>Model evaluation</li>
                </ul>`
        }
    ],
    'cybersecurity': [
        {
            title: 'Module 1: Security Principles',
            content: `<p>Understand the basics of cybersecurity.</p>
                <ul>
                    <li>Threats and vulnerabilities</li>
                    <li>Risk management</li>
                </ul>`
        },
        {
            title: 'Module 2: Network Security',
            content: `<p>Protecting networks from attacks.</p>
                <ul>
                    <li>Firewalls and VPNs</li>
                    <li>Network protocols</li>
                </ul>`
        }
    ],
    'cloud-computing': [
        {
            title: 'Module 1: Design Principles',
            content: `<p>Learn the basics of graphic design.</p>
                <ul>
                    <li>Typography</li>
                    <li>Color theory</li>
                </ul>`
        },
        {
            title: 'Module 2: Tools & Software',
            content: `<p>Work with industry-standard tools.</p>
                <ul>
                    <li>Adobe Photoshop</li>
                    <li>Illustrator basics</li>
                </ul>`
        }
    ],
    'mobile-dev': [
        {
            title: 'Module 1: Mobile App Basics',
            content: `<p>Introduction to YOUTUBE,TIKTOK MONETIZATION & SOCIAL MEDIA MANAGEMENT.</p>
                <ul>
                    <li>Platform overview</li>
                    <li>UI/UX for mobile</li>
                </ul>`
        },
        {
            title: 'Module 2: Cross-Platform Tools',
            content: `<p>Build apps for multiple platforms.</p>
                <ul>
                    <li>React Native</li>
                    <li>Flutter basics</li>
                </ul>`
        }
    ],
    'ai-ml': [
        {
            title: 'Module 1: AI Concepts',
            content: `<p>Introduction to AI and ML.</p>
                <ul>
                    <li>Neural networks</li>
                    <li>Natural language processing</li>
                </ul>`
        },
        {
            title: 'Module 2: Practical Applications',
            content: `<p>Apply AI in real-world scenarios.</p>
                <ul>
                    <li>Chatbots</li>
                    <li>Image recognition</li>
                </ul>`
        }
    ]
};

// Merge beginner modules into courseModules if not already present
Object.keys(beginnerCourseModules).forEach(key => {
    if (!courseModules[key]) {
        courseModules[key] = beginnerCourseModules[key];
    }
});
/*
 * Replace courseModules modules for web-dev, data-science, and cybersecurity
 * with the beginnerCourseModules for those courses.
 */
['web-dev', 'data-science', 'cybersecurity'].forEach(key => {
    if (beginnerCourseModules[key]) {
        courseModules[key] = beginnerCourseModules[key];
    }
});
function showCourseDetail(courseId) {
    hideAllSections();
    const detailSection = document.getElementById('course-detail');
    detailSection.style.display = 'block';
    
    const course = courseDetails[courseId];
    document.getElementById('course-detail-title').textContent = course.title;
    document.getElementById('course-detail-desc').textContent = course.desc;
    
    // Update stats
    const stats = document.querySelectorAll('.course-stats .stat-item h3');
    stats[0].textContent = course.duration;
    stats[1].textContent = course.salary;
    stats[2].textContent = course.rate;
    
    // Set course for registration
    currentRegistration.course = courseId;

    // Render modules dynamically
    const modulesContainer = document.querySelector('.course-modules');
    if (modulesContainer) {
        modulesContainer.innerHTML = `<h2 style="margin-bottom: 20px; color: var(--accent);">Course Modules</h2>`;
        (courseModules[courseId] || []).forEach(module => {
            const moduleDiv = document.createElement('div');
            moduleDiv.className = 'module-item';
            moduleDiv.innerHTML = `
                <div class="module-title" onclick="toggleModule(this)">
                    <h3>${module.title}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="module-content">
                    ${module.content}
                </div>
            `;
            modulesContainer.appendChild(moduleDiv);
        });
    }
}

function setActiveNav(section) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = Array.from(navLinks).find(
        link => link.textContent.includes(section.charAt(0).toUpperCase() + section.slice(1))
    );
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function hideAllSections() {
    const sections = mainContent.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

async function saveToDatabase(studentData) {
    try {
        const response = await fetch('/api/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        const data = await response.json();
        console.log("Database save successful:", data);
    } catch (error) {
        console.error("Error saving to database:", error);
    }
}

// In proceedToPayment()
function proceedToPayment() {
    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const courseSelect = document.getElementById('course');
    const levelSelect = document.getElementById('level');
    
    const course = courseSelect.options[courseSelect.selectedIndex].text;
    const level = levelSelect.options[levelSelect.selectedIndex].text.split(' ')[0];
    const amount = levelSelect.value === 'beginner' ? 10000 : 
                  levelSelect.value === 'intermediate' ? 15000 : 20000;
    
    // Generate receipt ID
    const now = new Date();
    const receiptId = `TS101-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Prepare student data
    const studentData = {
        firstName,
        lastName,
        email,
        phone,
        course,
        level,
        amount,
        receiptId,
        paymentStatus: 'Pending'
    };
    
    // Save to database
    saveToDatabase(studentData);
    
    // Redirect to payment instructions
    window.location.href = `payment-instructions.html?course=${encodeURIComponent(course)}&level=${encodeURIComponent(level)}&amount=${amount}`;
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openRegistration() {
    openModal('registration-modal');
}

function proceedToPayment() {
    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const courseSelect = document.getElementById('course');
    const levelSelect = document.getElementById('level');
    
    const course = courseSelect.options[courseSelect.selectedIndex].text;
    const level = levelSelect.options[levelSelect.selectedIndex].text.split(' ')[0];
    const amount = levelSelect.value === 'beginner' ? 10000 : 
                  levelSelect.value === 'intermediate' ? 15000 : 20000;

    // Redirect to payment instructions page
    window.location.href = `payment-instructions.html?course=${encodeURIComponent(course)}&level=${encodeURIComponent(level)}&amount=${amount}`;
}

function sendPaymentRequest() {
    const phone = document.getElementById('phone-confirm').value;
    
    if (!phone) {
        alert('Please enter your phone number');
        return;
    }
    
    // Show confirmation message
    document.getElementById('payment-status').textContent = 'PENDING';
    document.getElementById('payment-status').className = 'paid-status unpaid';
    
    // Simulate payment request
    setTimeout(() => {
        document.getElementById('payment-status').textContent = 'PAYMENT REQUEST SENT';
        document.getElementById('payment-status').className = 'paid-status unpaid';
        
        // Show confirmation modal after delay
        setTimeout(() => {
            closeModal('payment-modal');
            openModal('confirm-modal');
            
            // Set receipt number in confirmation modal
            document.getElementById('receipt-number').value = currentRegistration.receipt;
            
            // Show message
            document.getElementById('confirm-message').innerHTML = `
                <p style="color: var(--accent);">Check your phone to complete payment</p>
                <p style="color: #94a3b8; font-size: 0.9rem;">
                    We've sent a payment request to ${phone}. Please complete the transaction and enter your receipt number above.
                </p>
            `;
        }, 2000);
    }, 1000);
}

function confirmPayment() {
    const receiptNumber = document.getElementById('receipt-number').value;
    
    if (!receiptNumber) {
        alert('Please enter your receipt number');
        return;
    }
    
    if (receiptNumber !== currentRegistration.receipt) {
        document.getElementById('confirm-message').innerHTML = `
            <p style="color: var(--danger);">Invalid receipt number. Please try again.</p>
        `;
        return;
    }
    async function sendSTK() {
  const phone = document.getElementById("phone").value;
  const amount = document.getElementById("amount").value;

  const res = await fetch('/api/stkpush', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount })
  });

  const data = await res.json();
  console.log(data);
  alert("Payment prompt sent. Check your phone.");
}

    // Show success message
    document.getElementById('confirm-message').innerHTML = `
        <p style="color: var(--success);">Payment confirmed successfully!</p>
    `;
    
    // Proceed to schedule selection
    setTimeout(() => {
        closeModal('confirm-modal');
        openModal('schedule-modal');
    }, 1500);
}

function confirmSchedule() {
    const selectedSchedule = document.querySelector('input[name="schedule"]:checked');
    
    if (!selectedSchedule) {
        alert('Please select a schedule');
        return;
    }
    
    currentRegistration.schedule = selectedSchedule.value === 'morning' ? 'Morning' : 'Evening';
    
    // Show success message
    document.getElementById('schedule-message').innerHTML = `
        <p style="color: var(--success);">Schedule confirmed! You're all set.</p>
    `;
    
    // Show success modal
    setTimeout(() => {
        closeModal('schedule-modal');
        openModal('success-modal');
        
        // Add to students list for admin
        const course = currentRegistration.course;
        students[course].push({
            id: students[course].length + 1,
            name: `${currentRegistration.firstName} ${currentRegistration.lastName}`,
            email: currentRegistration.email,
            phone: currentRegistration.phone,
            date: new Date().toISOString().split('T')[0],
            paid: true,
            schedule: currentRegistration.schedule,
            status: 'Active'
        });
    }, 1500);
}

// Admin functions
function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Simple authentication
    if (username === 'admin' && password === 'admin123') {
        closeModal('admin-login-modal');
        hideAllSections();
        document.getElementById('admin-dashboard').style.display = 'block';
        setActiveNav('admin');
        showStudents('web-dev');
    } else {
        document.getElementById('login-message').textContent = 'Invalid username or password';
    }
}

// Example using Express.js
app.get('/api/payments', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM payments ORDER BY payment_date DESC');
        conn.release();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

window.location.href = `payment-confirmation.html?course=${encodeURIComponent(course)}&level=${encodeURIComponent(level)}&amount=${amount}`;
// In your index.html script
function proceedToPayment() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    
    // Store in localStorage temporarily
    localStorage.setItem('studentFirstName', firstName);
    localStorage.setItem('studentLastName', lastName);
    
    // ... rest of the code
}
// After successful payment
async function confirmPaymentInDatabase(transactionId) {
    try {
        const response = await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                receipt: currentRegistration.receipt,
                transactionId: transactionId,
                status: 'completed'
            })
        });
        
        const data = await response.json();
        console.log("Payment confirmed in database:", data);
    } catch (error) {
        console.error("Error confirming payment:", error);
    }
}

function showStudents(courseId) {
    document.getElementById('student-list-title').textContent = `${courseDetails[courseId].title} Students`;
    
    const studentList = document.getElementById('students-list');
    studentList.innerHTML = '';
    
    students[courseId].forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.date}</td>
            <td>${student.paid ? '<span style="color: var(--success);">Paid</span>' : '<span style="color: var(--danger);">Unpaid</span>'}</td>
            <td>${student.schedule}</td>
            <td>${student.status}</td>
            <td>
                <button class="student-action-btn complete-btn" onclick="updateStudentStatus(${student.id}, '${courseId}', 'Completed')">Complete</button>
                <button class="student-action-btn defer-btn" onclick="updateStudentStatus(${student.id}, '${courseId}', 'Deferred')">Defer</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}


function updateStudentStatus(studentId, courseId, status) {
    // Find the student
    const studentIndex = students[courseId].findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
        // Update status
        students[courseId][studentIndex].status = status;
        
        // Refresh the student list
        showStudents(courseId);
    }
}

function toggleModule(element) {
    const content = element.nextElementSibling;
    content.classList.toggle('show');
    
    const icon = element.querySelector('i');
    if (content.classList.contains('show')) {
        icon.className = 'fas fa-chevron-up';
    } else {
        icon.className = 'fas fa-chevron-down';
    }
}
// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
}

// Form Validation and Submission
function validateAndProceed() {
    const form = document.getElementById('registration-form');
    const submitBtn = document.querySelector('#registration-modal .btn-primary');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    // Validate required fields
    inputs.forEach(input => {
        if (!input.value) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
            
            input.parentElement.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.parentElement.style.animation = '';
            }, 500);
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    // Validate terms checkbox
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        terms.parentElement.style.animation = 'shake 0.5s';
        setTimeout(() => {
            terms.parentElement.style.animation = '';
        }, 500);
        isValid = false;
    }
    
    if (isValid) {
        submitBtn.classList.add('loading');
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            middleName: document.getElementById('middle-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            course: document.getElementById('course').value,
            level: document.getElementById('level').value
        };

         if (isValid) {
        submitBtn.classList.add('loading');
        
        // Collect form data
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const middleName = document.getElementById('middle-name').value.trim();
        const course = document.getElementById('course').value;
        const level = document.getElementById('level').value;
        
        // Calculate amount
        const amountMap = { beginner: 10000, intermediate: 15000, advanced: 20000 };
        const amount = amountMap[level] || 10000;

        // Store names properly
                const fullName = middleName 
            ? `${firstName} ${middleName} ${lastName}`
            : `${firstName} ${lastName}`;
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('firstName', firstName);

        // Redirect to payment instructions
        setTimeout(() => {
            window.location.href = `payment-instructions.html?firstName=${encodeURIComponent(firstName)}&fullName=${encodeURIComponent(fullName)}&course=${encodeURIComponent(course)}&level=${encodeURIComponent(level)}&amount=${amount}`;
        }, 1500);
    }

        // Calculate amount based on level
        const amountMap = {
            'beginner': 10000,
            'intermediate': 15000,
            'advanced': 20000
        };
        formData.amount = amountMap[formData.level] || 10000;

        // Store data in localStorage for confirmation page
        localStorage.setItem('registrationData', JSON.stringify(formData));

        // Redirect to payment page after a brief delay
        setTimeout(() => {
            window.location.href = `payment-instructions.html?course=${encodeURIComponent(formData.course)}&level=${encodeURIComponent(formData.level)}&amount=${formData.amount}`;
        }, 1500);
    }
}


        // ===== CHATBOT FUNCTIONALITY ===== //
        const chatbotLauncher = document.getElementById('chatbotLauncher');
        const chatbotContainer = document.getElementById('chatbotContainer');
        const chatbotClose = document.getElementById('chatbotClose');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const chatbotQuery = document.getElementById('chatbotQuery');
        const sendChatbotQuery = document.getElementById('sendChatbotQuery');
        
        // Course data
        const course = [
            { id: '1', name: 'Web Development', tutor: 'Ian Njoroge', tutorPhone: '+254741261579', description: 'Full stack web development course' },
            { id: '2', name: 'Data Science', tutor: 'Victor', tutorPhone: '+254704230381', description: 'Data analysis and machine learning' },
            { id: '3', name: 'Cybersecurity', tutor: 'Excel', tutorPhone: '+254117487554', description: 'Cybersecurity fundamentals and practices' },
            { id: '4', name: 'Graphics Design & Architecture', tutor: 'Iann Abungana', tutorPhone: '+254759097157', description: 'Design principles and architectural concepts' },
            { id: '5', name: 'YouTube, TikTok Monetization & Social Media Management', tutor: 'Telvin', tutorPhone: '+254746550166', description: 'Social media marketing and monetization strategies' },
            { id: '6', name: 'Virtual Assistant, Digital Marketing & Chat Moderation', tutor: 'Caleb', tutorPhone: '+254791870469', description: 'Virtual assistance and digital marketing techniques' }
        ];
        
  

        