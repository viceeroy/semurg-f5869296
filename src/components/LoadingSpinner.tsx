interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;