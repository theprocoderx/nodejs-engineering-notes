fetch('http://localhost:3000/')
  .then((res) => res.arrayBuffer())
  .then((data) => {
    // const uint8Array = new Uint8Array(data);
    const decoder = new TextDecoder('utf-8');
    // decoder.decode(uint8Array);
    console.log(decoder.decode(data));
  });
