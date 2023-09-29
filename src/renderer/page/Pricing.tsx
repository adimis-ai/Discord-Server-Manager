import React, { useState, useEffect } from 'react';
import './PricingPage.css';
import { useNavigate } from 'react-router-dom';

type PlanProps = {
  name: string;
  price: string;
  period: string;
  benefits: string[];
  popular: boolean;
  planId: string;
};

const Plan: React.FC<PlanProps> = ({ name, price, period, benefits, popular, planId }) => {
  const navigate = useNavigate();

  const planCheckOutUrlGenerator = (planId) => {
    const checkOutUrl = `https://simplifi.memberful.com/checkout?plan=${planId}`;
    console.log(checkOutUrl);
    return checkOutUrl;
  };

  const handleGetStarted = async () => {
    await window.electron.store.set("selectedPlanId", planId)
    const url = await planCheckOutUrlGenerator(
      window.electron.store.get('selectedPlanId')
    );
    console.log('Generated checkout URL:', url);
    window.open(url, '_blank');
    console.log('Opened checkout URL in a new tab');
    navigate("/auth")
  };

  return (
    <div className={`plan ${popular ? 'popular' : ''}`}>
      {popular && <span className="popular-badge">Most Popular!</span>}
      <h2 className="plan__title">{name}</h2>
      <div className="plan__price-container">
        {popular ? (
          <>
            <p className="plan__price plan__price--main">{price}</p>
            <p className="plan__price plan__price--discounted">$48</p>
          </>
        ) : (
          <p className="plan__price">{price}</p>
        )}
      </div>
      <p className="plan__period">{period}</p>
      <ul className="plan__benefits">
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
      <button className="plan__button" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

const Pricing: React.FC = () => {
  const benefits = [
    'Access to all features',
    'Priority support',
    'Cancel anytime',
  ];

  return (
    <div className="pricing-page">
      <h1 className="pricing-page__title">Choose Your Plan</h1>
      <div className="pricing-page__plans">
        <Plan
          name="Monthly"
          price="$5"
          period="per month"
          benefits={benefits}
          popular={false}
          planId="95696" // Plan ID for $5 plan
        />
        <Plan
          name="Yearly"
          price="$60"
          period="per year"
          benefits={benefits}
          popular={true}
          planId="95687" // Plan ID for $48 plan
        />
      </div>
    </div>
  );
};

export default Pricing;