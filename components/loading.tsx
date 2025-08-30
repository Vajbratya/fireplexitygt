import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text: string;
  fullscreen?: boolean;
}

const Loading = ({ text, fullscreen = false }: LoadingProps) => {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-lg text-gray-600 dark:text-gray-300">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
};

export default Loading;
