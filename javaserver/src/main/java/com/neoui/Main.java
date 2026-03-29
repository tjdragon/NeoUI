package com.neoui;

import com.linecorp.armeria.server.Server;
import com.linecorp.armeria.server.cors.CorsService;
import com.linecorp.armeria.server.grpc.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        Server server = newServer(8080);
        
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            server.stop().join();
            logger.info("Server stopped.");
        }));
        server.start().join();

        logger.info("🚀 Server listening on http://127.0.0.1:{}", server.activeLocalPort());
    }

    static Server newServer(int port) {
        GrpcService grpcService = GrpcService.builder()
            .addService(new SampleServiceImpl())
            .supportedSerializationFormats(com.linecorp.armeria.common.grpc.GrpcSerializationFormats.values())
            .build();

        return Server.builder()
            .http(port)
            // Decorate with CORS to allow all origins, methods and headers
            .decorator(CorsService.builderForAnyOrigin()
                .allowAllRequestHeaders(true)
                .allowCredentials()
                .newDecorator())
            // Register the GrpcService
            .serviceUnder("/", grpcService)
            .build();
    }
}
