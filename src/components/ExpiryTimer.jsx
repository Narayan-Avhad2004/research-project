import { useEffect, useState } from "react";

import "../styles/components/expiry-timer.css";

const ExpiryTimer = ({ expiryDate }) => {
  const calculateTime = () => {
    const difference =
      new Date(expiryDate).getTime() -
      Date.now();

    if (difference <= 0) {
      return {
        expired: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      expired: false,

      days: Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ),

      hours: Math.floor(
        (difference %
          (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      ),

      minutes: Math.floor(
        (difference %
          (1000 * 60 * 60)) /
          (1000 * 60)
      ),

      seconds: Math.floor(
        (difference %
          (1000 * 60)) /
          1000
      ),
    };
  };

  const [timeLeft, setTimeLeft] =
    useState(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [expiryDate]);

  if (timeLeft.expired) {
    return (
      <span className="expiry-timer expired">
        Expired
      </span>
    );
  }

  if (timeLeft.days > 0) {
    return (
      <span className="expiry-timer">
        {timeLeft.days}d{" "}
        {String(timeLeft.hours).padStart(2, "0")}h{" "}
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
    );
  }

  return (
    <span className="expiry-timer urgent">
      {String(timeLeft.hours).padStart(2, "0")}h{" "}
      {String(timeLeft.minutes).padStart(2, "0")}m{" "}
      {String(timeLeft.seconds).padStart(2, "0")}s
    </span>
  );
};

export default ExpiryTimer;