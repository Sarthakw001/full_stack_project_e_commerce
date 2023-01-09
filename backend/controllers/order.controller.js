import razorpay from "../config/razorpay.config";
import asyncHandler from "../services/asynchandler";

/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/

export const generateRazorPayOrderId = asyncHandler(async (req, res) => {
  // get product from frontend

  // verify the product price from backend by making DB query

  // total amount and final amount - coupon code for final amount

  // coupon check - DB
  let totalAmount;
  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${new Date().getTime()}`,
  };

  const order = await razorpay.orders.create(options);

  // if order does not exist //
  // success then return the response -
});
