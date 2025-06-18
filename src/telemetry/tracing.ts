import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
// @ts-ignore - Ignore type incompatibility between different versions of OpenTelemetry packages

// Configure the SDK with auto-instrumentation
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'find-my-buddy-auth',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  // @ts-ignore - Ignore type incompatibility between different versions of OpenTelemetry packages
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({
      // The OTLP endpoint to send traces to
      // Default: http://localhost:4318/v1/traces
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    })
  ),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Enable all auto-instrumentations
      '@opentelemetry/instrumentation-fs': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-nestjs-core': { enabled: true },
    }),
  ],
});

// Initialize the SDK and register with the OpenTelemetry API
// This enables the API to record telemetry
export function initializeTracing() {
  try {
    sdk.start();
    console.log('OpenTelemetry tracing initialized');

    // Gracefully shut down the SDK on process exit
    process.on('SIGTERM', () => {
      sdk.shutdown()
        .then(() => console.log('OpenTelemetry SDK shut down successfully'))
        .catch((error) => console.error('Error shutting down OpenTelemetry SDK', error))
        .finally(() => process.exit(0));
    });

    return sdk;
  } catch (error) {
    console.error('Error initializing OpenTelemetry', error);
    throw error;
  }
}
