const http = require('http');

const BASE_URL = 'http://localhost:5000';

function request(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        ...headers
      }
    };

    if (body) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('=== PRACTICAL 7 BACKEND AUTH & MIDDLEWARE TEST SUITE ===\n');
  const results = [];

  const recordResult = (name, expected, actual, status) => {
    results.push({ name, expected, actual, status });
    console.log(`[${status}] ${name}`);
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}\n`);
  };

  const testEmail1 = `student_${Date.now()}@example.com`;
  const testPassword1 = 'password123';
  let token1 = null;

  try {
    // Test 1: Register Valid User
    const regRes = await request('/register', 'POST', { email: testEmail1, password: testPassword1 });
    recordResult(
      'Test 1: Register Valid User',
      '201 Created with success message',
      `${regRes.status} ${JSON.stringify(regRes.body)}`,
      regRes.status === 201 ? 'PASS' : 'FAIL'
    );

    // Test 2: Duplicate Registration
    const dupRes = await request('/register', 'POST', { email: testEmail1, password: testPassword1 });
    recordResult(
      'Test 2: Duplicate Registration Rejection',
      '400 Bad Request',
      `${dupRes.status} ${JSON.stringify(dupRes.body)}`,
      dupRes.status === 400 ? 'PASS' : 'FAIL'
    );

    // Test 3: Invalid Registration Input
    const invalidRegRes = await request('/register', 'POST', { email: 'bad-email', password: '' });
    recordResult(
      'Test 3: Invalid Registration Input',
      '400 Bad Request',
      `${invalidRegRes.status} ${JSON.stringify(invalidRegRes.body)}`,
      invalidRegRes.status === 400 ? 'PASS' : 'FAIL'
    );

    // Test 4: Login Valid Credentials
    const loginRes = await request('/login', 'POST', { email: testEmail1, password: testPassword1 });
    token1 = loginRes.body?.token;
    recordResult(
      'Test 4: Login Valid Credentials',
      '200 OK with JWT token',
      `${loginRes.status} Token returned: ${Boolean(token1)}`,
      loginRes.status === 200 && Boolean(token1) ? 'PASS' : 'FAIL'
    );

    // Test 5: Login Wrong Password
    const wrongPassRes = await request('/login', 'POST', { email: testEmail1, password: 'wrongpassword' });
    recordResult(
      'Test 5: Login Wrong Password',
      '401 Unauthorized',
      `${wrongPassRes.status} ${JSON.stringify(wrongPassRes.body)}`,
      wrongPassRes.status === 401 ? 'PASS' : 'FAIL'
    );

    // Test 6: Protected Route Without Token
    const noTokenRes = await request('/tasks', 'GET');
    recordResult(
      'Test 6: Protected Route Without Token',
      '401 Unauthorized',
      `${noTokenRes.status} ${JSON.stringify(noTokenRes.body)}`,
      noTokenRes.status === 401 ? 'PASS' : 'FAIL'
    );

    // Test 7: Protected Route With Valid Token
    const withTokenRes = await request('/tasks', 'GET', null, { Authorization: `Bearer ${token1}` });
    recordResult(
      'Test 7: Protected Route With Valid Token',
      '200 OK array of user tasks',
      `${withTokenRes.status} IsArray: ${Array.isArray(withTokenRes.body)}`,
      withTokenRes.status === 200 && Array.isArray(withTokenRes.body) ? 'PASS' : 'FAIL'
    );

    // Test 8: GET /me
    const meRes = await request('/me', 'GET', null, { Authorization: `Bearer ${token1}` });
    const hasNoPassword = meRes.body && !meRes.body.password && !meRes.body.passwordHash;
    recordResult(
      'Test 8: GET /me current user details',
      `200 OK with safe email (${testEmail1}) and NO password`,
      `${meRes.status} Email: ${meRes.body?.email}, HasNoPassword: ${hasNoPassword}`,
      meRes.status === 200 && meRes.body?.email === testEmail1 && hasNoPassword ? 'PASS' : 'FAIL'
    );

    // Test 9: Protected Route With Invalid Token
    const invalidTokenRes = await request('/tasks', 'GET', null, { Authorization: 'Bearer invalidtoken123' });
    recordResult(
      'Test 9: Protected Route With Invalid Token',
      '401 Unauthorized',
      `${invalidTokenRes.status} ${JSON.stringify(invalidTokenRes.body)}`,
      invalidTokenRes.status === 401 ? 'PASS' : 'FAIL'
    );

    // Test 10: Malformed Authorization Header
    const malformedHeaderRes = await request('/tasks', 'GET', null, { Authorization: 'Basic dXNlcjpwYXNz' });
    recordResult(
      'Test 10: Malformed Authorization Header',
      '401 Unauthorized',
      `${malformedHeaderRes.status} ${JSON.stringify(malformedHeaderRes.body)}`,
      malformedHeaderRes.status === 401 ? 'PASS' : 'FAIL'
    );

    // Test 11: Task Input Validation
    const invalidTaskRes = await request('/tasks', 'POST', {}, { Authorization: `Bearer ${token1}` });
    recordResult(
      'Test 11: Task Validation Missing Title',
      '400 Bad Request',
      `${invalidTaskRes.status} ${JSON.stringify(invalidTaskRes.body)}`,
      invalidTaskRes.status === 400 ? 'PASS' : 'FAIL'
    );

    // Test 12: Task Creation & User Isolation
    const createTaskRes = await request('/tasks', 'POST', { title: 'User 1 Task', priority: 'high' }, { Authorization: `Bearer ${token1}` });
    const taskId1 = createTaskRes.body?._id;

    // Register user 2
    const testEmail2 = `user2_${Date.now()}@example.com`;
    await request('/register', 'POST', { email: testEmail2, password: testPassword1 });
    const loginRes2 = await request('/login', 'POST', { email: testEmail2, password: testPassword1 });
    const token2 = loginRes2.body?.token;

    // User 2 tries to access User 1's task
    const user2GetTaskRes = await request(`/tasks/${taskId1}`, 'GET', null, { Authorization: `Bearer ${token2}` });
    recordResult(
      'Test 12: Task User Ownership Isolation',
      '404 Not Found (User 2 cannot access User 1 task)',
      `${user2GetTaskRes.status} ${JSON.stringify(user2GetTaskRes.body)}`,
      user2GetTaskRes.status === 404 ? 'PASS' : 'FAIL'
    );

    console.log('=== TEST SUMMARY ===');
    const passedCount = results.filter(r => r.status === 'PASS').length;
    console.log(`Passed: ${passedCount}/${results.length}`);

  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
