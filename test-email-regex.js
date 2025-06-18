// Test script to check which email formats are considered valid or invalid by our regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function testEmail(email) {
  const isValid = EMAIL_REGEX.test(email);
  console.log(`${email}: ${isValid ? 'VALID' : 'INVALID'}`);
}

// Test invalid emails
console.log('\nTesting supposedly invalid emails:');
const invalidEmails = [
  'plainaddress',
  '@example.com',
  'email.example.com',
  'email@example@example.com',
  'email@example',
  'email@example.c', // TLD too short
  'email@.com',
  'email@example.',
  'email@-example.com',
  'email@example..com',
];

invalidEmails.forEach(testEmail);

// Test valid emails
console.log('\nTesting supposedly valid emails:');
const validEmails = [
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'firstname+lastname@example.com',
  'email@123.123.123.123',
  '1234567890@example.com',
  'email@example-one.com',
  '_______@example.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com',
  'email.email@example.com',
];

validEmails.forEach(testEmail);