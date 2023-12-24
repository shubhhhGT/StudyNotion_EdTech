import React from "react";
import ContactUsForm from "../../../common/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="mx-auto">
      <div className="text-center text-4xl font-semibold">Get in Touch</div>
      <p className="text-center text-richblack-300 mt-3">
        We’d love to hear from you, Please fill out this form.
      </p>
      <div className="mt-12 mx-auto">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
