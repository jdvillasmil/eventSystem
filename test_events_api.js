// Test script to verify Events.list API
const fetch = require('node-fetch');

async function testEventsAPI() {
    try {
        const response = await fetch('http://localhost:3000/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tx: 'Events.list',
                params: []
            })
        });

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));

        if (data.ok) {
            console.log(`\n✅ SUCCESS: Found ${data.data.length} events`);
        } else {
            console.log(`\n❌ ERROR: ${data.error || data.code}`);
        }
    } catch (err) {
        console.error('❌ Request failed:', err.message);
    }
}

testEventsAPI();
