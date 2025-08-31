'use client';

import { useEffect } from 'react';

const AboutPage = () => {
  useEffect(() => {
    window.location.href = 'https://laudos.ai';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Redirecting to laudos.ai...
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
