import { LoaderCircle } from 'lucide-react';

const Loader = () => (
  <div className="bg-slate-50 h-screen flex flex-grow items-center justify-center">
    <LoaderCircle size={60} className="animate-spin text-orange-400" />
  </div>
);

export default Loader;
