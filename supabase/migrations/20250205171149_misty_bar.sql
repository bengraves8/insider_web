/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `org_id` (uuid, references organizations)
      - `contact_id` (uuid, references contacts)
      - `name` (text)
      - `amount` (numeric)
      - `status` (text)
      - `type` (text)
      - `platform` (text)
      - `platform_transaction_id` (text, optional)
      - `probability` (integer)
      - `date` (timestamptz)
      - `notes` (text, optional)
      - `metadata` (jsonb, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to manage their own transactions
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) NOT NULL,
  contact_id uuid REFERENCES contacts(id) NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  type text NOT NULL CHECK (type IN ('donation', 'purchase', 'subscription', 'other')),
  platform text NOT NULL CHECK (platform IN ('stripe', 'manual', 'other')),
  platform_transaction_id text,
  probability integer NOT NULL CHECK (probability >= 0 AND probability <= 100),
  date timestamptz NOT NULL,
  notes text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view transactions in their organization"
  ON transactions
  FOR SELECT
  USING (
    org_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transactions in their organization"
  ON transactions
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update transactions in their organization"
  ON transactions
  FOR UPDATE
  USING (
    org_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete transactions in their organization"
  ON transactions
  FOR DELETE
  USING (
    org_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS transactions_org_id_idx ON transactions(org_id);
CREATE INDEX IF NOT EXISTS transactions_contact_id_idx ON transactions(contact_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON transactions(date);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();