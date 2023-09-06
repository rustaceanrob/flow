extern crate electrum_client;
extern crate bitcoin;
use std::{error::Error, cmp::Ordering, collections::HashMap};
use electrum_client::{Client,ElectrumApi};
use bitcoin::{Address, Txid, Transaction};
use rand::Rng;
use turbosql::{select, Turbosql};
use crate::{wallet::actions::{compute_script_pubkey, compute_address, SelectionUTXO, compute_address_info, AddressInfo}, io::tasks::{WalletFile, update_wallet}};
use rayon::prelude::*;

#[derive(Debug, serde::Serialize)]
pub struct UserTransaction {
    pub value: u64,
    pub height: i32,
    pub was_sent: bool,
    pub confirmed: bool,
}

#[derive(Debug)]
pub struct SortableTransaction {
    pub value: u64,
    pub height: i32,
    pub was_sent: bool,
    pub confirmed: bool,
    pub id: Txid,
}

impl SortableTransaction {
    fn new(value: u64, height: i32, was_sent: bool, confirmed: bool, id: Txid ) -> Self {
        SortableTransaction { value, height, was_sent, confirmed, id }
    }
}

#[derive(Turbosql, Clone, Debug, Default)]
pub struct SQLTranscation {
    pub rowid: Option<i64>,
    pub fp: Option<String>,
    pub value: Option<i64>,
    pub height: Option<i32>,
    pub was_sent: Option<bool>,
    pub confirmed: Option<bool>,
    pub txid: Option<String>,
}

fn select_rand_server() -> String {
    let servers = ["ssl://electrum.blockstream.info:50002",];
    let mut rng = rand::thread_rng();
    let random_index = rng.gen_range(0..servers.len());
    servers[random_index].to_string()
}

pub fn get_fee_estimate(blocks: usize) -> Result<f64, Box<dyn Error>> {
    let client = Client::new(select_rand_server().as_str())?;
    let btc_fee = client.estimate_fee(blocks)?;
    let fee = btc_fee * 100_000_000.0 / 1_000.0; //convert to satoshi and convert from kb to bytes
    Ok(fee)
}

pub async fn get_all_fee_estimates() -> Result<Vec<f64>, Box<dyn Error>> {
    let client = Client::new(select_rand_server().as_str())?;
    let mut fees = Vec::new();
    for i in 1..26 {
        let btc_fee = client.estimate_fee(i)?;
        let fee = btc_fee * 100_000_000.0 ; //convert to satoshi
        fees.push(fee.round());
    }
    Ok(fees)
}

pub async fn get_fresh(xpub: &str) -> Result<Address, Box<dyn Error>> {
    let mut wallet = select!(WalletFile "WHERE bip84 = " xpub)?;
    let mut i;
    if wallet.last_receive.is_some() {
        i = wallet.last_receive.unwrap();
    } else {
        i = 0;
    }
    let client = Client::new(select_rand_server().as_str())?;
    loop {
        let script = compute_script_pubkey(xpub, true, i)?;
        let history = client.script_get_history(&script)?;
        if history.len() == 0 {
            let addr = compute_address(xpub, true, i)?;
            wallet.last_receive = Some(i);
            update_wallet(wallet)?;
            break Ok(addr);
        }
        i+=1;
    }
}

pub fn get_fresh_change(xpub: &str) -> Result<AddressInfo, Box<dyn Error>> {
    let mut wallet = select!(WalletFile "WHERE bip84 = " xpub)?;
    let mut i;
    if wallet.last_change.is_some() {
        i = wallet.last_change.unwrap();
    } else {
        i = 0;
    }
    let client = Client::new(select_rand_server().as_str())?;
    loop {
        let script = compute_script_pubkey(xpub, false, i)?;
        let history = client.script_get_history(&script)?;
        if history.len() == 0 {
            let info = compute_address_info(xpub, false, i)?;
            wallet.last_change = Some(i);
            update_wallet(wallet)?;
            break Ok(info);
        }
        i+=1;
    }
}


pub async fn get_balance(xpub: &str, gap: u8) -> Result<i64, Box<dyn Error>> {
    let client = Client::new(select_rand_server().as_str())?;
    let results = rayon::join(|| subaccount_balance(xpub, &client, gap, true).expect("error getting receive balance"), || subaccount_balance(xpub, &client, gap, false).expect("error getting change balance"));
    Ok(results.0 + results.1)
}

fn subaccount_balance(xpub: &str, client: &Client, gap: u8, external: bool) -> Result<i64, Box<dyn Error>> {
    let mut balance = 0 as i64;
    let mut zero_balance = 0;
    let mut i = 0;
    loop {
        let script = compute_script_pubkey(xpub, external, i)?;
        let history = client.script_get_balance(&script)?;
        let address_balance = history.confirmed as i64 + history.unconfirmed;
        balance += address_balance;
        if address_balance == 0 {
            zero_balance += 1;
            if zero_balance > gap {
                break Ok(balance);
            }
        }
        i+=1;
    }
}

