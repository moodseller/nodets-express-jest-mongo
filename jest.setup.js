// For async tests, catch all errors here so we don't have to try/catch everywhere for safety
// eslint-disable-next-line no-console
process.on('unhandledRejection', (err) => console.log(err));
