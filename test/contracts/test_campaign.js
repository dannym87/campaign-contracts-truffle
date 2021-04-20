const campaign = artifacts.require("Campaign");

contract("Campaign test", accounts => {
    let campaignContract;

    beforeEach(async () => {
        campaignContract = await campaign.new(1, accounts[0], {from: accounts[0]});
    });

    it("Should create Campaign with defaults", async () => {
        assert.ok(campaignContract);
        assert.equal(await campaignContract.minimumContribution(), 1);
        assert.equal(await campaignContract.manager(), accounts[0]);
        assert.equal(await campaignContract.countContributors(), 0);
        assert.equal(await campaignContract.countSpendRequests(), 0);
    });

    describe("Contribute to the Campaign", async () => {
        it("Can contribute to the Campaign", async () => {
            const result = await campaignContract.contribute({from: accounts[1], value: 50});

            assert.ok(result);
            assert.equal(await campaignContract.countContributors(), 1);
            assert.equal(await campaignContract.contributors(accounts[1]), true);
        });

        it("Prevents the same address contributing multiple times", async () => {
            const result = campaignContract.contribute({from: accounts[1], value: 50});
            assert.ok(result);

            try {
                await campaignContract.contribute({from: accounts[1], value: 50});
                assert.ok(false);
            } catch (e) {
                assert.equal(e.reason, "Already contributed");
            }
        });

        it("Must contribute the minimum amount required", async () => {
            try {
                await campaignContract.contribute({from: accounts[1], value: 0});
                assert.ok(false);
            } catch (e) {
                assert.equal(e.reason, "Contribution amount is too low");
            }
        });
    });

    describe("Create a Spend Request", async () => {
        it("Can create a Spend Request", async () => {
            const result = await campaignContract.createSpendRequest("materials", 50, accounts[1], {from: accounts[0]});

            assert.ok(result);
            assert.equal(await campaignContract.countSpendRequests(), 1);
        });

        it("Only the owner can create a Spend Request", async () => {
            try {
                await campaignContract.createSpendRequest("materials", 50, accounts[1], {from: accounts[1]});
                assert.ok(false);
            } catch (e) {
                assert.equal(e.reason, "Sender must be the contract owner");
            }
        });
    });

    describe("Approve a Spend Request", async () => {
        it("Contributor can approve a Spend Request", async () => {
            let result = await campaignContract.createSpendRequest("materials", 50, accounts[1], {from: accounts[0]});
            assert.ok(result);

            result = await campaignContract.approveSpendRequest(0, {from: accounts[1]});
            assert.ok(result);

            const spendRequest = await campaignContract.spendRequests(0);
            assert.equal(await campaignContract.countSpendRequests(), 1);
            assert.equal(spendRequest.countApproved, 1);
        });

        it("Can't approve a completed Spend Request", async () => {

        });

        it("Contributor can only approve a Spend Request once", async () => {
            let result = await campaignContract.createSpendRequest("materials", 50, accounts[1], {from: accounts[0]});
            assert.ok(result);

            result = await campaignContract.approveSpendRequest(0, {from: accounts[1]});
            assert.ok(result);

            try {
                await campaignContract.approveSpendRequest(0, {from: accounts[1]});
                assert.ok(false);
            } catch (e) {
                assert.equal(e.reason, "Already approved Spend Request");
            }
        });
    });

    describe("Finalise a Spend Request", async () => {
        it("Can finalise a Spend Request", async () => {

        });

        it("Only allows the owner to finalise a Spend Request", async () => {

        });

        it("Can't finalise a completed Spend Request", async () => {

        });

        it("Requires over 50% of approvals to finalise a Spend Request", async () => {

        });

        it("Can get the total number of Spend Requests", async () => {

        });
    });
});
