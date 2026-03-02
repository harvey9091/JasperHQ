async function testGetEndpoints() {
    const baseUrl = 'http://127.0.0.1:18789';
    const token = 'd19f11ac135b1ad0ae283abd2188a7ca04f5878929a9514a';

    const testPaths = [
        '/',
        '/api',
        '/_openclaw',
        '/_openclaw/sessions',
        '/_openclaw/agents',
        '/api/_openclaw/agents'
    ];

    for (const path of testPaths) {
        const url = `${baseUrl}${path}`;
        try {
            console.log(`Testing GET ${url}...`);
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const text = await res.text();
            console.log(`   Status: ${res.status}`);
            console.log(`   Body: ${text.substring(0, 100)}`);
        } catch (e) {
            console.log(`   Error: ${e.message}`);
        }
    }
}

testGetEndpoints();
