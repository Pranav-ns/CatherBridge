

async function test() {
  try {
    console.log('Sending request to login API...');
    const res = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'pranav.ns01@gmail.com', password: 'password', role: 'client' })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
