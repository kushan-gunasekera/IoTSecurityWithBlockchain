App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      console.log(web3.eth.accounts);
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      console.log("not undefined");
      // console.log(web3.eth.accounts);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      console.log("undefined");
      console.log(web3.eth.accounts);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("IotSecurity.json", function(iotsecurity) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.IotSecurity = TruffleContract(iotsecurity);
      // Connect provider to interact with contract
      App.contracts.IotSecurity.setProvider(App.web3Provider);

      // App.listenForEvents();

      // Load account data
      web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        console.log("Im here");
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  // listenForEvents: function() {
  //   App.contracts.IotSecurity.deployed().then(function(instance) {
  //     // Restart Chrome if you are unable to receive this event
  //     // This is a known issue with Metamask
  //     // https://github.com/MetaMask/metamask-extension/issues/2393
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       App.render();
  //     });
  //   });
  // },

  render: function() {
    var securityInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    // web3.eth.getCoinbase(function(err, account) {
    //   if (err === null) {
    //     console.log("Im here");
    //     App.account = account;
    //     $("#accountAddress").html("Your Account: " + account);
    //   }
    // });

    // Load contract data
    // App.contracts.IotSecurity.deployed().then(function(instance) {
    //   securityInstance = instance;
    //   console.log("test123");
    //   return securityInstance.getUsers(App.account);
    // }).then(function(candidatesCount) {
    //   console.log(candidatesCount);
    //   var candidatesResults = $("#candidatesResults");
    //   candidatesResults.empty();

    //   var candidatesSelect = $('#candidatesSelect');
    //   candidatesSelect.empty();

    //   for (var i = 1; i <= candidatesCount; i++) {
    //     securityInstance.candidates(i).then(function(candidate) {
    //       var id = candidate[0];
    //       var name = candidate[1];
    //       var voteCount = candidate[2];

    //       // Render candidate Result
    //       var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
    //       candidatesResults.append(candidateTemplate);

    //       // Render candidate ballot option
    //       var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
    //       candidatesSelect.append(candidateOption);
    //     });
    //   }
    //   return securityInstance.voters(App.account);
    // }).then(function(hasVoted) {
    //   // Do not allow a user to vote
    //   if(hasVoted) {
    //     $('form').hide();
    //   }
    //   loader.hide();
    //   content.show();
    // }).catch(function(error) {
    //   console.warn(error);
    // });
  },

  addUser: function() {
    console.log("addUser");
    var permissionToAdd = $('#permissionList').val();
    var deviceAdressToAdd = $('#deviceAddressList').val();
    var userAdressToAdd = $('#userAddressList').val();

    App.contracts.IotSecurity.deployed().then(function(instance) {
      return instance.addUsersToDevice(permissionToAdd, deviceAdressToAdd, userAdressToAdd);
    }).then(function(result) {
      console.log("NORMAL result : " + result);
      console.log("JSON result : " + JSON.stringify(result));
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  getUser: function() {
    console.log("getUser");
    var deviceAdressToGet = $('#getDeviceAddressList').val();

    App.contracts.IotSecurity.deployed().then(function(instance) {
      // return instance.arrayLength();
      return instance.getUsersFromDevice(deviceAdressToGet);
      // return instance.user_arr();
    }).then(function(result) {
      // var instanceNew;
      // var length = result;
      console.log("result : " + result);
      console.log("JSON result : " + JSON.stringify(result));

      // for (var i = 0; i < length; i++) {
      //   getUsersOneByOne(i);
      // }

      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  getPermission: function() {
    console.log("getPermission");
    var getPermissionDevice = $('#permissionDevice').val();
    var getPermissionUser = $('#permissionUser').val();

    App.contracts.IotSecurity.deployed().then(function(instance) {
      return instance.getUserPermissionsForaDevice(getPermissionDevice, getPermissionUser);
      // return instance.user_permission();
    }).then(function(result) {
      console.log("result : " + result);
      console.log("JSON result : " + JSON.stringify(result));
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  changePermission: function() {
    console.log("addUser");
    var changePermissionList = $('#changePermissionList').val();
    var changePermissionDevice = $('#changePermissionDevice').val();
    var changePermissionUser = $('#changePermissionUser').val();

    App.contracts.IotSecurity.deployed().then(function(instance) {
      return instance.changePermission(changePermissionDevice, changePermissionUser, changePermissionList);
    }).then(function(result) {
      console.log("result : " + result);
      console.log("JSON result : " + JSON.stringify(result));
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      // console.error(err);
    });
  }
};

function getUsersOneByOne(i){
  console.log("test value : " + i);
  App.contracts.IotSecurity.deployed().then(function(instance) {
        instanceNew = instance;
        return instanceNew.userArray(i);
      }).then(function(result) {
        console.log("result : ox" + result);
        console.log("JSON result : " + JSON.stringify(result));
        console.log("length : ");
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err) {
        // console.error(err);
      });
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});