export interface AmountDetails {
  tip: Tip;
}

export interface Tip {}

export interface Charges {
  object: string;
  data: any[][];
  has_more: boolean;
  total_count: number;
  url: string;
}

export interface Metadata {}

export interface PaymentMethodOptions {
  card: Card;
}

export interface Card {
  installments: any;
  mandate_options: any;
  network: any;
  request_three_d_secure: string;
}

export interface LastPaymentError {
  message: string;
  payment_method: PaymentMethod;
  type: string;
}

export interface PaymentMethod {
  id: string;
  object: string;
  allow_redisplay: string;
  billing_details: any[];
  card: any[];
  created: number;
  customer: any;
  livemode: boolean;
  metadata: Metadata;
  type: string;
}

export interface Metadata {}

export interface StripeSuccessIntent {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: AmountDetails;
  amount_received: number;
  application: any;
  application_fee_amount: any;
  automatic_payment_methods: any;
  canceled_at: any;
  cancellation_reason: any;
  capture_method: string;
  charges: Charges;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string;
  description: any;
  invoice: any;
  last_payment_error: any;
  latest_charge: string;
  livemode: boolean;
  metadata: Metadata;
  next_action: any;
  on_behalf_of: any;
  payment_method: string;
  payment_method_configuration_details: any;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  processing: any;
  receipt_email: any;
  review: any;
  setup_future_usage: any;
  shipping: any;
  source: any;
  statement_descriptor: any;
  statement_descriptor_suffix: any;
  status: string;
  transfer_data: any;
  transfer_group: any;
}

export interface StripeFailedIntent {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: AmountDetails;
  amount_received: number;
  application: any;
  application_fee_amount: any;
  automatic_payment_methods: any;
  canceled_at: any;
  cancellation_reason: any;
  capture_method: string;
  charges: Charges;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string;
  description: any;
  invoice: any;
  last_payment_error: LastPaymentError;
  latest_charge: any;
  livemode: boolean;
  metadata: Metadata;
  next_action: any;
  on_behalf_of: any;
  payment_method: any;
  payment_method_configuration_details: any;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  processing: any;
  receipt_email: any;
  review: any;
  setup_future_usage: any;
  shipping: any;
  source: any;
  statement_descriptor: any;
  statement_descriptor_suffix: any;
  status: string;
  transfer_data: any;
  transfer_group: any;
}

export interface StripeCustomer {
  id: string;
  object: string;
  address: any;
  balance: number;
  created: number;
  currency: any;
  default_source: any;
  delinquent: boolean;
  description: any;
  discount: any;
  email: string;
  invoice_prefix: string;
  invoice_settings: InvoiceSettings;
  livemode: boolean;
  metadata: Metadata;
  name: string;
  next_invoice_sequence: number;
  phone: any;
  preferred_locales: any[];
  shipping: any;
  tax_exempt: string;
  test_clock: any;
}

export interface InvoiceSettings {
  custom_fields: any;
  default_payment_method: any;
  footer: any;
  rendering_options: any;
}

export interface Metadata {
  orderId: string;
  type: string;
  userId: string;
  product?: string;
}
