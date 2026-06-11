async function verifyMens() {
  try {
    const res = await fetch('https://blissclub.com/collections/menswear-collection/products.json?limit=3');
    if (res.ok) {
      const data = await res.json();
      console.log('Menswear collection product count:', data.products?.length);
      if (data.products?.length > 0) {
        console.log('Sample men\'s product:', data.products[0].title);
      }
    } else {
      console.log('HTTP Error:', res.status);
    }
  } catch (err) {
    console.error('Fetch Error:', err.message);
  }
}
verifyMens();
