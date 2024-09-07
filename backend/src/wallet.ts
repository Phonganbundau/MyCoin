import * as bip39 from 'bip39';
import { ec } from 'elliptic';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import * as _ from 'lodash';
import { getPublicKey, getTransactionId, signTxIn, Transaction, TxIn, TxOut, UnspentTxOut } from './transaction';

const EC = new ec('secp256k1');
const privateKeyLocation = process.env.PRIVATE_KEY || 'node/wallet/private_key';

// Tạo passphrase và private key từ passphrase
const createNewWalletWithPassphrase = async (): Promise<{ passphrase: string, privateKey: string, publicKey: string }> => {
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);

    const keyPair = EC.genKeyPair({ entropy: seed.slice(0, 32) });
    const privateKey = keyPair.getPrivate().toString(16);
    const publicKey = keyPair.getPublic().encode('hex');

    // Đọc dữ liệu ví cũ từ file nếu tồn tại, và kiểm tra nếu nó là mảng
    let walletDataArray = [];
    if (existsSync(privateKeyLocation)) {
        const existingData = readFileSync(privateKeyLocation, 'utf8');
        try {
            walletDataArray = JSON.parse(existingData) || [];
        } catch (error) {
            console.error('Error parsing existing data:', error);
        }
    }

   
    if (!Array.isArray(walletDataArray)) {
        walletDataArray = [];
    }


    const newWalletData = { publicKey, privateKey, passphrase: mnemonic };
    walletDataArray.push(newWalletData);

    // Ghi lại toàn bộ dữ liệu ví vào file
    writeFileSync(privateKeyLocation, JSON.stringify(walletDataArray, null, 2));

    console.log('New wallet created and added to file:', privateKeyLocation);
    return { passphrase: mnemonic, privateKey, publicKey };
};



// Lấy khóa riêng từ ví
/*const getPrivateFromWallet = (): string => {
    const buffer = readFileSync(privateKeyLocation, 'utf8');
    return buffer.toString();
};

// Lấy khóa công khai từ ví
const getPublicFromWallet = (): string => {
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
};*/

const getPrivateFromWallet = (): string => {
    const buffer = readFileSync(privateKeyLocation, 'utf8');
    const walletDataArray = JSON.parse(buffer);

    // Kiểm tra nếu mảng không rỗng, lấy ví cuối cùng
    if (walletDataArray.length > 0) {
        return walletDataArray[walletDataArray.length - 1].privateKey;
    } else {
        throw new Error('No wallets found');
    }
};

// Lấy public key từ ví cuối cùng
const getPublicFromWallet = (): string => {
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
};



// Khởi tạo ví mới với passphrase
const initWallet = async () => {
    if (existsSync(privateKeyLocation)) {
        return;
    }
    const { passphrase, privateKey, publicKey } = await createNewWalletWithPassphrase();
    console.log('Wallet created with Passphrase:', passphrase);
};

// Xóa ví
const deleteWallet = () => {
    if (existsSync(privateKeyLocation)) {
        unlinkSync(privateKeyLocation);
    }
};

// Tính toán số dư
const getBalance = (address: string, unspentTxOuts: UnspentTxOut[]): number => {
    return _(findUnspentTxOuts(address, unspentTxOuts))
        .map((uTxO: UnspentTxOut) => uTxO.amount)
        .sum();
};

// Tìm các Unspent Transaction Outputs
const findUnspentTxOuts = (ownerAddress: string, unspentTxOuts: UnspentTxOut[]) => {
    return _.filter(unspentTxOuts, (uTxO: UnspentTxOut) => uTxO.address === ownerAddress);
};

// Tìm TxOuts để đáp ứng số tiền giao dịch
const findTxOutsForAmount = (amount: number, myUnspentTxOuts: UnspentTxOut[]) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return { includedUnspentTxOuts, leftOverAmount };
        }
    }
    throw Error('Cannot create transaction from the available unspent transaction outputs.');
};

// Tạo đầu ra giao dịch
const createTxOuts = (receiverAddress: string, myAddress: string, amount, leftOverAmount: number) => {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    } else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};

// Lọc transaction pool
const filterTxPoolTxs = (unspentTxOuts: UnspentTxOut[], transactionPool: Transaction[]): UnspentTxOut[] => {
    const txIns: TxIn[] = _(transactionPool)
        .map((tx: Transaction) => tx.txIns)
        .flatten()
        .value();
    const removable: UnspentTxOut[] = [];
    for (const unspentTxOut of unspentTxOuts) {
        const txIn = _.find(txIns, (aTxIn: TxIn) => {
            return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
        });

        if (txIn !== undefined) {
            removable.push(unspentTxOut);
        }
    }
    return _.without(unspentTxOuts, ...removable);
};

// Tạo giao dịch
const createTransaction = (receiverAddress: string, amount: number, privateKey: string,
    unspentTxOuts: UnspentTxOut[], txPool: Transaction[]): Transaction => {

    console.log('txPool: %s', JSON.stringify(txPool));
    const myAddress: string = getPublicKey(privateKey);
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === myAddress);

    const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);
    const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(amount, myUnspentTxOuts);

    const toUnsignedTxIn = (unspentTxOut: UnspentTxOut) => {
        const txIn: TxIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(toUnsignedTxIn);
    const tx: Transaction = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });

    return tx;
};

export { createTransaction, getPublicFromWallet, createNewWalletWithPassphrase, getPrivateFromWallet, getBalance, initWallet, deleteWallet, findUnspentTxOuts };
