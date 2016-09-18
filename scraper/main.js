const testModule = require('./modules/testModule');


testModule.testFunction(2).then(result => {
  console.log(result);
}).catch(e => {
  console.error(e);
});