pub fn get_all_utxo(xpub: &str, gap: u8) -> Result<Vec<SelectionUTXO>, Box<dyn Error>> {
    let client = Client::new(select_rand_server().as_str())?;
    let mut utxos = Vec::new();
    for account in [true, false] {
        let mut zero_balance = 0;
        let mut i = 0;
        loop {
            let script = compute_script_pubkey(xpub, account, i)?;
            let info = compute_address_info(xpub, account, i)?;
            let utxo = client.script_list_unspent(&script)?;
            let length = utxo.len();
            utxos.extend(utxo.iter().map(|utxo| SelectionUTXO { id: utxo.tx_hash, index: utxo.tx_pos, value: utxo.value as f64, script: script.clone(), info: info.clone()}));
            if length == 0 {
                zero_balance += 1;
                if zero_balance > gap {
                    break;
                }
            }
            i+=1;
        }   
    }
    Ok(utxos)
}

pub fn broadcast(tx: Transaction) -> Result<(), Box<dyn Error>> {
    let client = Client::new(select_rand_server().as_str())?;
    client.transaction_broadcast(&tx)?;
    Ok(())
}

pub async fn get_tx_history(xpub: &str, gap: u8) -> Result<Vec<SortableTransaction>, Box<dyn Error>>  {
    let mut received = Vec::new();
    let mut change = Vec::new();
    let mut sent = Vec::new();

    let client = Client::new(select_rand_server().as_str())?;

    for account in [true, false] {
        let mut zero_balance = 0;
        let mut i = 0;
        loop {
            let script_buf = compute_script_pubkey(xpub, account, i).expect("address formation error");
            let history: Vec<electrum_client::GetHistoryRes> = client.script_get_history(&script_buf).expect("error fetching from script pubkey");
            if history.len() == 0 {
                i+=1;
                zero_balance+=1;
                if zero_balance > gap {
                    break
                }
            }
            for tx in history {
                let txid = tx.tx_hash;
                let transaction = client.transaction_get(&txid)?;
                let inputs = transaction.input;
                let outputs = transaction.output;
                for out in outputs {
                    if script_buf == out.script_pubkey && account {
                        let confirmed = tx.height > 0;
                        received.push(SortableTransaction::new(out.value, tx.height, false, confirmed, txid));
                    } 
                    if script_buf == out.script_pubkey && !account {
                        change.push((txid, out.value as i64));
                    } 
                }
                let mut sent_val = 0;
                for inp in inputs {
                    let prev_out = client.transaction_get(&inp.previous_output.txid)?;
                    for out in prev_out.output {
                        if script_buf == out.script_pubkey {
                            sent_val += out.value;
                        }
                    } 
                }
                if sent_val > 0 {
                    sent.push((txid, tx.height, sent_val as i64));
                }
            }
            i+=1;
        }
    }

    let mut net_map: HashMap<&Txid, (i32, i64)> = std::collections::HashMap::new();
    
    // Collect values from the spent vector
    for (txid, height, spent_value) in &sent {
        if let Some(tx) = net_map.get(txid) {
            net_map.insert(txid, (*height, *spent_value + tx.1));
        } else {
            net_map.entry(txid).or_insert_with(||  (*height, *spent_value));
        }
    }

    // Subtract values from the change vector
    for (txid, change_value) in &change {
        if let Some(net_value) = net_map.get_mut(txid) {
            net_value.1 = net_value.1 - change_value;
        }
    }

    // Convert the HashMap back into a vector of tuples
    let net: Vec<(&Txid, (i32, i64))> = net_map.into_iter().collect();
    for (id,  v) in net {
        if v.1 < 0 {
            continue;
        } else {
            let confirmed = v.0 > 0;
            received.push(SortableTransaction::new(v.1 as u64, v.0, true, confirmed, *id));
        }
    }
    received.par_sort_unstable_by(|a, b| { 
        if !a.confirmed {
            Ordering::Less
        } else if !b.confirmed{
            Ordering::Greater
        } else {
            if a.height > b.height {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        }
    });
    Ok(received)
}

pub async fn update_tx_history_table(fp: &str, xpub: &str, gap: u8) -> Result<bool, Box<dyn Error>> {
    let hist = get_tx_history(xpub, gap).await?;
    let mut should_refresh = false;
    for tx in hist {
        let str_id = tx.id.to_string();
        let sql_tx = select!(SQLTranscation "WHERE txid = " str_id " AND fp = " fp.to_string());
        match sql_tx {
            Ok(_) => {
                continue;
            },
            Err(_) => {
                should_refresh = true;
                SQLTranscation { fp: Some(fp.into()), 
                                value: Some(tx.value as i64), 
                                height: Some(tx.height), 
                                was_sent: Some(tx.was_sent), 
                                confirmed: Some(tx.confirmed), 
                                txid: Some(str_id), ..Default::default()}.insert()?;
            },
        }
    }
    Ok(should_refresh)
}

pub async fn return_tx_table(fp: &str) -> Result<Vec<UserTransaction>, Box<dyn Error>> {
    let txs = select!(Vec<SQLTranscation> "WHERE fp = " fp.to_string())?;
    // execute!("DELETE FROM sqltranscation")?;
    let user_txs = txs.iter().map(|tx| {
        UserTransaction { value: tx.value.unwrap() as u64, confirmed: tx.confirmed.unwrap(), height: tx.height.unwrap(), was_sent: tx.was_sent.unwrap() }
    }).collect();
    Ok(user_txs)
}