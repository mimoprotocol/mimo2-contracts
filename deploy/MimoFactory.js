module.exports = async ({ ethers, getNamedAccounts, deployments }) => {
    const { deploy } = deployments;

    const { log } = deployments;
    const namedAccounts = await getNamedAccounts();
    const { deployer } = namedAccounts;

    const deployResult = await deploy('MimoFactory', {
        from: deployer,
        args: [deployer],
        log: true,
        deterministicDeployment: false,
    });
    if (deployResult.newlyDeployed) {
        log(
            `contract MimoFactory deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        );
    }
};
module.exports.tags = ['MimoFactory'];
