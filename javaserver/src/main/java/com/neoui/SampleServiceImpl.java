package com.neoui;

import api.v1.Data.DataItem;
import api.v1.Data.GetDataRequest;
import api.v1.Data.GetDataResponse;
import api.v1.Data.Status;
import api.v1.Data.SubmitWishRequest;
import api.v1.Data.SubmitWishResponse;
import api.v1.SampleServiceGrpc;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SampleServiceImpl extends SampleServiceGrpc.SampleServiceImplBase {
    private static final Logger logger = LoggerFactory.getLogger(SampleServiceImpl.class);

    @Override
    public void getData(GetDataRequest request, StreamObserver<GetDataResponse> responseObserver) {
        logger.info("Received getData request with query: {}", request.getQuery());

        double networkLatency = 40.0 + (Math.random() * 5);
        double cpuLoad = 75.0 + (Math.random() * 10);
        double memoryUsage = 60.0 + (Math.random() * 10);
        double errorRate = 0.01 + (Math.random() * 0.08);
        String currentTimestamp = java.time.Instant.now().toString();

        GetDataResponse response = GetDataResponse.newBuilder()
            .addItems(DataItem.newBuilder()
                .setId("1")
                .setTitle("Network Latency")
                .setDescription("Real-time network latency from US-East-1")
                .setTimestamp(currentTimestamp)
                .setValue(networkLatency)
                .setType(Status.STATUS_ACTIVE)
                .build())
            .addItems(DataItem.newBuilder()
                .setId("2")
                .setTitle("CPU Load")
                .setDescription("Average CPU load across all worker nodes")
                .setTimestamp(currentTimestamp)
                .setValue(cpuLoad)
                .setType(Status.STATUS_PENDING)
                .build())
            .addItems(DataItem.newBuilder()
                .setId("3")
                .setTitle("Memory Usage")
                .setDescription("Cluster-wide memory consumption")
                .setTimestamp(currentTimestamp)
                .setValue(memoryUsage)
                .setType(Status.STATUS_ACTIVE)
                .build())
            .addItems(DataItem.newBuilder()
                .setId("4")
                .setTitle("Error Rate")
                .setDescription("Number of 5xx errors per second")
                .setTimestamp(currentTimestamp)
                .setValue(errorRate)
                .setType(Status.STATUS_ERROR)
                .build())
            .setStatus("Active (Java gRPC-Web)")
            .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void submitWish(SubmitWishRequest request, StreamObserver<SubmitWishResponse> responseObserver) {
        String wish = request.getWish();
        String user = request.getUser();
        
        logger.info("Received wish from {}: {}", user, wish);

        String confirmationId = "WISH-" + user.length() + "-" + wish.length();

        SubmitWishResponse response = SubmitWishResponse.newBuilder()
            .setSuccess(true)
            .setConfirmationId(confirmationId)
            .setMessage("Wish successfully registered in the NeoUI Matrix.")
            .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
