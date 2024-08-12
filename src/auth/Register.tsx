// RegistrationForm.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../common/store";
import { registerUser } from "../service/auth.service";
import { toggleLoading } from "../slice/loaderSlice";
import { setUser } from "../slice/userSlice";
import "../styles/registration.css";
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegistrationForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAutheticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isAutheticated) navigate("/home");
  }, []);

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName || formData.firstName.trim() === "") {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName || formData.lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        dispatch(toggleLoading(true));
        const res: any = await registerUser(formData);
        const userData = res.userData;
        dispatch(setUser(userData));
        dispatch(toggleLoading(false));
        navigate("/home");
      } catch (error) {
        dispatch(toggleLoading(false));
      }

      // Handle form submission (e.g., send data to API)
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;