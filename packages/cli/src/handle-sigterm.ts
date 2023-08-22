export const handleSigTerm = () => {
  const handleSigTerm = () => process.exit(0);
  process.on('SIGINT', handleSigTerm);
  process.on('SIGTERM', handleSigTerm);
};
