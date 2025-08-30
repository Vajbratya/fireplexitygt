import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer">
              <Image src="/firecrawl-logo.svg" alt="Firecrawl" width={32} height={32} />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by{' '}
              <Link href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-500">
                Firecrawl
              </Link>
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="https://github.com/mendableai/fireplexity" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              GitHub
            </Link>
            <Link href="https://firecrawl.dev/docs" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Docs
            </Link>
            <Link href="https://x.com/firecrawl_dev" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Twitter
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Firecrawl, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
