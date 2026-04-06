/**
 * eWAY Rapid API Sandbox Test Script
 * This script demonstrates a basic Direct Connection transaction using Sandbox credentials.
 * 
 * To run: node backend/test_eway/eway_test.js
 */

const rapid = require('eway-rapid');

// --- SANDBOX CREDENTIALS (REPLACE WITH YOUR OWN IF NEEDED) ---
const API_KEY = '60CF3Ce97nRSlZ1Wp5m9kMmzHHEh8Rkuj31QCtVxjpWGYA9FymYqsk0Enm1P6mHJf0THbR';
const PASSWORD = 'API-P4ss';
const ENDPOINT = 'https://api.sandbox.ewaypayments.com/';

const client = rapid.createClient(API_KEY, PASSWORD, ENDPOINT);

async function testEwayTransaction() {
    console.log('--- INITIATING EWAY SANDBOX TRANSACTION TEST ---');

    const payload = {
        Customer: {
            CardDetails: {
                Name: 'John Smith',
                Number: '4444333322221111', // Test Card
                ExpiryMonth: '12',
                ExpiryYear: '25',
                CVN: '123'
            }
        },
        Payment: {
            TotalAmount: 1000, // $10.00 in cents
            CurrencyCode: 'AUD',
            InvoiceNumber: 'INV-' + Date.now(),
            InvoiceDescription: 'Sandbox Test Transaction'
        },
        TransactionType: 'Purchase',
        Method: 'Process'
    };

    try {
        console.log('Sending request to eWAY...');
        const response = await client.createTransaction(rapid.Enum.Method.DIRECT, payload);
        
        console.log('\n--- EWAY RESPONSE ---');
        console.log('Transaction Status:', response.TransactionStatus ? 'SUCCESS' : 'FAILED');
        console.log('Response Code:', response.ResponseCode);
        console.log('Transaction ID:', response.TransactionID);
        
        if (response.Errors) {
            console.log('Errors:', response.Errors);
        }

        if (response.TransactionStatus) {
            console.log('\nQuerying transaction details for ID:', response.TransactionID);
            const queryRes = await client.queryTransaction(response.TransactionID);
            console.log('Query Result Status:', queryRes.Transactions[0].TransactionStatus ? 'SUCCESS' : 'FAILED');
        }

    } catch (error) {
        console.error('\n[FATAL ERROR] API Call Failed:');
        console.error(JSON.stringify(error, null, 2) || error);
    }
}

testEwayTransaction();
