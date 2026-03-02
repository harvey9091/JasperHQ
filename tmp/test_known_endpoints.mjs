async function testEndpoints() {
    const baseUrl = 'http://127.0.0.1:18789';
    const token = 'd19f11ac135b1ad0ae283abd2188a7ca04f5878929a9514a';

    const testPaths = [
        '/agent/research',
        '/api/agent/research',
        '/_openclaw/agent/research',
        '/agent/dfy',
        '/ping'
    ];

    for (const path of testPaths) {
        const url = `${baseUrl}${path}`;
        try {
            console.log(`Testing ${url}...`);
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ test: true })
            });
            const text = await res.text();
            console.log(`   Status: ${res.status}`);
            console.log(`   Type: ${res.headers.get('content-type')}`);
            console.log(`   Body: ${text.substring(0, 100)}`);
        } catch (e) {
            console.log(`   Error: ${e.message}`);
        }
    }
}

testEndpoints();
