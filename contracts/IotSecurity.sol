pragma solidity ^0.4.24;

contract IotSecurity {
    
    bool access;
    address [] public user_arr;
    uint public user_arr_length = 0;
    string public user_permission ="Not Available";
    
    struct deviceUserInfo {
        address user;
        string data;
        string permission;
    }
    
    struct user_info {
        address device;
        string permission;
    }
    
    struct user {
        user_info [] users_devices;
    }
    
    struct device {
        address owner;
        deviceUserInfo [] DeviceInfo;
    }
    
    event e_Permission (string permission);
    
    mapping(address => device) devices;
    
    mapping(address => user) users;
    
    function addUsersToDevice (string permission, address deviceAddress, address userAddress) public {
        deviceUserInfo memory obj = deviceUserInfo({
            user: userAddress,
            data: "null",
            permission: permission
        });

        devices[deviceAddress].DeviceInfo.push(obj);
    }

    function getUsersFromDevice (address devAddress) public {
        delete user_arr;
        for (uint i =0 ; i < devices[devAddress].DeviceInfo.length ; i++){
            user_arr.push(devices[devAddress].DeviceInfo[i].user);
        }
        // return user_arr;
    }
    
    function getUserPermissionsForaDevice (address devAddress, address userAddress) public returns (string){
        for (uint i =0 ; i < devices[devAddress].DeviceInfo.length ; i++){
            if (devices[devAddress].DeviceInfo[i].user == userAddress){
                user_permission = devices[devAddress].DeviceInfo[i].permission;
                break;
            }
        }
        return user_permission;
    }
    
    function changePermission (address devAddress, address userAddress, string permission) public {
        for (uint i =0 ; i < devices[devAddress].DeviceInfo.length ; i++){
            if (devices[devAddress].DeviceInfo[i].user == userAddress){
                devices[devAddress].DeviceInfo[i].permission = permission;
                emit e_Permission(permission);
                break;
            }
        }
    }
    
    function addDeviceToUser (address devAddress) public {
        user_info memory obj = user_info({
            device: devAddress,
            permission: "Read/Write"
        });
        users[msg.sender].users_devices.push(obj);
    }
    
    function getUsersDevices() public {
        delete user_arr;
        if(users[msg.sender].users_devices.length>0){
            for (uint i = 0; i < users[msg.sender].users_devices.length; i++){
                user_arr.push(users[msg.sender].users_devices[i].device);
                user_arr_length = user_arr.length;
            }
        }
    }
    
    function verifyTransaction(string reqPermission, address deviceAddr, address userAddr) public{
        
        for(uint i = 0; i<devices[deviceAddr].DeviceInfo.length; i++){

            string memory permission = devices[deviceAddr].DeviceInfo[i].permission;
        
            if (  keccak256(permission) == keccak256(reqPermission) ){
                access = true;
                break;
            }
            access = false;
        }   
    }
    
}
