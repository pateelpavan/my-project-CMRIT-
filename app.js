  // Store registered phone numbers
        const registeredNumbers = new Set();
        let registrationCount = 0;
        
        // Update registration count
        function updateRegistrationCount() {
            document.getElementById('registrationCount').textContent = registrationCount;
        }
        
        // Show specific page and hide others
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
            
            // Create confetti effect when showing ticket
            if (pageId === 'page4') {
                createConfetti();
            }
        }
        
        // Verify security PIN
        function verifyPin() {
            const pin = document.getElementById('securityPin').value;
            if (pin === 'NSS2025') {
                showPage('page3');
            } else {
                alert('Invalid security PIN. Please try again.');
            }
        }
        //water mark
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.innerHTML = '<img src="cmrit_watermark.png" alt="Watermark" style="width: 100%; opacity: 0.1; position: absolute; top: 0; left: 0; z-index: -1;">';
        document.body.appendChild(watermark);
        
        // Handle form submission
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const mobile = document.getElementById('mobile').value;
            
            // Check if mobile number is already registered
            if (registeredNumbers.has(mobile)) {
                alert('This mobile number is already registered. Please use a different number.');
                return;
            }
            
            // Add to registered numbers
            registeredNumbers.add(mobile);
            registrationCount++;
            updateRegistrationCount();
            
            // Generate ticket
            generateTicket();
            
            // Show ticket page
            showPage('page4');
            // Family members limit
            if (registeredNumbers.size > 10) {
                alert('You can only register up to 10 family members.');
                return;
            }
        });
        
        // Generate ticket with details
        function generateTicket() {
            // Get form values
            const name = document.getElementById('name').value;
            const year = document.getElementById('year').value;
            const mobile = document.getElementById('mobile').value;
            const branch = document.getElementById('branch').value;
            const section = document.getElementById('section').value;
            const familyMembers = document.getElementById('familyMembers').value;
            
            // Generate ticket ID
            const ticketId = 'CMRIT' + Date.now().toString().slice(-6);
            
            // Update ticket details
            document.getElementById('ticketName').textContent = name;
            document.getElementById('ticketYear').textContent = year;
            document.getElementById('ticketMobile').textContent = mobile;
            document.getElementById('ticketBranch').textContent = branch;
            document.getElementById('ticketSection').textContent = section;
            document.getElementById('ticketFamily').textContent = familyMembers;
            document.getElementById('ticketId').textContent = ticketId;
            
            // Generate QR code
            const qrElement = document.getElementById('qrcode');
            qrElement.innerHTML = '';
            new QRCode(qrElement, {
                text: `CMRIT Ticket - ${name} - ${ticketId} - ${mobile} - ${branch} - ${section}`,
                width: 150,
                height: 150
            });
        }
        
        // Download ticket as image
        function downloadTicket() {
            alert('Ticket download functionality would be implemented here. In a real application, this would download your ticket as an image.');
            // In a real application, you would use a library like html2canvas to convert the ticket to an image
        }
        
        // Create confetti effect
        function createConfetti() {
            const colors = ['#ff6f00', '#4fc3f7', '#ffffff', '#1a237e'];
            
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                document.body.appendChild(confetti);
                
                // Animate confetti
                confetti.animate([
                    { top: '-10px', opacity: 1 },
                    { top: '100vh', opacity: 0 }
                ], {
                    duration: Math.random() * 3000 + 2000,
                    easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
                });
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        }
        
        // Initialize
        updateRegistrationCount();