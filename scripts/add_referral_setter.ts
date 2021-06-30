import { ethers, getNamedAccounts, deployments } from "hardhat";

async function main() {
    const { execute } = deployments;

    const routerAddress = (await deployments.get("MimoV2Router02")).address;

    const namedAccounts = await getNamedAccounts();
    const { deployer } = namedAccounts;

    const executeResult = await execute('MimoReferral', {
        from: deployer,
        log: true,
    }, 'addSetter', routerAddress);

    console.log(`MimoReferral add setter ${routerAddress} using ${executeResult.gasUsed} gas at ${executeResult.transactionHash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });