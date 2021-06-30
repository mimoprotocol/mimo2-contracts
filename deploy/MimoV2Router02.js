const WETH = require('../utils/weth');

module.exports = async ({ ethers, getNamedAccounts, deployments }) => {
    const { deploy } = deployments;

    const { log } = deployments;
    const namedAccounts = await getNamedAccounts();
    const { deployer } = namedAccounts;

    const chainId = await getChainId();

    let wethAddress;
    if (chainId in WETH) {
        wethAddress = WETH[chainId].address;
    } else {
        throw Error("No WETH!");
    }
    const factoryAddress = (await deployments.get("MimoFactory")).address;

    const deployResult = await deploy('MimoV2Router02', {
        from: deployer,
        args: [factoryAddress, wethAddress],
        log: true,
        deterministicDeployment: false,
    });
    if (deployResult.newlyDeployed) {
        log(
            `contract MimoV2Router02 deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        );
    }
};
module.exports.tags = ['MimoV2Router02'];
module.exports.dependencies = ['MimoFactory', 'MimoReferral'];
