'use client';

import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

// Initialize Firestore security rules for transactions
const transactionRules = {
  rules: {
    transactions: {
      ".read": "auth != null",
      ".write": "auth != null",
      "$transaction_id": {
        ".validate": "newData.hasChildren(['orgId', 'contactId', 'name', 'amount', 'status', 'type', 'platform', 'probability', 'date'])",
        "orgId": {
          ".validate": "newData.isString()"
        },
        "contactId": {
          ".validate": "newData.isString()"
        },
        "amount": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "status": {
          ".validate": "newData.isString() && ['pending', 'completed', 'failed', 'refunded'].includes(newData.val())"
        },
        "type": {
          ".validate": "newData.isString() && ['donation', 'purchase', 'subscription', 'other'].includes(newData.val())"
        },
        "platform": {
          ".validate": "newData.isString() && ['stripe', 'manual', 'other'].includes(newData.val())"
        },
        "probability": {
          ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100"
        }
      }
    }
  }
};

// Initialize the rules in Firestore
export async function initializeFirebaseRules() {
  try {
    const rulesDoc = doc(db, '_rules', 'transactions');
    await setDoc(rulesDoc, transactionRules);
    console.log('Firebase rules initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase rules:', error);
  }
}