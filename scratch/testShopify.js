async function test() {
  try {
    const res = await fetch('https://byshree.com/collections/kurtis-and-kurtas/products.json?limit=3');
    if (!res.ok) {
      console.log('HTTP Error:', res.status);
      return;
    }
    const data = await res.json();
    console.log('JSON keys:', Object.keys(data));
    console.log('Sample product:', JSON.stringify(data.products[0], null, 2));
  } catch (err) {
    console.error('Fetch Error:', err.message);
  }
}
test();
