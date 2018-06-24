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

    return App.getDevice();
  },

  getDevice: function() {
    console.log("getDevice");

    App.contracts.IotSecurity.deployed().then(function(instance) {
      return instance.getUsersDevices({ from: App.account });
    }).then(function(result) {
      console.log("result : " + result);
      console.log("JSON result : " + JSON.stringify(result));
      $('#transactionDetails').text(JSON.stringify(result));
      $('#transactionModal').modal('show'); 
      getDeviceArrayLength();
    }).catch(function(err) {
      console.error(err);
    });
  },

  getUsers: function() {
    console.log("getUsers");
    var deviceAdressToAdd = $('#deviceDropDownMenu').val();

    App.contracts.IotSecurity.deployed().then(function(instance) {
      return instance.getUsersFromDevice(deviceAdressToAdd);
    }).then(function(result) {
      console.log("result : " + result);
      console.log("JSON result : " + JSON.stringify(result));
      $('#transactionDetails').text(JSON.stringify(result));
      $('#transactionModal').modal('show'); 
      getUsersArrayLength();
    }).catch(function(err) {
      console.error(err);
    });
  },

  getPermission: function() {
    console.log("getPermission");
    var deviceAdressToViewPermission = $('#deviceDropDownMenu').val();
    var userAdressToViewPermission = $('#usersDropDownMenu').val();

    if($('#deviceDropDownMenu').val()!="NoDevices" && $('#usersDropDownMenu').val()!="NoUsers"){
      App.contracts.IotSecurity.deployed().then(function(instance) {
        return instance.getUserPermissionsForaDevice(deviceAdressToViewPermission, userAdressToViewPermission);
      }).then(function(result) {
        console.log("result : " + result);
        console.log("JSON result : " + JSON.stringify(result));
        $('#transactionDetails').text(JSON.stringify(result));
        $('#transactionModal').modal('show'); 
        return viewPermission();
      }).catch(function(err) {
        console.error(err);
      });
    }
  }

};

function viewPermission(){
  console.log("viewPermission");

  App.contracts.IotSecurity.deployed().then(function(instance) {
      return instance.user_permission();
    }).then(function(result) {
      console.log("result : " + result);
      console.log("JSON result : " + JSON.stringify(result));
      if(result=="ReadWrite"){
        result = "Read & Write";
      }
      $("#permissionAvailability").text(result).show();
    }).catch(function(err) {
      console.error(err);
    });
    
}

function getDeviceArrayLength(){
  console.log("getDeviceArrayLength");
  App.contracts.IotSecurity.deployed().then(function(instance) {
        return instance.user_arr_length();
      }).then(function(result) {
        $("#deviceDropDownMenu").empty();
        if(result>0){
          for (var i = 0; i < result; i++) {
            getDevicesOneByOne(i);
          }
      }
      else{
        console.log("No Devices Found");
        $("#deviceDropDownMenu").append('<option value="NoUsers">No Users</option>');
      }
        console.log("JSON result : " + JSON.stringify(result));
      }).catch(function(err) {
        console.error(err);
      });
}

function getDevicesOneByOne(i){
  console.log("getUsersOneByOne value : " + i);
  App.contracts.IotSecurity.deployed().then(function(instance) {
        return instance.user_arr(i);
      }).then(function(result) {
        $("#deviceDropDownMenu").append('<option value="' + result + '">' + result + '</option>')
        if(i==0){
          getUsersForDropDownMenu($('#deviceDropDownMenu').val());
        }
        console.log("result : " + result);
        console.log("JSON result : " + JSON.stringify(result));
      }).catch(function(err) {
        console.error(err);
      });
}

function getUsersArrayLength(){
  console.log("getDeviceArrayLength");
  App.contracts.IotSecurity.deployed().then(function(instance) {
        return instance.user_arr_length();
      }).then(function(result) {
        $("#usersDropDownMenu").empty();
        if(result>0){
          for (var i = 0; i < result; i++) {
            getUsersOneByOne(i);
          }
      }
      else{
        console.log("No Users Found");
        $("#usersDropDownMenu").append('<option value="NoUsers">No Users</option>');
      }
        console.log("JSON result : " + JSON.stringify(result));
      }).catch(function(err) {
        console.error(err);
      });
}

function getUsersOneByOne(i){
  console.log("getUsersOneByOne value : " + i);
  App.contracts.IotSecurity.deployed().then(function(instance) {
        return instance.user_arr(i);
      }).then(function(result) {
        $("#usersDropDownMenu").append('<option value="' + result + '">' + result + '</option>')
        console.log("result : " + result);
        console.log("JSON result : " + JSON.stringify(result));
      }).catch(function(err) {
        console.error(err);
      });
}

function getUsersForDropDownMenu(address){
  console.log("getUsers");

  App.contracts.IotSecurity.deployed().then(function(instance) {
    return instance.getUsersFromDevice(address);
  }).then(function(result) {
    console.log("result : " + result);
    console.log("JSON result : " + JSON.stringify(result));
    $('#transactionDetails').text(JSON.stringify(result));
    $('#transactionModal').modal('show'); 
    getUsersArrayLength();
  }).catch(function(err) {
    console.error(err);
  });
}

$('#deviceDropDownMenu').change(function(){
  $("#permissionAvailability").hide();
  if($('#deviceDropDownMenu').val() != 'NoDevices'){
      var currentSelectedDevice = $('#deviceDropDownMenu').val();
      getUsersForDropDownMenu(currentSelectedDevice);
  }
});

$(function() {
  $(window).load(function() {
    App.init();
  });
});