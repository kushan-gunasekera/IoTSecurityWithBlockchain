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
    $.getJSON("../IotSecurity.json", function(iotsecurity) {
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

  render: function() {
    var securityInstance;
    var loader = $("#loader");
    var content = $("#content");
  },

  addDeviceToUser: function() {

    console.log("addDeviceToUser");
    var deviceAdressToAdd = $('#deviceAddress').val();

    if(App.account != deviceAdressToAdd){
      App.contracts.IotSecurity.deployed().then(function(instance) {
      return instance.addOwner(deviceAdressToAdd, { from: App.account });
    }).then(function(result) {
      $("#deviceAddress").val("");
      console.log("NORMAL result : " + result);
      console.log("JSON result : " + JSON.stringify(result));
      getJSON = JSON.stringify(result);
      console.log("getJSON.tx : " + getJSON.tx);
      $('#transactionDetails').text(JSON.stringify(result));
      $('#transactionModal').modal('show'); 
    }).catch(function(err) {
      console.error(err);
    });
    }
    else{
      $("#deviceAddress").val("");
    }
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});