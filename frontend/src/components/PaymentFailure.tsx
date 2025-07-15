function PaymentFailure() {
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  return <div>PaymentFailure{sessionId}</div>;
}

export default PaymentFailure;
