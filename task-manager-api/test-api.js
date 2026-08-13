const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('=== STARTING API TESTS ===\n');
  let passedCount = 0;
  let totalCount = 0;

  async function test(name, fn) {
    totalCount++;
    try {
      console.log(`[TEST] ${name}`);
      await fn();
      console.log(`[PASS] ${name}\n`);
      passedCount++;
    } catch (error) {
      console.error(`[FAIL] ${name}`);
      console.error(error.message);
      console.log();
    }
  }

  // 1. GET /tasks
  await test('GET /tasks returns initial array of 2 tasks (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Expected JSON array');
    if (data.length !== 2) throw new Error(`Expected 2 tasks, got ${data.length}`);
    console.log(`       Received: ${data.length} tasks`);
  });

  // 2. POST /tasks (Success)
  let createdTaskId;
  await test('POST /tasks creates a new task (201 Created)', async () => {
    const payload = {
      title: 'Written by Test Script',
      description: 'Check automated tests output',
      completed: false
    };
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const data = await res.json();
    if (!data.id) throw new Error('Expected task ID to be returned');
    createdTaskId = data.id;
    console.log(`       Created task with ID: ${createdTaskId}`);
  });

  // 3. POST /tasks (Fail: Missing Content-Type)
  await test('POST /tasks fails without Content-Type header (400 Bad Request)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST'
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (!data.error) throw new Error('Expected error description');
    console.log(`       Error msg: "${data.error}"`);
  });

  // 4. POST /tasks (Fail: Invalid Content-Type)
  await test('POST /tasks fails with invalid Content-Type (415 Unsupported Media Type)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'Raw text content'
    });
    if (res.status !== 415) throw new Error(`Expected 415, got ${res.status}`);
    const data = await res.json();
    if (!data.error) throw new Error('Expected error description');
    console.log(`       Error msg: "${data.error}"`);
  });

  // 5. POST /tasks (Fail: Invalid payload, missing title)
  await test('POST /tasks fails with empty/missing title (400 Bad Request)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'No title' })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (!data.error) throw new Error('Expected error description');
    console.log(`       Error msg: "${data.error}"`);
  });

  // 6. PUT /tasks/:id (Success)
  await test('PUT /tasks/:id updates task fields (200 OK)', async () => {
    const payload = {
      title: 'Updated title by Script',
      completed: true
    };
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (data.title !== payload.title) throw new Error('Title update not reflected');
    if (data.completed !== payload.completed) throw new Error('Completed update not reflected');
    console.log(`       Updated name: "${data.title}" completed: ${data.completed}`);
  });

  // 7. PUT /tasks/:id (Fail: Route-specific validation of non-alphanumeric/invalid ID format)
  await test('PUT /tasks/abc fails with validation error (400 Bad Request)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/abc`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (!data.error) throw new Error('Expected validation error message');
    console.log(`       Error msg: "${data.error}"`);
  });

  // 8. PUT /tasks/:id (Fail: Non-existent ID)
  await test('PUT /tasks/999 fails with 404 (404 Not Found)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    if (!data.error) throw new Error('Expected 404 error message');
    console.log(`       Error msg: "${data.error}"`);
  });

  // 9. DELETE /tasks/:id (Success)
  await test('DELETE /tasks/:id deletes task and returns success (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'DELETE'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!data.message) throw new Error('Expected message in response');
    console.log(`       Response msg: "${data.message}"`);
  });

  // 10. GET /undefined-route
  await test('GET /undefined-route hits 404 handler (404 Not Found)', async () => {
    const res = await fetch(`${BASE_URL}/some-undefined-path`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Route not found') throw new Error(`Unexpected error message: ${data.error}`);
    console.log(`       Route not found JSON handled successfully`);
  });

  // 11. GET /trigger-error
  await test('GET /trigger-error triggers global error handler (500 Internal Server Error)', async () => {
    const res = await fetch(`${BASE_URL}/trigger-error`);
    if (res.status !== 500) throw new Error(`Expected 500, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Something went wrong') throw new Error(`Unexpected error message: ${data.error}`);
    console.log(`       Server gracefully returned: {"error": "${data.error}", "message": "${data.message}"}`);
  });

  console.log(`=== TEST SUMMARY: ${passedCount}/${totalCount} PASSED ===`);
  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
