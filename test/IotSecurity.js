var IotSecurity = artifacts.require("./IotSecurity.sol");

contract("IotSecurity", function(accounts) {

	it("add users and permission to device", function(){
		return IotSecurity.deployed().then(function(instance){
			return instance.addUser("READ", "0x3b623f9b3b8f7c61a9e9e4859e7894c5557c", "0x2190e2bf49b98d6036ae050c8a5441b17ec20976");
		}).then(function(data){
			return data;
		});
	});

	it("get all users for a device", function(){
		return IotSecurity.deployed().then(function(instance){
			return instance.getUsers("0x3b623f9b3b8f7c61a9f37de9e4859e7894c5557c");
		}).then(function(data){
			return data;
		});
	});

	it("get permission for a given user for a device", function(){
		return IotSecurity.deployed().then(function(instance){
			return instance.getUserPermissions("0x3b623f9b3b8f7c61a9f37de9e4859e7894c5557c", "0x2190e2bf49b98d6036ae050c8a5441b17ec20976");
		}).then(function(data){
			return data;
		});
	});

	it("change permission for a given user for a device", function(){
		return IotSecurity.deployed().then(function(instance){
			return instance.changePermission("0x3b623f9b3b8f7c61a9f37de9e4859e7894c5557c", "0x2190e2bf49b98d6036ae050c8a5441b17ec20976", "WRITE");
		}).then(function(data){
			return data;
		});
	});

});