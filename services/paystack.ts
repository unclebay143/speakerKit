import https from "https";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface PaystackResponse {
  status: boolean;
  message: string;
  data: any;
}


export const paystackRequest = async (options: https.RequestOptions, data?: any): Promise<PaystackResponse> => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";

       if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
        return reject(new Error(`Paystack API error: ${res.statusCode}`));
      }

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error("Failed to parse Paystack response"));
        }
      });
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

export const initializePayment = async (email: string, amount: number, metadata: any, planCode?: string) => {
  const path = planCode ? "/transaction/initialize" : "/transaction/initialize";
  
  const data = {
    email,
    amount: amount * 100,
    currency: "NGN",
    metadata,
    ...(planCode && { plan: planCode })
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
  };

  return paystackRequest(options, data);
};

export const verifyTransaction = async (reference: string) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${encodeURIComponent(reference)}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  };

  try {
    const response = await paystackRequest(options);
    
    if (response.data?.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      return verifyTransaction(reference); 
    }
    
    return response;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};

// export const verifyTransaction = async (reference: string) => {
//   const options = {
//     hostname: "api.paystack.co",
//     port: 443,
//     path: `/transaction/verify/${reference}`,
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//     },
//   };

//   return paystackRequest(options);
// };

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







// import https from "https";

// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// interface PaystackResponse {
//   status: boolean;
//   message: string;
//   data: any;
// }

// export const initializePayment = async (params: {
//   email: string;
//   amount: number;
//   plan?: string;
//   metadata?: any;
//   currency?: string;
// }): Promise<PaystackResponse> => {
//   const { email, amount, plan, metadata, currency = "USD" } = params;

//   const payload = JSON.stringify({
//     email,
//     amount: amount * 100,
//     currency,
//     plan,
//     metadata
//   });

//   return makePaystackRequest("/transaction/initialize", payload);
// };

// export const verifyTransaction = async (reference: string): Promise<PaystackResponse> => {
//   return makePaystackRequest(`/transaction/verify/${reference}`, null, "GET");
// };

// export const createPlan = async (params: {
//   name: string;
//   amount: number;
//   interval: string;
//   description?: string;
// }): Promise<PaystackResponse> => {
//   const { name, amount, interval, description } = params;
  
//   const payload = JSON.stringify({
//     name,
//     amount: amount * 100,
//     interval,
//     description,
//     currency: "USD"
//   });

//   return makePaystackRequest("/plan", payload);
// };

// export const listPlans = async (): Promise<PaystackResponse> => {
//   return makePaystackRequest("/plan", null, "GET");
// };

// const makePaystackRequest = async (
//   path: string,
//   payload: string | null,
//   method: string = "POST"
// ): Promise<PaystackResponse> => {
//   return new Promise((resolve, reject) => {
//     const options = {
//       hostname: "api.paystack.co",
//       port: 443,
//       path,
//       method,
//       headers: {
//         Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//         "Content-Type": "application/json"
//       }
//     };

//     const req = https.request(options, (res) => {
//       let data = "";

//       res.on("data", (chunk) => {
//         data += chunk;
//       });

//       res.on("end", () => {
//         try {
//           resolve(JSON.parse(data));
//         } catch (e) {
//           reject(e);
//         }
//       });
//     });

//     req.on("error", (error) => {
//       reject(error);
//     });

//     if (payload) {
//       req.write(payload);
//     }
//     req.end();
//   });
// };