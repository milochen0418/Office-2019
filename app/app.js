
import 'bootstrap/dist/css/bootstrap.min.css';

console.log('WELCOME TO OFFICE 2019');

const updateHTML = (data) => {
  console.log(data);
  const eventsArea = document.getElementById('past');
  eventsArea.innerHTML = '';
  data.forEach((it) => {
    const { returnValues } = it;
    const wrapper = document.createElement('div');
    wrapper.appendChild(document.createTextNode(`Value became ${returnValues.value}, updated by ${returnValues.updateBy}`));
    eventsArea.appendChild(wrapper);
  });
}

const init = async () => {
  /**
   * Make sure that when you get here, basic UI has already been rendered.
   * Web3 bundle is large so we might want to import it asynchronounsly
   *
   * Web3 team is working on reducing the bundle size, let's see how it goes
   * https://github.com/ethereum/web3.js/pull/2000
   */
  const Web3 = await import('web3');
  let httpHandler;
  let wsHandler;
  let netId;
  let myAccount;

  if (window.dexon) {
    await window.dexon.enable();
	  //cahnge by milo chen 
    httpHandler = new Web3.default(window.dexon);
    netId = await httpHandler.eth.net.getId();
    myAccount = (await httpHandler.eth.getAccounts())[0];
	  console.log(myAccount);
		console.log(httpHandler);
  }

  const getWebsocketEndpoint = () => {
    const DEXON_WS_ENDPOINT = (location.protocol === 'https:')
      ? 'wss://ws-proxy.dexon.org'
      : 'ws://testnet.dexon.org:8546';

    switch(netId) {
      case 5777: // If DekuSan is using local rpc
        //return 'ws://localhost:8545';
        return 'ws://dexon.pieapple.com:8545';
      // If DekuSan is connect to testnet or not availble
      case 238:
      default:
        return DEXON_WS_ENDPOINT;
    }
  }
  const ws_endpoint = getWebsocketEndpoint();
  console.log(`Websocket endpoint: ${ws_endpoint}`);

  wsHandler = new Web3.default(ws_endpoint);

  const contractInfo = (await import('../build/contracts/Hello.json')).default;
  const { abi, networks } = contractInfo;
  // If there's no netId, we use 238 as default network
  const address = networks[netId || 238].address;

  let contractReader;
  let contractWriter;

  // contractReader is created from wsHandler
  contractReader = new wsHandler.eth.Contract(abi, address);

  // contractWriter is created from httpHandler
  if (httpHandler) {
    contractWriter = new httpHandler.eth.Contract(abi, address);
  }

  // DOM Element to display "value" in contract
  const valueDisplayElement = document.getElementById('value');
  // Get current value and display it
  const val = await contractReader.methods.value().call();
  valueDisplayElement.textContent = val;

  // Subscribe to "UpdateNumber" event in order to have "value" updated automatically
  contractReader.events.UpdateNumber({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] UpdateNumber', data.returnValues.value);
    valueDisplayElement.textContent = data.returnValues.value;
	 updatePicture(data.returnValues.value);
    
  });


	function updatePicture( val) {
		console.log('updatePicture with val = ' + val);
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      console.log("xhttp.onreadystatechane is called");
      if (this.readyState == 4 && this.status == 200) {
          console.log('readState = 4 and status = 200');
          //document.getElementById("demo").innerHTML =
          //this.responseText;
          var image = document.getElementById("random-picture");
          image.src="http://dexon.pieapple.com:8765/images/index.jpg?" + new Date().getTime();
          
        }
      };
    xhttp.open("GET", "http://dexon.pieapple.com:8765/change/"+val, true);
    xhttp.send();		
  }
  
  // Call "update" function in the contract when we click on the update button
	const updateButton = document.getElementById('update');
	updateButton.onclick = async () => {
		console.log("wait myAccount");
		myAccount = (await httpHandler.eth.getAccounts())[0];
		console.log("get myAccount and it is ");
		console.log(myAccount);
		if (contractWriter && myAccount) {
			console.log("in the code block of if (contractWriter & myAccount) ... await contractWriter.methods.update().send");

			//await contractWriter.methods.update().send({
			var writer= contractWriter.methods.update();
			console.log(writer);
			await writer.send({
				from: myAccount,
			});
			console.log(writer);
			console.log("finish await");
		}
	}
	
  // Get all past "UpdateNumber" events
  const getPastButton = document.getElementById('getPast');
  getPastButton.onclick = async () => {
    const events = await contractReader.getPastEvents(
      'UpdateNumber', 
      {
        fromBlock: '0',
        toBlock: 'latest',
      }
    );
    console.log('past event: ', events);
    updateHTML(events);
  }

  // Query events by user address!
  const getPastByAccountButton = document.getElementById('getPastByAccount');
  getPastByAccountButton.onclick = async () => {
    const address = prompt('please enter the address that you want to search');
    if (address) {
      const events = await contractReader.getPastEvents(
        'UpdateNumber', 
        {
          filter: { 
            updateBy: address,
          },
          fromBlock: '0',
          toBlock: 'latest',
        }
      );
      console.log(`past events from ${address}: `, events);
      updateHTML(events);
    }
  }


};

init();
