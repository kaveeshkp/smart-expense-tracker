interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${size}`} />
      {message && <span>{message}</span>}
    </div>
  );
}
