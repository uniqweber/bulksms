import React from "react";
import {Check, Star, ArrowRight} from "lucide-react";

const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for small businesses getting started",
            features: [
                "5,000 messages/month",
                "Basic analytics",
                "Contact management",
                "Email support",
                "99% delivery rate",
                "API access",
            ],
            buttonText: "Start Free Trial",
            popular: false,
        },
        {
            name: "Professional",
            price: "$99",
            period: "/month",
            description: "Ideal for growing businesses with higher volume",
            features: [
                "50,000 messages/month",
                "Advanced analytics",
                "Contact segmentation",
                "Priority support",
                "99.5% delivery rate",
                "API access",
                "Two-way messaging",
                "Custom sender ID",
            ],
            buttonText: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "Tailored solutions for large organizations",
            features: [
                "Unlimited messages",
                "Advanced reporting",
                "Dedicated account manager",
                "24/7 phone support",
                "99.9% delivery rate",
                "Full API access",
                "White-label options",
                "Custom integrations",
                "SLA guarantees",
            ],
            buttonText: "Contact Sales",
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent <span className="text-blue-600">Pricing</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose the perfect plan for your business. All plans include free setup and 24/7 support.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 ">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl p-8 ${
                                plan.popular
                                    ? "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500 transform scale-105"
                                    : "bg-white border-2 border-gray-200"
                            } hover:shadow-xl transition-all duration-300`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                                        <Star className="w-4 h-4" />
                                        <span>Most Popular</span>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-6">{plan.description}</p>
                                <div className="flex items-center justify-center">
                                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 ml-1">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center">
                                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 px-6 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                                    plan.popular
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                }`}
                            >
                                <span>{plan.buttonText}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">30-day money-back guarantee</span>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20 bg-gray-50 rounded-3xl p-12">
                    {/* <h3 className="text-2xl font-bold text-gray-900 mb-8 ">Pricing FAQ</h3> */}
                    <div className="grid md:grid-cols-2 gap-8  mx-auto">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h4>
                            <p className="text-gray-600">
                                Yes, you can change your plan at any time. Changes take effect immediately.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                                What happens if I exceed my message limit?
                            </h4>
                            <p className="text-gray-600">
                                We&apos;ll notify you before you reach your limit. Additional messages are charged at
                                standard rates.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Do you offer custom pricing for high volume?
                            </h4>
                            <p className="text-gray-600">
                                Yes, we offer volume discounts for businesses sending over 1 million messages monthly.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
                            <p className="text-gray-600">
                                No setup fees for any plan. We&apos;ll help you get started at no additional cost.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
