import { ethers, getNamedAccounts, deployments } from "hardhat";

async function main() {
    const { execute } = deployments;

    const referralAddress = (await deployments.get("MimoReferral")).address;

    const namedAccounts = await getNamedAccounts();
    const { deployer } = namedAccounts;

    const executeResult = await execute('MimoFactory', {
        from: deployer,
        log: true,
    }, 'setReferral', referralAddress);

    console.log(`MimoFactory set referral to ${referralAddress} using ${executeResult.gasUsed} gas at ${executeResult.transactionHash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });