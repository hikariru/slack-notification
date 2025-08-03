import { LogLevel } from "@slack/logger";
import { httpClient } from "../../lib/httpClient";
import logger from "../../lib/logger";

// Define interfaces for test responses
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface HttpBinResponse {
  // This is a placeholder for httpbin.org response
  // The actual structure doesn't matter for the timeout test
  url: string;
  [key: string]: unknown;
}

// Set logger to INFO level for testing
logger.setLevel(LogLevel.INFO);

// Test successful request
const testSuccessfulRequest = async () => {
  try {
    logger.info("Testing successful request...");
    const response = await httpClient.get<Todo>("https://jsonplaceholder.typicode.com/todos/1");
    logger.info("Successful response:", response);
    return true;
  } catch (error) {
    logger.error("Error in successful request test:", error);
    return false;
  }
};

// Test request with timeout
const testTimeoutRequest = async () => {
  try {
    logger.info("Testing timeout request...");
    // Using a very short timeout to force a timeout error
    const response = await httpClient.get<HttpBinResponse>("https://httpbin.org/delay/5", {}, 1000);
    logger.info("Timeout response (should not reach here):", response);
    return false;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.info("Expected timeout error:", errorMessage);
    return errorMessage.includes("timeout");
  }
};

// Test request with retry (404 should not retry)
const testNonRetryableRequest = async () => {
  try {
    logger.info("Testing non-retryable request (404)...");
    const response = await httpClient.get<Todo>("https://jsonplaceholder.typicode.com/nonexistent");
    logger.info("Non-retryable response (should not reach here):", response);
    return false;
  } catch (error) {
    // Should fail immediately without retries
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.info("Expected 404 error:", errorMessage);
    return errorMessage.includes("404");
  }
};

// Run tests
const runTests = async () => {
  logger.info("Starting HTTP client tests...");

  const successTest = await testSuccessfulRequest();
  logger.info(`Successful request test: ${successTest ? "PASSED" : "FAILED"}`);

  const timeoutTest = await testTimeoutRequest();
  logger.info(`Timeout request test: ${timeoutTest ? "PASSED" : "FAILED"}`);

  const nonRetryableTest = await testNonRetryableRequest();
  logger.info(`Non-retryable request test: ${nonRetryableTest ? "PASSED" : "FAILED"}`);

  logger.info("All tests completed.");
};

runTests().catch((error) => {
  logger.error("Error running tests:", error);
});
