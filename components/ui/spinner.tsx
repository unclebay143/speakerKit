export function Spinner() {
  return (
    <div className="flex items-center justify-center space-x-1.5 w-8 h-8">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-white rounded-full"
          style={{
            animation: `bounce 1s infinite ease-in-out ${i * 0.2}s`,
            transformOrigin: 'bottom center'
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-6px) scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}