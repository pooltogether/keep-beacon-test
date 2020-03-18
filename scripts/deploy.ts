// We require the Buidler Runtime Environment explicitly here. This is optional
// when running the script with `buidler run <script>`: you'll find the Buidler

// Runtime Environment's members available as global variable in that case.
const env = require("@nomiclabs/buidler");

async function main() {
  // You can run Buidler tasks from a script.
  // For example, we make sure everything is compiled by running "compile"
  await env.run("compile");
  
  const signers = await env.ethers.getSigners()
  const owner = signers[0]
  const admin = signers[1]

  const ownerAddress = await owner.getAddress()
  const adminAddress = await admin.getAddress()
  const adminBalance = await env.ethers.provider.getBalance(adminAddress)

  console.log(`Admin ${adminAddress} balance: ${adminBalance.toString()}`)

  const keepPoolFactory = await env.ethers.getContractFactory("KeepPool", admin)
  const keepPool = await keepPoolFactory.deploy()
  await keepPool.initialize(ownerAddress, "0x6994C48a7A59BA4006508CE24716a64F163dA014")

  console.log(`DEPLOYED KEEPPOOL TO ${keepPool.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
