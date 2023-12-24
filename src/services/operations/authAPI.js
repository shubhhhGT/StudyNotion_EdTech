import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  GETUSER_API,
  SENDPASSRESETEMAIL_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    // Show loading in the toast
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("SENDOTP API RESPONSE..........", response);

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR.......", error);
      toast.error("Could not send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signup(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("SIGNUP API RESPONSE........", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Signed Up Successfully");

      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    // Display a toast and saving it in toast Id so as to remove the same toast (this can also be achieved using promise in react-hot-toast lib)
    const toastId = toast.loading("Loading...");
    // Dispatching
    dispatch(setLoading(true));
    try {
      // Making an api request through apiConnector which is created using an instance of Axios
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE.........", response);

      // Throw error in case response is not received successfully
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Display success toast if there are no errors
      toast.success("Login Successful");

      // Set the token
      dispatch(setToken(response.data.token));

      // Set user Image
      const userImage = response?.data?.existingUser?.image
        ? response.data.existingUser.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      // Set User Profile
      dispatch(setUser({ ...response.data.existingUser, image: userImage }));

      // Set the item in local storage that needs to be used in slices
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.existingUser));

      // Navigate to dashboard once login is sucessful
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR.........", error);
      toast.error("Login Failed!");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESET PASSWORD TOKEN RESPONSE...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN ERROR...", error);
      toast.error("Failed to send email");
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(
  password,
  confirmPassword,
  resetPasswordToken,
  setPassResetComplete
) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        resetPasswordToken,
      });

      console.log("RESET PASSWORD RESPONSE...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password reset successful");
      setPassResetComplete(true);
    } catch (error) {
      console.log("RESET PASSWORD ERROR...", error);
      toast.error("unable to reset password");
    }
    dispatch(setLoading(false));
  };
}

export function getUser(resetPasswordToken) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "GET",
        `${GETUSER_API}/${resetPasswordToken}`
      );

      console.log("GET USER FROM TOKEN RESPONSE...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const email = response.data.user.email;

      // dispatch(setEmail(email));

      return email;
    } catch (error) {
      console.log("GET USER FROM TOKEN ERROR...", error);
    }
    dispatch(setLoading(false));
  };
}

export function passUpdateEmail(email) {
  return async () => {
    try {
      const response = await apiConnector("POST", SENDPASSRESETEMAIL_API, {
        email,
      });

      console.log("PASSWORD UPDATE EMAIL RESPONSE...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log("PASSWORD UPDATE EMAIL ERROR...", error);
    }
  };
}
