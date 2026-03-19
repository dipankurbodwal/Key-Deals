import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Scale, FileText, AlertCircle, CreditCard, Lock } from 'lucide-react';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/settings" className="p-2 bg-white border border-keydeals-border rounded-full hover:bg-keydeals-bg transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-keydeals-text-secondary" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-keydeals-text-primary tracking-tight">Terms & Conditions</h1>
          <p className="text-keydeals-text-secondary mt-1 font-medium">Last Updated: March 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-keydeals-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-keydeals-action">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
            </div>
            <p className="text-keydeals-text-secondary leading-relaxed">
              By creating an account on Key Deals, you agree to comply with and be bound by these Terms and Conditions. Your continued use of the platform constitutes acceptance of any future updates to these terms.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-keydeals-action">
              <Scale className="w-6 h-6" />
              <h2 className="text-xl font-bold">2. User Roles and Accuracy</h2>
            </div>
            <p className="text-keydeals-text-secondary leading-relaxed">
              Users (Brokers, Developers, Clients, Owners) are responsible for the accuracy of the information provided in their profiles and property listings. Key Deals is a platform for connection and does not guarantee the accuracy of third-party listings. You are solely responsible for verifying the details of any transaction.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-keydeals-action">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-bold">3. Property Listings</h2>
            </div>
            <p className="text-keydeals-text-secondary leading-relaxed">
              All listings must comply with local real estate laws (including RERA where applicable). Key Deals reserves the right to remove any listing that is reported as fraudulent or inaccurate, or that violates our community standards, without prior notice.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-keydeals-action">
              <CreditCard className="w-6 h-6" />
              <h2 className="text-xl font-bold">4. Fees and Payments</h2>
            </div>
            <p className="text-keydeals-text-secondary leading-relaxed">
              Access to certain professional features (Marketplace, Ads, Analytics, etc.) may require a fee. Current rates are managed via the Admin Dashboard and are subject to change at the discretion of Key Deals. All payments are processed securely via our integrated payment gateways.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-keydeals-action">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">5. Limitation of Liability</h2>
            </div>
            <p className="text-keydeals-text-secondary leading-relaxed">
              Key Deals is not responsible for any disputes, financial losses, or legal issues arising between parties (e.g., between an owner, a buyer, and a broker) connected through the platform. We act solely as a facilitator and are not a party to any real estate transactions.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-keydeals-action">
              <Lock className="w-6 h-6" />
              <h2 className="text-xl font-bold">6. Privacy</h2>
            </div>
            <p className="text-keydeals-text-secondary leading-relaxed">
              Your data is handled according to our Privacy Policy, integrated with Supabase Auth for security. We implement industry-standard security measures to protect your information, but cannot guarantee absolute security.
            </p>
          </section>
        </div>

        <div className="bg-keydeals-bg p-6 border-t border-keydeals-border text-center">
          <p className="text-sm text-keydeals-text-secondary">
            If you have any questions regarding these terms, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
