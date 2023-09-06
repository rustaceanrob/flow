extern crate reqwest;

pub async fn get_mempool_stats() -> Result<String, Box<dyn std::error::Error>> {
    let resp = reqwest::get("https://blockstream.info/api/mempool").await?.text().await?;
    Ok(resp)
}

pub async fn get_mempool_txs() -> Result<String, Box<dyn std::error::Error>>{
    let resp = reqwest::get("https://blockstream.info/api/mempool/recent").await?.text().await?;
    Ok(resp)
}

pub async fn get_nodes_count() -> Result<String, Box<dyn std::error::Error>>{
    let resp = reqwest::get("https://bitnodes.io/api/v1/snapshots/latest").await?.text().await?;
    Ok(resp)
}

pub async fn get_fiat() -> Result<String, Box<dyn std::error::Error>>{
    let resp = reqwest::get("https://api.coincap.io/v2/assets/bitcoin").await?.text().await?;
    Ok(resp)
}

pub async fn get_fiat_history() -> Result<String, Box<dyn std::error::Error>>{
    let resp = reqwest::get("https://api.coincap.io/v2/assets/bitcoin/history?interval=m30").await?.text().await?;
    Ok(resp)
}