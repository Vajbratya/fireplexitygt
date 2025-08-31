import Link from 'next/link';
import Footer from '@/components/footer';
import Image from 'next/image';

const MissionPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="px-4 sm:px-6 lg:px-8 py-1 mt-2">
        <div className="max-w-[1216px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/firecrawl-wordmark.svg"
              alt="Firecrawl Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>
      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Our Mission
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We believe that access to medical knowledge should be universal and unrestricted. Our mission is to democratize healthcare information, making it freely available to professionals, researchers, and the public. By leveraging cutting-edge AI, we aim to break down barriers, foster innovation, and empower a healthier world for everyone.
          </p>
        </div>
        <div className="mt-12 text-center">
          <Link href="/" className="text-orange-500 hover:text-orange-600 font-semibold">
            &larr; Back to Search
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MissionPage;
