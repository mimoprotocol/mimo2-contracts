module.exports = async ({ ethers, getNamedAccounts, deployments }) => {
    const { deploy } = deployments;

    const { log } = deployments;
    const namedAccounts = await getNamedAccounts();
    const { deployer } = namedAccounts;

    const deployResult = await deploy('MimoReferral', {
        from: deployer,
        log: true,
        deterministicDeployment: false,
    });
    if (deployResult.newlyDeployed) {
        log(
            `contract MimoReferral deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        );
    }
};
module.exports.tags = ['MimoReferral'];
