import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { login } from "../../auth/auth.slice";

import { CompanyAuthService } from "../services/AuthServices";
import { handleApiError } from "../../../utils/apiError";
import socket from "../../../socket/socket";

import SiteInfoNav from "../../../components/SiteInfoNav";
import SiteInfoFooter from "../../../components/SiteInfoFooter";

const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    }),
});

type SignInFormState = z.infer<typeof signInSchema>;

function SignInPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<SignInFormState>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<SignInFormState>>({});
  const [formError, setFormError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    localStorage.removeItem("otpTimer");
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/company/dashboard");
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");

    const validation = signInSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<SignInFormState> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignInFormState;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const { email, password } = formData;
      const res = await CompanyAuthService.signIn({ email, password });
      console.log("ressignin", res);
      const company = res.data;
      dispatch(
        login({
          id: company.id,
          name: company.companyName,
          email: company.email,
          role: "company",
          profilePicture: "",
          isVerified: company.isVerified,
          isBlocked: company.isBlocked,
          username: company.username,
        })
      );

      if (!socket.connected) {
        socket.connect();
        socket.emit("login", company.id);
      }

      navigate("/company/dashboard");
    } catch (error) {
      console.log("error", error);
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <SiteInfoNav />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your company account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a
              href="/company/signup"
              className="font-medium text-black hover:text-gray-800"
            >
              create a new account
            </a>
          </p>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-800 text-sm p-3 rounded">
            {formError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <a
              href="/company/forget-password"
              className="text-black hover:text-gray-800"
            >
              Forgot your password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {loading && (
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        {/* <Googlebutton /> */}
      </div>
      {/* <SiteInfoFooter /> */}
    </div>
  );
}

export default SignInPage;
