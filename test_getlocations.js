// Test script to verify Reservations.getLocations endpoint
const testUrl = 'http://localhost:3000/api';

async function testGetLocations() {
    try {
        const response = await fetch(testUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                tx: 'Reservations.getLocations',
                params: [{}]
            })
        });

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.ok) {
            console.log('\n✅ SUCCESS! Locations:', data.data);
        } else {
            console.log('\n❌ ERROR:', data.error || data.code);
        }
    } catch (err) {
        console.error('❌ Fetch error:', err.message);
    }
}

testGetLocations();
