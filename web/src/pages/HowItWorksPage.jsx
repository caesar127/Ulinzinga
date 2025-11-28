import React from "react";
import {
  BanknotesIcon,
  GiftIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const highlightColor = "#FFB300";

function HowItWorksPage() {
  const walletFeatures = [
    {
      icon: <BanknotesIcon className="w-7 h-7 text-white" />,
      title: "Add Money",
      description:
        "Easily top up your Ulinzinga wallet with local payments to participate in events or pay creators.",
    },
    {
      icon: <GiftIcon className="w-7 h-7 text-white" />,
      title: "Event Savings",
      description:
        "Save for your favorite events or exclusive experiences directly in the wallet. Track your progress easily.",
    },
    {
      icon: <ArrowRightOnRectangleIcon className="w-7 h-7 text-white" />,
      title: "Send & Receive Payments",
      description:
        "Pay friends, creators, or vendors securely. Receive payments directly in your wallet with ease.",
    },
    {
      icon: <ClockIcon className="w-7 h-7 text-white" />,
      title: "Track Activity",
      description:
        "Monitor your spending, savings, and transaction history in one place to stay on top of your finances.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      {/* Page Header */}
      <header className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How Ulinzinga Works
        </h1>
        <p className="text-gray-600 text-lg">
          Ulinzinga empowers creators, organizers, and users to connect, share,
          and grow together. Follow these simple steps to start using the
          platform.
        </p>
      </header>

      {/* Steps Section */}
      <section className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3">
        {["Create Your Profile", "Connect & Explore", "Engage & Participate"].map(
          (step, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: highlightColor }}
              >
                <span className="font-bold text-white text-lg">{i + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step}</h3>
              <p className="text-gray-500 text-sm">
                {i === 0 &&
                  "Sign up and set up your personal or business profile to showcase your interests, skills, or events."}
                {i === 1 &&
                  "Discover creators, organizers, and events that match your interests. Connect with like-minded people or follow your favorite creators."}
                {i === 2 &&
                  "Join events, support creators, share content, or save for tickets and exclusive experiences."}
              </p>
            </motion.div>
          )
        )}
      </section>

      {/* Wallet Features Section */}
      <section className="mt-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Wallet Features
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {walletFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-lg flex gap-4 items-start hover:shadow-xl transition cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
            >
              <div
                className="p-4 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: highlightColor }}
              >
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-16 text-center">
        <p className="text-gray-700 mb-4 text-lg">
          Ready to start your Ulinzinga journey?
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-900 transition flex items-center mx-auto gap-2">
          Get Started
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}

export default HowItWorksPage;
