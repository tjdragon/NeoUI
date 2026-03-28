use std::future::Future;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use connectrpc::{ConnectError, Context};
use buffa::OwnedView;

// Include generated code
mod gen {
    include!(concat!(env!("OUT_DIR"), "/_connectrpc.rs"));
}

use gen::api::v1::{
    SampleService, SampleServiceExt,
    GetDataRequestView, GetDataResponse, DataItem, Status,
};

struct SampleServiceImpl;

impl SampleService for SampleServiceImpl {
    fn get_data(
        &self,
        ctx: Context,
        _request: OwnedView<GetDataRequestView<'static>>,
    ) -> impl Future<Output = Result<(GetDataResponse, Context), ConnectError>> + Send {
        let result = Ok((
            GetDataResponse {
                items: vec![
                    DataItem {
                        id: "1".into(),
                        title: "Network Latency".into(),
                        description: "Real-time network latency from US-East-1".into(),
                        timestamp: "2024-03-28T12:00:00Z".into(),
                        value: 42.5,
                        r#type: Status::STATUS_ACTIVE.into(),
                        ..Default::default()
                    },
                    DataItem {
                        id: "2".into(),
                        title: "CPU Load".into(),
                        description: "Average CPU load across all worker nodes".into(),
                        timestamp: "2024-03-28T12:05:00Z".into(),
                        value: 78.2,
                        r#type: Status::STATUS_PENDING.into(),
                        ..Default::default()
                    },
                    DataItem {
                        id: "3".into(),
                        title: "Memory Usage".into(),
                        description: "Cluster-wide memory consumption".into(),
                        timestamp: "2024-03-28T12:10:00Z".into(),
                        value: 64.9,
                        r#type: Status::STATUS_ACTIVE.into(),
                        ..Default::default()
                    },
                    DataItem {
                        id: "4".into(),
                        title: "Error Rate".into(),
                        description: "Number of 5xx errors per second".into(),
                        timestamp: "2024-03-28T12:15:00Z".into(),
                        value: 0.05,
                        r#type: Status::STATUS_ERROR.into(),
                        ..Default::default()
                    },
                ],
                ..Default::default()
            },
            ctx,
        ));
        async move { result }
    }
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let svc = Arc::new(SampleServiceImpl);
    let router = connectrpc::Router::new();
    let connect_app = svc.register(router);

    // .into_axum() requires features = ["axum"] which we just added
    let app: axum::Router = connect_app.into_axum_router()
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("🚀 Server listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
