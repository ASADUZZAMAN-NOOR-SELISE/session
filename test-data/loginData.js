export const URLS = {
  login: 'https://rahulshettyacademy.com/loginpagePractise/',
  shop: /\/angularpractice\/shop/,
  documentsRequest: 'https://rahulshettyacademy.com/documents-request',
  qaCareer: 'https://rahulshettyacademy.com/qa-career-accelerator-job-ready',
};

export const VALID_USER = {
  username: 'rahulshettyacademy',
  password: 'Learning@830$3mK2',
};

export const MESSAGES = {
  pageTitle: 'LoginPage Practise | Rahul Shetty Academy',
  shopTitle: 'ProtoCommerce',
  incorrect: 'Incorrect username/password.',
  empty: 'Empty username/password.',
  userModal: 'You will be limited to only fewer functionalities of the app. Proceed?',
  signIn: 'Sign In',
  signingIn: 'Signing ..',
};

export const ROLES = [
  { value: 'stud', label: 'Student' },
  { value: 'teach', label: 'Teacher' },
  { value: 'consult', label: 'Consultant' },
];

export const PRODUCTS = ['iphone X', 'Samsung Note 8', 'Nokia Edge', 'Blackberry'];

export const INVALID_CREDENTIALS = [
  { name: 'valid username + wrong password', username: VALID_USER.username, password: 'wrongPassword' },
  { name: 'wrong username + valid password', username: 'wrongUser', password: VALID_USER.password },
  { name: 'username in uppercase', username: VALID_USER.username.toUpperCase(), password: VALID_USER.password },
  { name: 'password in lowercase', username: VALID_USER.username, password: VALID_USER.password.toLowerCase() },
  { name: 'username with leading/trailing spaces', username: ` ${VALID_USER.username} `, password: VALID_USER.password },
  { name: 'password with trailing space', username: VALID_USER.username, password: `${VALID_USER.password} ` },
  { name: 'partial password', username: VALID_USER.username, password: VALID_USER.password.slice(0, -1) },
  { name: 'username and password swapped', username: VALID_USER.password, password: VALID_USER.username },
  { name: 'SQL injection payload', username: "' OR '1'='1", password: "' OR '1'='1" },
  { name: 'XSS payload', username: '<script>alert(1)</script>', password: '<img src=x onerror=alert(1)>' },
  { name: 'very long input', username: 'a'.repeat(500), password: 'b'.repeat(500) },
  { name: 'special characters only', username: '!@#$%^&*()', password: '!@#$%^&*()' },
];

export const EMPTY_CREDENTIALS = [
  { name: 'only username filled', username: VALID_USER.username, password: '' },
  { name: 'only password filled', username: '', password: VALID_USER.password },
];
