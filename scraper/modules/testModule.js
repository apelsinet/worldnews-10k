const TestModule = {
  testFunction: (x) => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x * 2);
    }, 1000);
  })
}

module.exports = TestModule;
