fn main() -> Result<(), Box<dyn std::error::Error>> {
    connectrpc_build::Config::new()
        .files(&["../proto/api/v1/data.proto"])
        .includes(&["../proto/"])
        .include_file("_connectrpc.rs")
        .compile()?;
    Ok(())
}
