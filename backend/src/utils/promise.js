export function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitFor(fn, interval = 200, timeout = 5000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const result = await fn();
        if (result) return resolve(result);

        if (Date.now() - start >= timeout) {
          return reject(new Error("waitFor: timeout exceeded"));
        }

        setTimeout(check, interval);
      } catch (err) {
        reject(err);
      }
    };

    check();
  });
}
