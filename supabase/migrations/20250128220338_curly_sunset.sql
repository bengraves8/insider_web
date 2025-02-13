/*
  # Create contacts database schema

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `organization` (text)
      - `job_title` (text)
      - `status` (text) - active/archived
      - `tags` (text[])
      - `notes` (text)
      - `last_contacted` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `owner_id` (uuid, references auth.users)
    
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `website` (text)
      - `industry` (text)
      - `created_at` (timestamptz)
      - `owner_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own contacts
    - Add policies for organization access
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  industry text,
  created_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own organizations"
  ON organizations
  USING (auth.uid() = owner_id);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE,
  phone text,
  organization_id uuid REFERENCES organizations(id),
  job_title text,
  status text DEFAULT 'active',
  tags text[] DEFAULT '{}',
  notes text,
  last_contacted timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'archived'))
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contacts"
  ON contacts
  USING (auth.uid() = owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS contacts_owner_id_idx ON contacts(owner_id);
CREATE INDEX IF NOT EXISTS contacts_organization_id_idx ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts(status);
CREATE INDEX IF NOT EXISTS organizations_owner_id_idx ON organizations(owner_id);