const onSigExit = () => process.exit(0);

export const handleSigTerm = () => {
  process.on('SIGINT', onSigExit);
  process.on('SIGTERM', onSigExit);
};
