const label = ({ children, req }) => {
  return (
    <p className="mb-1.5 text-[12px] font-bold text-gray-700">
      {children}
      {req && <span className="ml-0.5 text-red-400">*</span>}
    </p>
  );
};

export default label;