import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerUser } from "./authslice";

const schema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name must not exceed 20 characters"),

  emailid: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters"),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    console.log(data);
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">

      {/* Card */}
      <div className="card w-full max-w-md bg-base-100/95 backdrop-blur-md shadow-2xl">

        <div className="card-body p-8">

          {/* Heading */}
          <div className="text-center mb-5">

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <span className="text-3xl">👤</span>
            </div>

            <h2 className="text-3xl font-bold text-base-content">
              Create Account
            </h2>

            <p className="text-base-content/60 mt-2">
              Create your account and get started
            </p>

          </div>


          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>


            {/* First Name */}
            <div className="form-control mb-4">

              <label className="label">
                <span className="label-text font-semibold">
                  First Name
                </span>
              </label>

              <input
                type="text"
                placeholder="Ravi"
                className={`input input-bordered w-full focus:input-primary ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("firstName")}
              />

              {errors.firstName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.firstName.message}
                  </span>
                </label>
              )}

            </div>


            {/* Email */}
            <div className="form-control mb-4">

              <label className="label">
                <span className="label-text font-semibold">
                  Email
                </span>
              </label>

              <input
                type="email"
                placeholder="ravi@gmail.com"
                className={`input input-bordered w-full focus:input-primary ${
                  errors.emailid ? "input-error" : ""
                }`}
                {...register("emailid")}
              />

              {errors.emailid && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.emailid.message}
                  </span>
                </label>
              )}

            </div>


            {/* Password */}
            <div className="form-control mb-4">

              <label className="label">
                <span className="label-text font-semibold">
                  Password
                </span>
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className={`input input-bordered w-full focus:input-primary ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />

              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}

            </div>


            {/* Backend Error */}
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}


            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-base shadow-lg hover:scale-[1.02] transition-transform"
            >

              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}

            </button>

          </form>


          {/* Login */}
          <div className="divider">OR</div>

          <p className="text-center text-base-content/70">

            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="link link-primary font-bold"
            >
              Login
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;