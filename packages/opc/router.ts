import axios from 'axios';

async function readPLCState() {
  const res = await axios.get('http://localhost:4080/plc/state');
  console.log(res.data);
}
