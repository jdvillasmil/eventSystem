// Test script to verify API responses
// Run this in the browser console after logging in

async function testAPI() {
    console.log('=== Testing API Responses ===');

    // Test 1: Get all events
    console.log('\n1. Testing Events.list()');
    try {
        const response1 = await fetch('http://localhost:3000/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tx: 'Events.list', params: [] })
        });
        const data1 = await response1.json();
        console.log('Events.list response:', data1);
        console.log('Number of events:', data1.data?.length);
    } catch (err) {
        console.error('Error in Events.list:', err);
    }

    // Test 2: Get attendees for event 1
    console.log('\n2. Testing Attendance.listByEvent(1)');
    try {
        const response2 = await fetch('http://localhost:3000/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tx: 'Attendance.listByEvent', params: [1] })
        });
        const data2 = await response2.json();
        console.log('Attendance.listByEvent response:', data2);
        console.log('Number of attendees:', data2.data?.length);
        console.log('First attendee:', data2.data?.[0]);
    } catch (err) {
        console.error('Error in Attendance.listByEvent:', err);
    }

    // Test 3: Get expenses for event 1
    console.log('\n3. Testing Expenses.listByEvent(1)');
    try {
        const response3 = await fetch('http://localhost:3000/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tx: 'Expenses.listByEvent', params: [1] })
        });
        const data3 = await response3.json();
        console.log('Expenses.listByEvent response:', data3);
        console.log('Number of expenses:', data3.data?.length);
    } catch (err) {
        console.error('Error in Expenses.listByEvent:', err);
    }

    // Test 4: Get financial detail for event 1
    console.log('\n4. Testing Reports.eventFinancialDetail(1)');
    try {
        const response4 = await fetch('http://localhost:3000/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ tx: 'Reports.eventFinancialDetail', params: [1] })
        });
        const data4 = await response4.json();
        console.log('Reports.eventFinancialDetail response:', data4);
        console.log('Financial data:', data4.data);
    } catch (err) {
        console.error('Error in Reports.eventFinancialDetail:', err);
    }

    console.log('\n=== Tests Complete ===');
}

// Run the tests
testAPI();
