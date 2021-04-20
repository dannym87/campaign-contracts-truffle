const campaignFactory = artifacts.require("CampaignFactory");

contract("CampaignFactory test", async accounts => {
    it("Should create a new Campaign", async () => {
        const campaignFactoryContract = await campaignFactory.deployed();
        const result = await campaignFactoryContract.createCampaign(1, {from: accounts[0]});
        assert.ok(result);

        const campaigns = await campaignFactoryContract.getDeployedCampaigns();
        assert.equal(campaigns.length, 1);
    });

    it("Receives an invalid minimum contribution", async () => {
        const campaignFactoryContract = await campaignFactory.deployed();

        try {
            await campaignFactoryContract.createCampaign("invalid minimumContribution", {
                from: accounts[0]
            });
            assert.ok(false);
        } catch (e) {
            assert(e);
        }
    });
});
