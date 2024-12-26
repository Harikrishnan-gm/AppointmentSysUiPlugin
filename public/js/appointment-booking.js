(function() {
    const API_BASE_URL = 'http://localhost:5000';

    // Create a container for the plugin UI
    const container = document.createElement('div');
    container.id = 'appointment-booking-container';

    // Insert the UI HTML
    container.innerHTML = `
        <h1>Book an Appointment</h1>
        <form id="booking-form">
            <input type="text" id="name" placeholder="Your Name" required />
            <input type="text" id="phone" placeholder="Your Phone" required />
            <input type="date" id="date" required />
            <select id="time-slot" required></select>
            <button type="submit">Book Appointment</button>
        </form>
        <div id="message"></div>
    `;

    // Append the plugin container to the body
    document.body.appendChild(container);

    // Fetch available slots for a selected date
    document.getElementById('date').addEventListener('change', async (e) => {
        const date = e.target.value;
        if (!date) return;

        try {
            const response = await fetch(`${API_BASE_URL}/available-slots?date=${date}`);
            if (response.ok) {
                const slots = await response.json();
                const timeSlotSelect = document.getElementById('time-slot');
                timeSlotSelect.innerHTML = '';
                
                if (slots.length === 0) {
                    timeSlotSelect.innerHTML = '<option value="">No available slots</option>';
                } else {
                    slots.forEach(slot => {
                        const option = document.createElement('option');
                        option.value = slot;
                        option.textContent = slot;
                        timeSlotSelect.appendChild(option);
                    });
                }
            } else {
                console.error('Failed to fetch available slots');
            }
        } catch (error) {
            console.error('Error fetching available slots:', error);
        }
    });

    // Handle the form submission for booking
    document.getElementById('booking-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const timeSlot = document.getElementById('time-slot').value;

        try {
            const response = await fetch(`${API_BASE_URL}/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, date, time_slot: timeSlot }),
            });
            
            const message = await response.json();
            document.getElementById('message').innerText = message.message;
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    });
})();
