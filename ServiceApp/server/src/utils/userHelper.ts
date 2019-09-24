import axios from 'axios';
import yargs from 'yargs';
import { faucet, faucetAmount } from '../config.json';
import { writeData } from './databaseHelper';
import { generateNewWallet, getBalance } from './walletHelper.js';
import { createNewUser } from './credentialHelper';

const createNewWallet = async () => {
    console.log('Creating wallet...');
    const wallet = generateNewWallet();
    const response = await axios.get(`${faucet}?address=${wallet.address}&amount=${faucetAmount}`);
    if (response.data.success) {
        const balance = await getBalance(wallet.address);
        await writeData('wallet', { ...wallet, balance });
    }
};

const argv = yargs
    .usage('Create new user or wallet')
    .example('$0 --create user --role SR --name user-SR-123 --location 47.934438,10.340688', 'Creates a new Service Requester with name user-SR-123')
    .required('create', 'Mode must be provided').describe('create', 'Create new user or wallet. Options: ["user", "wallet"]')
    .describe('role', 'Define user role. Options: ["SR", "SP"]')
    .describe('name', 'Define user name')
    .describe('location', 'Define location')
    .help('help')
    .argv;

if (argv.create === 'user') {
    console.log("Sup?");
    const { name, role = '', location = '' } = argv;
    if (name && (role === 'SR' || role === 'SP')) {
        createNewUser(name, role, location);
    }
} else if (argv.create === 'wallet') {
    createNewWallet();
} else {
    console.log('Wrong mode. Possible modes: ["user", "wallet"]');
}
