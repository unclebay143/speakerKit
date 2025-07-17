import https from "https";

// Validate environment variable
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY is not defined in environment variables");
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data: any;
}

interface PaymentMetadata {
  userId: string;
  plan: string;
  userEmail: string;
  [key: string]: any;
}

const DEFAULT_TIMEOUT = 15000; // 15 seconds

export const paystackRequest = async (
  options: https.RequestOptions & { timeout?: number },
  data?: any
): Promise<PaystackResponse> => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";

      // Handle HTTP errors
      if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
        return reject(new Error(`Paystack API error: ${res.statusCode}`));
      }

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (!parsedData.status && parsedData.message) {
            reject(new Error(parsedData.message));
          }
          resolve(parsedData);
        } catch (error) {
          reject(new Error("Failed to parse Paystack response"));
        }
      });
    });

    // Set timeout
    req.setTimeout(options.timeout || DEFAULT_TIMEOUT, () => {
      req.destroy(new Error("Request timeout"));
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

export const initializePayment = async (
  email: string,
  amount: number,
  metadata: PaymentMetadata,
  planCode?: string
): Promise<PaystackResponse> => {
  // Validate inputs
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  if (!amount || amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (!metadata?.userId || !metadata?.plan) {
    throw new Error("Metadata must contain userId and plan");
  }

  const path = "/transaction/initialize";
  const amountInKobo = Math.round(amount * 100); // Paystack uses kobo

  const data = {
    email,
    amount: amountInKobo,
    currency: "NGN",
    metadata,
    ...(planCode && { plan: planCode }),
    callback_url: process.env.PAYSTACK_CALLBACK_URL,
  };

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path,
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    timeout: DEFAULT_TIMEOUT,
  };

  try {
    return await paystackRequest(options, data);
  } catch (error) {
    console.error("Payment initialization failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to initialize payment"
    );
  }
};

export const verifyTransaction = async (
  reference: string,
  maxRetries = 3,
  retryCount = 0
): Promise<PaystackResponse> => {
  if (!reference) {
    throw new Error("Transaction reference is required");
  }

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${encodeURIComponent(reference)}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
    timeout: DEFAULT_TIMEOUT,
  };

  try {
    const response = await paystackRequest(options);

    // Handle processing status with retries
    if (response.data?.status === "processing") {
      if (retryCount >= maxRetries) {
        throw new Error(
          "Transaction is still processing after maximum retries"
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return verifyTransaction(reference, maxRetries, retryCount + 1);
    }

    return response;
  } catch (error) {
    console.error("Verification error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Transaction verification failed"
    );
  }
};

export const fetchPlans = async () => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/plan",
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  return paystackRequest(options);
};

export const fetchPlan = async (planCode: string) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/plan/${planCode}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  return paystackRequest(options);
};
