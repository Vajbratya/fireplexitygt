import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link href="/" rel="noopener noreferrer">
              <Image src="https://tfbod41w6i.ufs.sh/f/ZJzgmIXu5Ge1sn6kSplc5oASTGquXHFMks4aO9rZ2YWwdjlP" alt="baseevidence por laudos.ai" width={32} height={32} />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by{' '}
              <Link href="/" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-500">
                laudos.ai
              </Link>
            </p>
          </div>
          <div className="flex items-center space-x-6">
            {/* Links can be added here later */}
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} laudos.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
