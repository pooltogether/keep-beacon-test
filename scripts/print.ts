// We require the Buidler Runtime Environment explicitly here. This is optional
// when running the script with `buidler run <script>`: you'll find the Buidler

// Runtime Environment's members available as global variable in that case.
let benv = require("@nomiclabs/buidler");

async function printMain() {
  // You can run Buidler tasks from a script.
  // For example, we make sure everything is compiled by running "compile"
  await benv.run("compile");
  
  console.log(benv.config)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
printMain()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
