import React, { useRef, useState } from "react";
import styled from 'styled-components'
import axios from "axios"; // Make sure to install axios: npm install axios
import toast from 'react-hot-toast';

const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
position: relative;
z-index: 0;
align-items: center;
@media (max-width: 960px) {
    padding: 0px;
}
`

const Wrapper = styled.div`
position: relative;
display: flex;
justify-content: space-between;
align-items: center;
flex-direction: column;
width: 100%;
max-width: 1350px;
padding: 0px 0px 80px 0px;
gap: 12px;
@media (max-width: 960px) {
    flex-direction: column;
}
`

const Title = styled.div`
font-size: 42px;
text-align: center;
font-weight: 600;
margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
      margin-top: 12px;
      font-size: 32px;
  }
`;

const Desc = styled.div`
    font-size: 18px;
    text-align: center;
    max-width: 600px;
    color: ${({ theme }) => theme.text_secondary};
    @media (max-width: 768px) {
        margin-top: 12px;
        font-size: 16px;
    }
`;


const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card};
  padding: 32px;
  border-radius: 16px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  margin-top: 28px;
  gap: 12px;
`

const ContactTitle = styled.div`
  font-size: 24px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`

const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
  ${({ error }) => error && `
    border-color: red;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
  `}
`

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
  ${({ error }) => error && `
    border-color: red;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
  `}
`

const ContactButton = styled.button`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  background: -moz-linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  background: -webkit-linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  padding: 13px 16px;
  margin-top: 2px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.from_name) newErrors.from_name = "Name is required";
    if (!formData.from_email) {
      newErrors.from_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.from_email)) {
      newErrors.from_email = "Email is invalid";
    }
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://portfolio-backend-z12p.onrender.com/api/contact/submit",
        {
          name: formData.from_name,
          email: formData.from_email,
          subject: formData.subject,
          message: formData.message,
        }
      );
      
      if (response.data.success) {
        console.log("Success true");
        
        toast.success("Email sent successfully!");
        setFormData({
          from_name: "",
          from_email: "",
          subject: "",
          message: "",
        }); // Clear form
        setErrors({});
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Contact</Title>
        <Desc>Feel free to reach out to me for any questions or opportunities!</Desc>
        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          <ContactInput
            placeholder="Your Email"
            name="from_email"
            value={formData.from_email}
            onChange={handleChange}
            error={!!errors.from_email}
          />
          {errors.from_email && <span style={{ color: "red" }}>{errors.from_email}</span>}
          <ContactInput
            placeholder="Your Name"
            name="from_name"
            value={formData.from_name}
            onChange={handleChange}
            error={!!errors.from_name}
          />
          {errors.from_name && <span style={{ color: "red" }}>{errors.from_name}</span>}
          <ContactInput
            placeholder="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={!!errors.subject}
          />
          {errors.subject && <span style={{ color: "red" }}>{errors.subject}</span>}
          <ContactInputMessage
            placeholder="Message"
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={!!errors.message}
          />
          {errors.message && <span style={{ color: "red" }}>{errors.message}</span>}
          <ContactButton type="submit" disabled={loading}>
            {loading && <LoadingSpinner />}
            {loading ? "Sending..." : "Send"}
          </ContactButton>
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;