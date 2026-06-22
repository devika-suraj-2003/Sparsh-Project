import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpeg';

const About: React.FC = () => {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)'
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight">Sparsh IQ</h1>
            <p className="mt-2 text-lg text-white/80">HSR Layout, Bengaluru</p>
          </div>
          <div className="hidden md:block">
            {/* keep About-only signup link intact; Home header removed elsewhere */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({ signup: true }, '', '/?signup=1');
                window.location.href = '/?signup=1';
              }}
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/20"
            >
              Sign Up Page
            </a>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl bg-white/6 p-8 backdrop-blur-lg border border-white/10 shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-white">Procurement & Inventory Management System</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              A centralized platform designed to streamline the complete procurement lifecycle, from BOM creation and vendor quotation management to inventory tracking and purchase order processing. The system provides real-time visibility into material requirements, stock availability, supplier performance, and procurement activities, helping teams improve efficiency, reduce costs, and ensure timely project execution.
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-white">Key Features</h3>
              <ul className="mt-3 space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>BOM Management and Version Control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Vendor Quote Comparison and Evaluation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Real-Time Inventory Monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Automated Purchase Order Generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Procurement Workflow Tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Delivery and Shipment Management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Analytics and Operational Insights</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-3xl px-6 py-3 font-semibold text-white shadow-lg"
                style={{
                  background: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)'
                }}
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({ signup: true }, '', '/?signup=1');
                  window.location.href = '/?signup=1';
                }}
              >
                Get Started
              </motion.a>

              <a
                href="https://www.google.com/maps?q=HSR%20Layout%2C%20Bengaluru"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/90 underline"
              >
                View on Map
              </a>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            {/* Decorative illustration (abstract blobs + grid) */}
            <svg
              viewBox="0 0 600 400"
              width="100%"
              height="100%"
              className="max-w-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <clipPath id="logoClip">
                  <circle cx="300" cy="170" r="56" />
                </clipPath>
                <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="18" result="b" />
                  <feBlend in="SourceGraphic" in2="b" />
                </filter>
              </defs>

              <g filter="url(#f1)">
                <path fill="#0F172A" d="M0 0h600v400H0z" />
                <circle cx="420" cy="120" r="100" fill="url(#g1)" opacity="0.9" />
                <ellipse cx="160" cy="250" rx="140" ry="90" fill="#1E3A8A" opacity="0.85" />
              </g>

              <g opacity="0.12">
                <rect x="40" y="40" width="520" height="320" rx="28" fill="#fff" />
              </g>

              <g transform="translate(60,60)" opacity="0.95">
                <rect x="0" y="0" width="220" height="120" rx="12" fill="#fff" opacity="0.06" />
                <rect x="260" y="40" width="220" height="220" rx="12" fill="#fff" opacity="0.06" />
              </g>

              {/* logo embedded as image with circular clip */}
              <g>
                <circle cx="300" cy="170" r="64" fill="rgba(255,255,255,0.06)" />
                <image href={logo} x="244" y="114" width="112" height="112" clipPath="url(#logoClip)" preserveAspectRatio="xMidYMid slice" />
                <circle cx="300" cy="170" r="64" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              </g>

              {/* small accent shapes matching brand */}
              <g>
                <rect x="440" y="260" width="80" height="8" rx="4" fill="url(#g1)" opacity="0.9" />
                <rect x="60" y="320" width="140" height="6" rx="3" fill="#1D4ED8" opacity="0.18" />
              </g>
            </svg>
          </motion.div>
        </div>

        <div className="mt-10">
          <h3 className="mb-3 text-lg font-medium text-white">Location (HSR Layout)</h3>
          <div className="overflow-hidden rounded-md border border-white/10">
            <iframe
              title="Sparsh IQ - HSR Layout"
              width="100%"
              height="360"
              loading="lazy"
              src="https://www.google.com/maps?q=HSR%20Layout%2C%20Bengaluru&output=embed"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-3 text-sm text-white/80">Approximate location: HSR Layout, Bengaluru.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
