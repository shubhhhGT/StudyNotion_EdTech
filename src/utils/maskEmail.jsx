
const maskEmail = ({ email }) => {
  // Extract local part and domain from the email
  const [localPart, domain] = email.split('@');

  // Mask the local part
  const maskedLocalPart = '*'.repeat(localPart.length - 4);

  // Construct the masked email
  const maskedEmail = `${localPart.substring(0, 2)}${maskedLocalPart}${localPart.slice(-2)}@${domain}`;

  return (
    maskedEmail
  );
};

export default maskEmail;
