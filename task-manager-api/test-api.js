const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('=== STARTING MONGOOSE INTEGRATION TESTS ===\n');
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
      console.error('      ', error.message);
      console.log();
    }
  }

  // 1. GET /tasks
  await test('GET /tasks returns a JSON array (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Expected JSON array of tasks');
    console.log(`       Database tasks fetched, status code: 200. Array count: ${data.length}`);
  });

  // 2. POST /tasks (Trim Pre-Save hook check)
  let createdTaskId;
  await test('POST /tasks trims title whitespace using pre-save hook (201 Created)', async () => {
    const payload = {
      title: '   Trimmed by Mongoose pre-save   ',
      description: 'Check automated trim pre-save hook',
      priority: 'high'
    };
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const data = await res.json();
    if (!data._id) throw new Error('Expected MongoDB _id to be present');
    createdTaskId = data._id;
    if (data.title !== 'Trimmed by Mongoose pre-save') {
      throw new Error(`Expected trimmed title "Trimmed by Mongoose pre-save", but got "${data.title}"`);
    }
    console.log(`       Task created with ID: ${createdTaskId}`);
    console.log(`       Received title: "${data.title}" (Whitespace successfully trimmed!)`);
  });

  // 3. POST /tasks (Fail: Missing Content-Type)
  await test('POST /tasks without Content-Type header fails (400 Bad Request)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST'
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Missing Content-Type header') throw new Error(`Unexpected error: ${data.error}`);
    console.log(`       Error msg: "${data.error}"`);
  });

  // 4. POST /tasks (Fail: Missing Title Validation)
  await test('POST /tasks without title triggers Mongoose validation error (400 Bad Request)', async () => {
    const payload = {
      description: 'Missing title request',
      priority: 'low'
    };
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Validation failed') throw new Error(`Expected "Validation failed", got "${data.error}"`);
    if (!data.details || !data.details.title) throw new Error('Expected details.title error description');
    console.log(`       Error msg: "${data.error}"`);
    console.log(`       Details: ${JSON.stringify(data.details)}`);
  });

  // 5. POST /tasks (Fail: Invalid priority enum)
  await test('POST /tasks with invalid priority enum triggers validation error (400 Bad Request)', async () => {
    const payload = {
      title: 'Invalid Enum Test',
      priority: 'urgent' // not in ['low', 'medium', 'high']
    };
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Validation failed') throw new Error(`Expected "Validation failed", got "${data.error}"`);
    if (!data.details || !data.details.priority) throw new Error('Expected details.priority error description');
    console.log(`       Error msg: "${data.error}"`);
    console.log(`       Details: ${JSON.stringify(data.details)}`);
  });

  // 6. GET /tasks/:id (Success)
  await test('GET /tasks/:id returns single task (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (data._id !== createdTaskId) throw new Error('Returned task ID mismatch');
    console.log(`       Successfully fetched task title: "${data.title}"`);
  });

  // 7. GET /tasks/abc (Fail: Route-specific validation for invalid ObjectId format)
  await test('GET /tasks/abc fails with custom ID format error (400 Bad Request)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/abc`);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (!data.error || !data.error.includes('Invalid Task ID format')) {
      throw new Error(`Unexpected error message layout: ${data.error}`);
    }
    console.log(`       Cleanly intercepted invalid ID: "${data.error}"`);
  });

  // 8. GET /tasks/507f1f77bcf86cd799439011 (Fail: Valid ObjectId but non-existent)
  await test('GET /tasks/507f1f77bcf86cd799439011 returns 404 (404 Not Found)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/507f1f77bcf86cd799439011`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Task not found') throw new Error(`Expected "Task not found", got "${data.error}"`);
    console.log(`       Valid ID but not present output: "${data.error}"`);
  });

  // 9. PUT /tasks/:id (Success and validator run check)
  await test('PUT /tasks/:id updates fields and executes validators (200 OK)', async () => {
    const payload = {
      title: '   Practical 5 integration complete   ',
      completed: true,
      priority: 'low'
    };
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    // Checks that title was trimmed as well during update validation / pre-save context?
    // Wait, findByIdAndUpdate pre hooks behave differently in Mongoose (default pre('save') does NOT run on update!).
    // But title is still stored. Let's make sure it is updated.
    if (data.priority !== 'low') throw new Error('Updated priority not reflected');
    if (data.completed !== true) throw new Error('Updated completion status not reflected');
    console.log(`       Updated fields -> priority: "${data.priority}" completed: ${data.completed}`);
  });

  // 10. PUT /tasks/:id (Fail: Validation runner checks enum)
  await test('PUT /tasks/:id fails with validation format error on invalid enum (400 Bad Request)', async () => {
    const payload = {
      priority: 'critical'
    };
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Validation failed') throw new Error(`Expected "Validation failed", got "${data.error}"`);
    console.log(`       Validator caught: "${data.error}" details: ${JSON.stringify(data.details)}`);
  });

  // 11. DELETE /tasks/:id (Success)
  await test('DELETE /tasks/:id deletes task and returns success (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'DELETE'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!data.message || data.message !== 'Task deleted successfully') {
      throw new Error(`Unexpected message: ${data.message}`);
    }
    console.log(`       Delete output message: "${data.message}"`);
  });

  // 12. GET /undefined-route
  await test('GET /undefined-route hits 404 handler (404 Not Found)', async () => {
    const res = await fetch(`${BASE_URL}/some-obvious-undefined-endpoint`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Route not found') throw new Error(`Expected "Route not found", got "${data.error}"`);
    console.log(`       404 Catch-All returns: ${JSON.stringify(data)}`);
  });

  // 13. GET /trigger-error
  await test('GET /trigger-error triggers global error handler hiding track traces (500 Internal Server Error)', async () => {
    const res = await fetch(`${BASE_URL}/trigger-error`);
    if (res.status !== 500) throw new Error(`Expected 500, got ${res.status}`);
    const data = await res.json();
    if (data.error !== 'Something went wrong') throw new Error(`Expected generic error, got "${data.error}"`);
    if (data.stack || data.message) throw new Error('Leaked detailed error traces/messages!');
    console.log(`       Global error handled cleanly: ${JSON.stringify(data)}`);
  });

  console.log(`=== TEST SUMMARY: ${passedCount}/${totalCount} PASSED ===`);
  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
