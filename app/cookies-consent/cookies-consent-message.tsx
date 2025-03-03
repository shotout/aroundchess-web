'use client'
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookiesConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <p className="text-sm">We use cookies to improve your experience. By using our site, you accept our cookie policy.</p>
      <button
        onClick={acceptCookies}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Accept
      </button>
    </div>
  );
}