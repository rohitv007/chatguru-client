import { LoaderCircle } from 'lucide-react';

const Loader = () => (
  <div className="h-dvh bg-slate-50 flex flex-grow items-center justify-center">
    <LoaderCircle
      strokeWidth={1.25}
      size={70}
      className="animate-spin-fast text-orange-400"
    />
  </div>
);

export default Loader;
