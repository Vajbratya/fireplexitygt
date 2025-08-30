import { Loader2 } from 'lucide-react';

const Loading = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
};

export default Loading;
