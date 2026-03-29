import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { SampleService } from "./gen/api/v1/data_connect";

export const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:8080",
});

export const client = createPromiseClient(SampleService, transport);
