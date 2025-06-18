import { Injectable, OnModuleInit } from '@nestjs/common';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class TelemetryService implements OnModuleInit {
  private readonly tracer = trace.getTracer('find-my-buddy-auth');

  onModuleInit() {
    // The tracer is initialized when the service is created
    console.log('TelemetryService initialized');
  }

  /**
   * Log an error with OpenTelemetry
   * @param error The error to log
   * @param context Additional context information
   */
  logError(error: Error, context: Record<string, any> = {}) {
    const currentSpan = trace.getActiveSpan();
    
    if (currentSpan) {
      // If there's an active span, record the error on it
      currentSpan.recordException(error);
      currentSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      
      // Add any additional context as attributes
      Object.entries(context).forEach(([key, value]) => {
        currentSpan.setAttribute(key, String(value));
      });
    } else {
      // If there's no active span, create a new one for the error
      this.tracer.startActiveSpan('error', (span) => {
        span.recordException(error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        
        // Add error details as attributes
        span.setAttribute('error.type', error.name);
        span.setAttribute('error.message', error.message);
        span.setAttribute('error.stack', error.stack || '');
        
        // Add any additional context as attributes
        Object.entries(context).forEach(([key, value]) => {
          span.setAttribute(key, String(value));
        });
        
        span.end();
      });
    }
    
    // Log to console as well for local development
    console.error('Error logged with OpenTelemetry:', error.message, context);
  }
}