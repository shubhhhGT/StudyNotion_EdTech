import { useSelector } from "react-redux";
import frameImg from "../../../assets/Images/frame.webp";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function Template({
  title,
  description1,
  description2,
  image,
  formType,
}) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid place-items-center min-h-[calc(100vh-3.5rem)]">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
          {/* Left Div */}
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-3xl font-semibold leading-9 text-richblack-5">
              {title}
            </h1>

            <p className="mt-4 text-xl leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>

            {formType === "login" ? <LoginForm /> : <SignupForm />}
          </div>

          {/* Right Div */}
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Users"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
