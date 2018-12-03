const REQUEST_TIMEOUT = 5000;

function asyncRpcCall(client, method, params) {
  return new Promise((res, rej) => {
    let timeoutProtection = setTimeout(() => {
      // Report the timeout as triggered
      timeoutProtection = undefined;

      // Reject the request
      rej(new Error("Request timed out."));
    }, REQUEST_TIMEOUT);

    client.methodCall(method, params, (err, value) => {
      if (!timeoutProtection) {
        // Timeout already triggered, ignoring this result
        return;
      }

      clearTimeout(timeoutProtection);
      err ? rej(err) : res(value);
    });
  });
}

module.exports = {
  asyncRpcCall
};
