const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-black animate-spin"></div>
        </div>
        <div className="mt-6 text-black tracking-[0.2em] text-sm font-light animate-pulse">
          LOADING PROFILE
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
